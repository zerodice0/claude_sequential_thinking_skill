# Example: Branching for Multiple Approaches

분기 기능을 활용하여 여러 접근법을 동시에 탐색하는 예시입니다.

## Problem Statement

**상황**: 대용량 로그 데이터를 처리하는 시스템 설계

**요구사항**:

- 일일 100GB 로그 데이터 처리
- 실시간 검색 및 분석 필요
- 로그 보존 기간: 90일
- 예산: 월 $1000 이내

**질문**: "어떤 아키텍처를 선택해야 할까요?"

---

## Sequential Thinking with Branching

```
💭 Thought 1/10: 문제 정의 및 요구사항 분석

핵심 요구사항:
- 데이터 볼륨: 100GB/일 = 3TB/월 = 9TB/90일
- 성능: 실시간 인덱싱 및 검색
- 쿼리: 로그 검색, 집계, 시각화
- 비용: 월 $1000 제약

---

💭 Thought 2/10: 주요 옵션 식별

세 가지 주요 접근법:
1. ELK Stack (Elasticsearch, Logstash, Kibana)
2. Managed Service (AWS CloudWatch, Datadog)
3. ClickHouse (OLAP 데이터베이스)

각각 독립적으로 평가하기 위해 3개 브랜치 생성

---

🌿 [Branch: elk-stack] Thought 3a/10: ELK Stack 접근

**장점:**
✅ 오픈소스 (라이선스 비용 없음)
✅ 강력한 검색 기능
✅ 풍부한 커뮤니티 및 플러그인
✅ 완전한 제어권

**단점:**
❌ 직접 운영 부담
❌ 높은 리소스 요구 (RAM, CPU)
❌ 복잡한 설정 및 튜닝
❌ 모니터링 및 유지보수 필요

**비용 예상 (AWS 기준):**
- EC2 instances: $400/월 (m5.xlarge × 3)
- EBS storage: $300/월 (9TB × $0.10)
- 총: $700/월 + 운영 시간

**구현 복잡도:** 높음
**예상 구축 기간:** 4-6주

---

🌿 [Branch: managed-service] Thought 3b/10: Managed Service 접근

**장점:**
✅ 즉시 사용 가능
✅ 자동 확장
✅ 관리 부담 최소화
✅ 기본 제공되는 통합 및 대시보드

**단점:**
❌ 높은 비용
❌ 데이터 볼륨에 따른 급증
❌ 제한된 커스터마이징
❌ 벤더 락인

**비용 예상:**
- AWS CloudWatch Logs: $0.50/GB 수집 + $0.03/GB 저장
  - 수집: $1,500/월 (100GB/일)
  - 저장: $270/월 (9TB)
  - 총: ~$1,770/월 ← 예산 초과!

- Datadog: 유사하거나 더 높음

**구현 복잡도:** 낮음
**예상 구축 기간:** 1주

---

🌿 [Branch: clickhouse] Thought 3c/10: ClickHouse OLAP 접근

**장점:**
✅ 컬럼 기반 DB (로그 분석에 최적화)
✅ 매우 빠른 집계 쿼리
✅ 높은 압축률 (5-10배)
✅ 오픈소스

**단점:**
❌ 전문 검색 기능 제한적
❌ 러닝 커브
❌ 생태계가 ELK보다 작음
❌ 직접 운영 필요

**비용 예상:**
- EC2: $200/월 (m5.large × 2)
- Storage: $90/월 (1TB after compression)
- 총: $290/월 ← 예산 내!

**구현 복잡도:** 중간
**예상 구축 기간:** 2-3주

---

💭 Thought 4/10: 각 브랜치의 핵심 trade-off 비교

| 기준 | ELK | Managed | ClickHouse |
|------|-----|---------|------------|
| **비용** | $700 | $1,770 ❌ | $290 ✅ |
| **운영 부담** | 높음 | 낮음 ✅ | 중간 |
| **검색 기능** | 최고 ✅ | 좋음 | 제한적 |
| **구축 시간** | 6주 | 1주 ✅ | 3주 |
| **확장성** | 좋음 | 최고 ✅ | 매우 좋음 |

---

💭 Thought 5/10: 실제 사용 패턴 고려

로그 분석 워크로드 분석:
- 70%: 시계열 집계 (시간별 에러 수 등)
- 20%: 필터링 및 그룹화
- 10%: 전문 검색 (특정 메시지 찾기)

**인사이트:**
- 대부분이 OLAP 스타일 쿼리
- 전문 검색은 보조적
- ClickHouse의 강점이 잘 맞음

---

💭 Thought 6/10: 하이브리드 접근 고려

**아이디어:** ClickHouse + Elasticsearch Lite

ClickHouse를 메인으로:
- 시계열 데이터 저장 및 분석
- 집계 및 대시보드

Elasticsearch 작은 클러스터:
- 최근 7일 로그만 인덱싱
- 전문 검색 전용
- 비용: +$200/월

총 비용: $490/월 (예산 내)

---

💡 Thought 7/10: 핵심 발견 - ClickHouse가 최적

분석 결과:
1. ClickHouse 단독 사용 추천
2. 이유:
   - 예산의 30%만 사용 ($290/$1000)
   - 워크로드의 90%를 효과적으로 처리
   - 나머지 예산으로 모니터링 도구 추가 가능

3. 전문 검색 제한은:
   - 로그 구조화로 보완 (JSON 필드 검색)
   - 필요시 소규모 Elasticsearch 추가

---

✅ Thought 10/10 [Complete]: 최종 권장 아키텍처

**선택: ClickHouse 기반 아키텍처**

### Architecture

```

Log Sources
↓
Vector (Log Collector)
↓
ClickHouse Cluster (2 nodes)
↓
Grafana (Visualization)

```

### Implementation Plan

**Week 1-2:**
- ClickHouse 클러스터 설치
- 스키마 설계
- Vector 설정

**Week 3:**
- 데이터 수집 파이프라인 구축
- 기본 쿼리 작성

**Week 4:**
- Grafana 대시보드 생성
- 알림 설정
- 성능 튜닝

### Cost Breakdown

```

ClickHouse (m5.large × 2): $200
Storage (EBS): $90
Vector (included): $0
Grafana Cloud Free: $0
Buffer (20%): $60

---

Total: $350/월 (예산의 35%)

```

### Success Metrics

- 쿼리 응답 시간 < 1초 (95 percentile)
- 데이터 지연 < 1분
- 압축률 > 5x
- 가용성 > 99.9%

---

## Key Learnings

### 브랜치 사용의 이점

1. **병렬 평가**: 세 가지 옵션을 동시에 깊이 분석
2. **편향 방지**: 각 옵션에 공정한 기회
3. **명확한 비교**: 구조화된 비교표 생성
4. **최적 선택**: 데이터 기반 의사결정

### 브랜치 명명의 중요성

- `elk-stack`, `managed-service`, `clickhouse`
- 명확한 ID로 각 브랜치의 목적 즉시 파악 가능

### 비교 단계의 필수성

Thought 4에서 명시적 비교가 결정적:
- 모든 브랜치의 결과를 한눈에
- 트레이드오프가 명확히 드러남
- 객관적 선택 가능

---

## Exercise

다음 시나리오에 브랜치를 활용해보세요:

**문제**: "CI/CD 도구를 선택해야 합니다. Jenkins, GitLab CI, GitHub Actions 중 무엇이 좋을까요?"

**힌트**:
1. 각 도구마다 브랜치 생성
2. 동일한 기준으로 평가 (비용, 기능, 유지보수)
3. 팀 상황 고려
4. 비교표 작성
5. 최종 추천
```
