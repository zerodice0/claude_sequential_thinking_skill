# Example: Systematic Debugging

체계적 디버깅에 sequential thinking을 적용하는 예시입니다. SKILL.md의 Example 2와 동일한 시나리오입니다.

## Problem Statement

**상황**: 프로덕션에서 간헐적으로 500 에러 발생

**증상**:

- 에러 빈도: 하루 10-20건
- 발생 시간: 주로 오후 2-4시
- 영향: 특정 API (`/api/users/profile`)
- 에러 메시지: "Database connection timeout"

**질문**: "어떻게 디버깅하고 해결할까요?"

---

## Sequential Thinking Process

```
💭 Thought 1/10: 문제 현상 정확히 파악

**에러 로그 분석:**
```

[2025-01-15 14:23:41] ERROR: Database connection timeout
at pg.connect (postgres.js:142)
at UserController.getProfile (user.controller.js:45)
Request ID: req-abc123
User ID: 789456
Duration: 30050ms (timeout at 30s)

````

**관찰된 패턴:**
- 시간대: 14:00-16:00 (피크 타임)
- 특정 엔드포인트: GET /api/users/profile
- 일관된 에러: connection timeout
- 타임아웃 시간: 정확히 30초
- 재시도 시 일부 성공

**추가 데이터 필요:**
- 데이터베이스 connection pool 상태
- 해당 시간대 트래픽 패턴
- 느린 쿼리 로그
- 시스템 리소스 사용률

---

🔍 Thought 2/10: 관련 메트릭 및 로그 수집

**데이터베이스 Connection Pool:**
- Max connections: 100
- 피크 시간대 활성 연결: 85-98
- 대기 중인 요청: 최대 15개
- 평균 connection 사용 시간: 50ms
- 피크 시 일부 connection: 2000-3000ms

**트래픽 패턴:**
- 평시: 50 req/s
- 14:00-16:00: 150 req/s (3배)
- 특히 /api/users/profile: 30 req/s

**느린 쿼리 로그:**
```sql
-- Query time: 2847ms
SELECT u.*, p.*, r.*
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN relationships r ON u.id = r.user_id
WHERE u.id = $1;
````

**Explain Analyze 결과:**

- relationships 테이블 full table scan
- 누락된 인덱스 발견!

---

💭 Thought 3/10: 가설 수립

**가설 목록:**

**가설 1: Connection Pool 부족**

- 증거: 피크 시 95% 사용률
- 메커니즘: 새 요청이 connection 대기 → timeout

**가설 2: 느린 쿼리가 Connection 점유**

- 증거: 일부 쿼리 2-3초 소요
- 메커니즘: 느린 쿼리가 connection을 오래 점유 → pool 고갈

**가설 3: Database 자체 성능 문제**

- 증거: 특정 시간대만 발생
- 메커니즘: DB 리소스 부족

**가설 4: Connection Leak**

- 증거: connection 사용 시간이 일부 매우 김
- 메커니즘: 미반환 connection 누적

**평가:** 가설 1과 2가 가장 유력
→ 각각 브랜치로 검증

---

🌿 [Branch: hypothesis-pool] Thought 4a/10: Connection Pool 부족 가설 검증

**검증 방법:**

1. Pool 크기 임시 증가 (100 → 200)
2. 피크 시간 모니터링
3. 에러율 변화 관찰

**테스트 결과 (스테이징):**

- Pool 100: 에러율 1.2%
- Pool 150: 에러율 0.8%
- Pool 200: 에러율 0.5%

**해석:**

- Pool 증가로 에러 감소
- 하지만 완전히 해결 안됨
- 근본 원인은 다른 곳에

**결론:** 부분적 원인, 주 원인 아님

---

🌿 [Branch: hypothesis-query] Thought 4b/10: 느린 쿼리 가설 검증

**문제 쿼리 분석:**

```sql
-- 현재 쿼리
SELECT u.*, p.*, r.*
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN relationships r ON u.id = r.user_id
WHERE u.id = $1;

-- Explain: Seq Scan on relationships (cost=0..15892)
```

**인덱스 확인:**

```sql
-- 존재하는 인덱스
users: PRIMARY KEY (id)
profiles: PRIMARY KEY (id), INDEX (user_id)
relationships: PRIMARY KEY (id)  -- user_id 인덱스 없음!
```

**누락된 인덱스:**

```sql
CREATE INDEX idx_relationships_user_id
ON relationships(user_id);
```

**테스트 (스테이징):**

- 인덱스 전: 평균 2500ms
- 인덱스 후: 평균 45ms (98% 개선!)

**Connection Pool 영향:**

- 빠른 쿼리 → 빠른 connection 반환
- Pool 사용률: 95% → 65%
- 대기 queue: 15 → 0

**결론:** 이것이 주 원인!

---

💡 Thought 5/10: 핵심 발견 - 복합 원인 및 연쇄 효과

**근본 원인 체인:**

```
relationships 인덱스 누락
    ↓
느린 쿼리 (2-3초)
    ↓
Connection 오래 점유
    ↓
피크 시간에 Pool 고갈
    ↓
신규 요청 대기
    ↓
30초 timeout 발생
    ↓
500 Error
```

**통합 이해:**

- 단일 원인이 아닌 복합 원인
- 평시에는 괜찮음 (트래픽 낮음)
- 피크 시 문제 폭발 (3배 트래픽)

**영향 계산:**

- 인덱스 추가: 쿼리 98% 빠름
- Connection 반환 빠름: Pool 사용률 30% 감소
- 대기 queue 제거: timeout 방지

---

💭 Thought 6/10: 해결 방안 우선순위화

**Immediate (긴급, 오늘):**

1. ✅ 인덱스 추가
   - `CREATE INDEX idx_relationships_user_id ON relationships(user_id)`
   - 영향: 98% 쿼리 개선
   - 리스크: 낮음 (읽기 인덱스)
   - 시간: 5분

2. ✅ Connection timeout 조정
   - 현재: 30초
   - 변경: 10초
   - 이유: 빠른 fail로 retry 기회
   - 리스크: 낮음

**Short-term (이번 주):** 3. ✅ Connection pool 증가

- 100 → 150
- 여유 확보
- 리스크: DB 부하 모니터링 필요

4. ✅ 쿼리 최적화
   - 불필요한 JOIN 제거
   - 필요한 컬럼만 SELECT
   - N+1 쿼리 방지

**Long-term (이번 달):** 5. ✅ Monitoring 강화

- Slow query alert
- Connection pool dashboard
- 자동 스케일링 고려

6. ✅ Caching 도입
   - Redis로 프로필 캐싱
   - 캐시 hit rate 목표: 80%
   - DB 부하 감소

---

✅ Thought 10/10 [Complete]: 실행 계획 및 검증 방법

**Immediate Actions (Today)**

**Step 1: 인덱스 추가 (14:00 배포)**

```sql
-- Production에 배포
CREATE INDEX CONCURRENTLY idx_relationships_user_id
ON relationships(user_id);
-- CONCURRENTLY로 락 방지
-- 예상 시간: 2-3분
```

**Step 2: Timeout 조정 (14:05 배포)**

```javascript
// 변경 전
pool: {
  connectionTimeoutMillis: 30000;
}

// 변경 후
pool: {
  connectionTimeoutMillis: 10000;
}
```

**Step 3: 모니터링 (14:10)**

- 에러율 실시간 추적
- Connection pool 사용률
- 쿼리 응답 시간

**검증 메트릭 (24시간 후):**

**Before (baseline):**

- 에러 발생: 10-20건/일
- 평균 응답 시간: 450ms
- P95 응답 시간: 2800ms
- Connection pool 사용률: 95%

**After (target):**

- ✅ 에러 발생: < 1건/일 (95% 감소)
- ✅ 평균 응답 시간: < 200ms (56% 개선)
- ✅ P95 응답 시간: < 500ms (82% 개선)
- ✅ Connection pool 사용률: < 70% (26% 감소)

**Rollback Plan:**

- 인덱스 문제 시: `DROP INDEX idx_relationships_user_id`
- Timeout 문제 시: 원래 값으로 복원
- 즉시 rollback 가능 (< 1분)

**Long-term Improvements (Week 1-4):**

**Week 1:**

- [ ] Connection pool을 150으로 증가
- [ ] Slow query alert 설정 (>500ms)

**Week 2:**

- [ ] 프로필 쿼리 재작성 (N+1 제거)
- [ ] 불필요한 JOIN 제거

**Week 3:**

- [ ] Redis 캐싱 구현
- [ ] Cache warming 전략

**Week 4:**

- [ ] 성능 벤치마크
- [ ] 문서화 및 팀 공유

**Post-mortem:**

- 근본 원인: 인덱스 누락
- 교훈: 초기 스키마 설계의 중요성
- 예방: 모든 FK에 인덱스 자동 생성 규칙
- 개선: DB 스키마 리뷰 프로세스

---

## Results

### 해결 결과 (24시간 후)

**실제 메트릭:**

- 에러 0건 (목표 달성!)
- 평균 응답 시간: 180ms
- P95 응답 시간: 420ms
- Connection pool: 62% 사용률

**비즈니스 영향:**

- 사용자 경험 개선
- 고객 불만 제거
- 시스템 신뢰도 증가

---

## Key Learnings

### 체계적 디버깅의 중요성

**Without Sequential Thinking:**

```
"Connection timeout 에러네?"
→ "Pool 크기를 늘려야겠다"
→ Pool 200으로 증가
→ 에러 여전히 발생
→ 좌절...
```

**With Sequential Thinking:**

```
1. 정확한 현상 파악
2. 데이터 수집
3. 가설 수립
4. 브랜치로 각 가설 검증
5. 근본 원인 발견
6. 우선순위 해결
7. 검증 및 모니터링
```

### 브랜치의 효과

두 가설을 독립적으로 검증:

- Hypothesis 1 (pool): 부분 원인
- Hypothesis 2 (query): 주 원인

만약 순차적으로 했다면:

- Pool만 늘렸을 것
- 근본 원인 놓쳤을 것

### 복합 원인 인식

단일 원인이 아닌 체인:

1. 인덱스 누락
2. 느린 쿼리
3. Connection 점유
4. Pool 고갈
5. Timeout

---

## Debugging Pattern

이 예시에서 사용된 패턴:

```
1. Symptom → 정확한 현상 파악
2. Data Collection → 메트릭/로그 수집
3. Hypothesis → 가능한 원인들
4. Branch Testing → 각 가설 검증
5. Root Cause → 근본 원인 식별
6. Prioritize → 해결책 우선순위
7. Execute → 실행 및 검증
8. Monitor → 지속적 모니터링
9. Document → 학습 문서화
10. Prevent → 재발 방지
```

---

## Exercise

다음 디버깅 시나리오에 적용해보세요:

**문제**: "서비스가 매일 새벽 3시에 느려집니다. CPU 사용률이 100%에 도달합니다."

**힌트:**

1. 현상을 정확히 파악
2. 새벽 3시에 무엇이 실행되는지 조사
3. 가설 수립 (scheduled jobs? batch processing? backup?)
4. 각 가설을 브랜치로 검증
5. 근본 원인 및 해결책
