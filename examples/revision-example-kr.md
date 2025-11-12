# Example: Using Revision to Refine Thinking

수정 기능을 활용하여 이전 결론을 개선하는 예시입니다.

## Problem Statement

**상황**: 실시간 채팅 애플리케이션의 메시지 저장 방식 설계

**초기 요구사항**:
- 사용자 간 1:1 채팅
- 메시지 영구 저장
- 빠른 검색

**질문**: "어떤 데이터베이스를 사용해야 할까요?"

---

## Sequential Thinking with Revision

```
💭 Thought 1/6: 채팅 애플리케이션 데이터 특성 분석

주요 특성:
- 쓰기 중심 (메시지 전송)
- 시간순 정렬 필수
- 사용자별 메시지 조회
- 검색 기능

---

💭 Thought 2/6: 데이터베이스 후보 식별

고려 옵션:
1. MySQL/PostgreSQL (관계형)
2. MongoDB (문서형)
3. Cassandra (분산형)

---

💭 Thought 3/6: MySQL 선택

**결정**: MySQL 사용

**이유**:
- 팀이 익숙함
- 트랜잭션 지원
- 관계형 데이터 모델링
- 안정성 검증됨

**스키마 설계**:
```sql
CREATE TABLE messages (
  id INT PRIMARY KEY,
  sender_id INT,
  receiver_id INT,
  message TEXT,
  created_at TIMESTAMP,
  INDEX idx_users (sender_id, receiver_id, created_at)
);
```

---

💭 Thought 4/6: API 엔드포인트 설계

기본 API 구조:
- POST /messages - 메시지 전송
- GET /messages?user1={id}&user2={id} - 대화 조회
- GET /messages/search?q={query} - 검색

MySQL의 LIKE 쿼리로 검색 구현 예정

---

💭 Thought 5/6: 요구사항 변경 발견!

**중요 발견**: 제품 팀으로부터 추가 요구사항 확인

새로운 요구사항:
1. 그룹 채팅 지원 (최대 100명)
2. 메시지 반응(이모지) 기능
3. 스레드/답장 기능
4. 실시간 검색 (타이핑하면서 검색)

이것은 MySQL 선택에 중대한 영향!

---

✏️ [Revision of #3] Thought 3': MongoDB로 재평가

**수정된 결정**: MongoDB 사용

**재평가 이유**:
1. **유연한 스키마**:
   - 1:1 채팅과 그룹 채팅을 같은 컬렉션에
   - 메시지 타입 확장 용이 (텍스트, 이미지, 반응 등)

2. **중첩 데이터 지원**:
   ```javascript
   {
     _id: ObjectId,
     room_id: String,
     sender: { id, name },
     message: String,
     reactions: [
       { emoji: "👍", users: [user1, user2] }
     ],
     thread: {
       parent_id: ObjectId,
       replies_count: Int
     },
     created_at: ISODate
   }
   ```

3. **Text Search 기능**:
   - 내장 풀텍스트 검색 인덱스
   - MySQL LIKE보다 훨씬 빠름

4. **확장성**:
   - 샤딩 지원 (미래 대비)
   - 수평 확장 용이

**MySQL 포기 이유**:
- 복잡한 JOIN 구조 필요 (groups, members, messages, reactions)
- 스키마 변경 시 마이그레이션 부담
- 풀텍스트 검색 제한적

---

💭 Thought 6/6: 수정된 결정에 따른 아키텍처 조정

**업데이트된 기술 스택**:
- Database: MongoDB (revised from MySQL)
- Search: MongoDB Text Index
- Real-time: Socket.io + Redis Pub/Sub
- API: Node.js/Express

**MongoDB 스키마**:
```javascript
// messages collection
{
  _id: ObjectId,
  room_id: String,  // "user1:user2" or "group:groupId"
  room_type: String,  // "direct" or "group"
  sender: {
    id: String,
    name: String
  },
  content: {
    type: String,  // "text", "image", "file"
    text: String,
    media_url: String
  },
  reactions: [
    {
      emoji: String,
      users: [String]
    }
  ],
  thread: {
    parent_message_id: ObjectId,
    replies_count: Number
  },
  created_at: Date,
  updated_at: Date
}

// Indexes
room_id + created_at (복합 인덱스)
text index on content.text (검색용)
```

**API 조정**:
- POST /rooms/{roomId}/messages - 메시지 전송
- GET /rooms/{roomId}/messages - 대화 조회
- POST /messages/{messageId}/reactions - 반응 추가
- POST /messages/{messageId}/replies - 답장 작성
- GET /search?q={query}&room={roomId} - 실시간 검색

---

✅ Thought 8/8 [Complete]: 최종 아키텍처 및 마이그레이션 계획

**최종 선택: MongoDB 기반 채팅 시스템**

### Implementation Plan

**Phase 1 (Week 1-2):**
- MongoDB 클러스터 설정
- 스키마 설계 및 인덱스 생성
- 기본 CRUD API 구현

**Phase 2 (Week 3):**
- 실시간 메시징 (Socket.io)
- Redis Pub/Sub 통합
- 메시지 반응 기능

**Phase 3 (Week 4):**
- 스레드/답장 기능
- 풀텍스트 검색
- 성능 최적화

### Benefits of Revision

수정을 통해 얻은 이득:
- ✅ 더 나은 기술 선택 (장기적)
- ✅ 확장 가능한 아키텍처
- ✅ 새 요구사항 충족
- ✅ 미래 요구사항 대비

만약 Thought 3에서 계속 진행했다면:
- ❌ 복잡한 MySQL 스키마
- ❌ 성능 문제 발생 가능
- ❌ 나중에 더 큰 리팩토링 필요

---

## Key Learnings

### 수정이 적절한 시기

**✅ 수정해야 할 때**:
1. 새로운 중요 정보 발견
   - 예: 추가 요구사항 (그룹 채팅)
2. 이전 가정이 잘못됨
   - 예: 단순 채팅 → 복잡한 기능
3. 더 나은 대안 발견
   - 예: MongoDB의 유연성

**❌ 수정이 불필요한 경우**:
1. 사소한 표현 변경
2. 추가 설명 (다음 단계로 충분)
3. 완전히 다른 방향 (새 브랜치 생성)

### 수정의 타이밍

```
좋은 타이밍:
Thought 3: 초기 결정
Thought 4: 진행
Thought 5: 새로운 정보 발견
Thought 3': 즉시 수정 ← 좋음!

나쁜 타이밍:
Thought 3: 초기 결정
...
Thought 8: 구현 완료
Thought 3': 뒤늦은 수정 ← 늦음!
```

### 수정 후 영향 분석

수정 후 반드시:
1. 영향받는 이후 생각들 확인
2. 필요시 추가 수정
3. 전체 일관성 유지

이 예시에서:
- Thought 3' 수정
- Thought 6에서 아키텍처 조정
- 일관성 유지

---

## Revision Patterns

### Pattern 1: 정보 발견 패턴

```
Initial thought → Progress → New info → Revision → Adjust
```

이 예시가 이 패턴을 따름

### Pattern 2: 오류 발견 패턴

```
Initial thought → Continue → Realize error → Revision → Fix
```

예: 성능 계산 실수 발견

### Pattern 3: 더 나은 대안 패턴

```
Good solution → Explore → Better solution → Revision → Upgrade
```

예: 괜찮은 방법 → 최적의 방법 발견

---

## Exercise

다음 시나리오에서 수정이 필요한 시점을 찾아보세요:

**문제**: "웹 애플리케이션 배포 전략 수립"

**사고 과정**:
1. 결정: 단일 서버 배포
2. 기본 CI/CD 파이프라인 설계
3. 발견: 트래픽이 예상보다 10배 높을 것
4. ??? → 수정이 필요한가?
5. 로드 밸런서 추가 고려
6. 최종 배포 계획

**질문**:
- Thought 3에서 수정해야 하나요?
- 아니면 새로운 브랜치를 만들어야 하나요?
- 왜 그렇게 생각하나요?
