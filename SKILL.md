---
name: sequential-thinking
description: Structured multi-step reasoning framework with branching, revision, and TodoWrite integration for systematic problem-solving
---

# Sequential Thinking Skill

## Overview

복잡한 문제를 체계적으로 분석하고 해결하기 위한 단계적 사고 프레임워크입니다.

이 스킬은 MCP (Model Context Protocol) 서버로 구현된 Sequential Thinking을 Claude Code Skill로 재구현한 것으로, 별도의 서버 설치 없이 TodoWrite 도구를 활용하여 구조화된 다단계 추론을 제공합니다.

### Key Features

- ✅ **단계별 추론 (Step-by-Step Reasoning)**: TodoWrite를 활용하여 각 사고 단계를 명확하게 추적
- ✅ **분기 지원 (Branching)**: 동일한 지점에서 여러 접근 방식을 동시에 탐색
- ✅ **수정 기능 (Revision)**: 이전 단계로 돌아가 새로운 인사이트 반영
- ✅ **동적 확장 (Dynamic Expansion)**: 필요에 따라 사고 단계 수를 자동 조정
- ✅ **시각화 (Visualization)**: 이모지와 구조화된 출력으로 사고 흐름 표현
- ✅ **상태 지속성 (State Persistence)**: TodoWrite를 통한 세션 간 상태 유지

---

## When to Use This Skill

이 스킬은 다음과 같은 상황에서 특히 유용합니다:

### 🧩 Complex Problem Analysis
- 다단계 논리적 추론이 필요한 복잡한 문제
- 여러 요소를 고려해야 하는 시스템 분석
- 장단점을 체계적으로 평가해야 하는 의사결정

### 🔍 Debugging & Investigation
- 버그의 근본 원인을 찾기 위한 체계적 조사
- 시스템 동작을 단계별로 추적하고 분석
- 가설 수립 및 검증을 통한 문제 해결

### 🏗️ Architecture & Design
- 여러 설계 옵션을 비교하고 평가
- 시스템 아키텍처의 장단점 분석
- 확장성과 유지보수성을 고려한 설계 결정

### 📊 Strategic Decision Making
- 비즈니스 의사결정을 위한 구조화된 분석
- 리스크와 기회를 체계적으로 평가
- 여러 대안의 장단점 비교

### 🎨 Creative Problem Solving
- 창의적 해결책을 찾기 위한 다양한 접근법 탐색
- 브레인스토밍 결과를 구조화하여 정리
- 아이디어를 체계적으로 발전시키기

---

## Core Concepts

### 1. Thought (생각)

각 사고 단계는 다음 구조를 가집니다:

**필수 필드 (Required Fields)**:
- `thought`: 현재 생각의 내용 (string, non-empty)
- `thoughtNumber`: 현재 단계 번호 (positive integer)
- `totalThoughts`: 예상 총 단계 수 (positive integer)
- `nextThoughtNeeded`: 다음 단계가 필요한지 여부 (boolean)

**선택 필드 (Optional Fields)**:
- `isRevision`: 이전 생각을 수정하는지 여부 (boolean, default: false)
- `revisesThought`: 수정 대상 단계 번호 (number, isRevision=true일 때 필수)
- `branchFromThought`: 어느 단계에서 분기했는지 (number)
- `branchId`: 분기의 고유 식별자 (string)
- `needsMoreThoughts`: 추가 단계가 필요한지 (boolean)

### 2. TodoWrite Integration

각 생각을 TodoWrite 항목으로 변환하여 진행 상황을 추적합니다.

**변환 규칙**:

```
일반 생각:
ThoughtData {
  thought: "문제의 핵심 요구사항 파악",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
}
↓
TodoWrite {
  content: "💭 Thought 1/5: 문제의 핵심 요구사항 파악",
  activeForm: "생각 진행 중: 1단계 (총 5단계)",
  status: "in_progress"
}

분기된 생각:
ThoughtData {
  thought: "성능 최적화 접근법 탐색",
  thoughtNumber: 3,
  totalThoughts: 8,
  branchId: "performance-opt",
  branchFromThought: 2,
  nextThoughtNeeded: true
}
↓
TodoWrite {
  content: "🌿 [Branch: performance-opt] Thought 3/8: 성능 최적화 접근법 탐색",
  activeForm: "분기 탐색 중: performance-opt",
  status: "in_progress"
}

수정된 생각:
ThoughtData {
  thought: "추가 고려사항을 반영한 수정된 결론",
  thoughtNumber: 4,
  totalThoughts: 6,
  isRevision: true,
  revisesThought: 4,
  nextThoughtNeeded: true
}
↓
TodoWrite {
  content: "✏️ [Revision of #4] Thought 4': 추가 고려사항을 반영한 수정된 결론",
  activeForm: "이전 생각 수정 중: #4",
  status: "in_progress"
}

완료된 생각:
ThoughtData {
  thought: "최종 결론 및 권장사항",
  thoughtNumber: 5,
  totalThoughts: 5,
  nextThoughtNeeded: false
}
↓
TodoWrite {
  content: "✅ Thought 5/5 [Complete]: 최종 결론 및 권장사항",
  activeForm: "사고 과정 완료",
  status: "completed"
}
```

### 3. Branching (분기)

동일한 지점에서 여러 경로를 탐색할 수 있습니다.

**사용 시나리오**:
- 여러 설계 옵션을 병렬로 평가
- 서로 다른 가설을 동시에 검증
- 다양한 해결책을 탐색하고 비교

**구조 예시**:
```
Thought 1: 문제 정의 및 분석
Thought 2: 주요 제약사항 파악
├─ 🌿 Branch A (scalability-first): 확장성 우선 접근
│   ├─ Thought 3a: 분산 시스템 아키텍처 고려
│   ├─ Thought 4a: 데이터 샤딩 전략
│   └─ Thought 5a: 수평 확장 가능성 평가
├─ 🌿 Branch B (simplicity-first): 단순성 우선 접근
│   ├─ Thought 3b: 모놀리식 구조 장점
│   ├─ Thought 4b: 개발 및 유지보수 용이성
│   └─ Thought 5b: 초기 배포 속도
└─ 🌿 Branch C (hybrid): 하이브리드 접근
    ├─ Thought 3c: 단계적 마이그레이션 전략
    └─ Thought 4c: 장기적 발전 경로
```

**브랜치 명명 규칙**:
- 명확하고 설명적인 ID 사용 (예: `performance-opt`, `security-focus`, `user-experience`)
- 하이픈으로 단어 연결
- 각 브랜치의 목적이 ID에서 드러나도록

### 4. Revision (수정)

이전 생각을 되돌아보고 개선할 수 있습니다.

**사용 시나리오**:
- 새로운 정보나 인사이트를 발견했을 때
- 이전 가정이 잘못되었음을 깨달았을 때
- 더 나은 접근법을 생각해냈을 때
- 논리적 오류를 발견했을 때

**예시**:
```
Thought 3: 데이터베이스로 MySQL 선택
Thought 4: API 엔드포인트 설계
Thought 5: 보안 요구사항 검토
  → 새로운 인사이트: PostgreSQL의 JSON 지원이 필요
Thought 3' (revision of #3): PostgreSQL로 재평가, JSONB 타입 활용 고려
Thought 6: 수정된 데이터베이스 선택을 반영한 API 설계 조정
```

---

## Usage Protocol

### Activation

이 스킬은 다음과 같은 상황에서 자동으로 활성화되어야 합니다:

1. **명시적 요청**:
   - "단계적으로 생각해봐"
   - "체계적으로 분석해줘"
   - "Sequential thinking을 사용해"

2. **복잡한 문제**:
   - 3단계 이상의 추론이 필요한 질문
   - "왜?" 라는 질문이 여러 번 필요한 상황
   - 다양한 요소를 고려해야 하는 의사결정

3. **비교 및 평가**:
   - 여러 옵션의 장단점 비교 요청
   - 트레이드오프 분석
   - 설계 대안 평가

4. **조사 및 디버깅**:
   - 버그의 근본 원인 찾기
   - 시스템 동작 분석
   - 문제 해결 프로세스

### Basic Workflow

#### Step 1: Initialize Thinking Session

사용자가 복잡한 문제를 제시하거나 체계적 분석을 요청하면:

```
사용자: "이 마이크로서비스 아키텍처의 장단점을 체계적으로 분석해줘"

→ Sequential Thinking Skill 활성화
→ 문제 이해 및 초기 분석
```

#### Step 2: Create First Thought

첫 번째 생각으로 문제를 정의하고 접근 방법을 설정합니다:

1. **문제 이해**:
   - 핵심 질문이 무엇인가?
   - 어떤 정보가 주어졌는가?
   - 어떤 제약사항이 있는가?

2. **초기 계획**:
   - 예상 단계 수 (totalThoughts) 설정
   - 각 단계의 대략적인 방향 결정
   - 필요시 분기 계획 수립

3. **TodoWrite 생성**:
   ```
   content: "💭 Thought 1/6: 마이크로서비스 아키텍처의 핵심 특성 파악"
   activeForm: "문제 분석 시작: 1/6 단계"
   status: "in_progress"
   ```

#### Step 3: Process Each Subsequent Thought

각 단계를 진행하면서:

1. **이전 생각 검토**:
   - 지금까지의 인사이트 요약
   - 다음 단계로 이어지는 논리적 연결

2. **현재 단계 분석**:
   - 구체적이고 명확한 분석
   - 사실과 추론의 구분
   - 필요시 가정(assumption) 명시

3. **TodoWrite 업데이트**:
   - 이전 단계를 completed로 변경
   - 새로운 단계를 in_progress로 생성
   - 진행 상황 시각화

4. **필요시 조정**:
   - 예상보다 더 많은 단계가 필요하면 totalThoughts 증가
   - 분기가 필요하면 새로운 브랜치 생성
   - 수정이 필요하면 revision 수행

#### Step 4: Handle Special Cases

**A. 분기 생성 (Branching)**

여러 접근법을 탐색해야 할 때:

```
Thought 3: 두 가지 주요 접근법 식별
  ├─ 접근법 A: 성능 최적화 우선
  └─ 접근법 B: 개발 속도 우선

→ 브랜치 생성 결정

Branch A (performance-first):
content: "🌿 [Branch: performance-first] Thought 4a: 캐싱 전략 및 최적화"
activeForm: "분기 탐색: 성능 우선 접근"
status: "in_progress"

Branch B (speed-first):
content: "🌿 [Branch: speed-first] Thought 4b: MVP 기능 최소화 및 빠른 배포"
activeForm: "분기 탐색: 속도 우선 접근"
status: "in_progress"
```

**B. 생각 수정 (Revision)**

이전 생각을 재고해야 할 때:

```
Thought 5: SQL 데이터베이스로 충분하다고 판단

→ 새로운 정보 발견: 실시간 분석 요구사항 추가

Thought 5' (revision of #5):
content: "✏️ [Revision of #5] Thought 5': 실시간 분석 요구사항 고려 시 NoSQL 병행 필요"
activeForm: "이전 결론 수정: 데이터베이스 전략 재평가"
status: "in_progress"

→ 이후 단계들도 이 수정된 결론을 반영
```

**C. 동적 확장 (Dynamic Expansion)**

예상보다 더 많은 단계가 필요할 때:

```
초기 계획: totalThoughts = 5

Thought 4 진행 중: 추가 분석이 필요함을 인식

→ needsMoreThoughts = true 설정
→ totalThoughts를 5 → 8로 증가
→ 사용자에게 확장 이유 설명

"추가로 3단계가 더 필요합니다. 보안 고려사항을 충분히 분석하기 위해 단계를 확장합니다."
```

#### Step 5: Complete Session

마지막 단계에서:

1. **최종 생각 작성**:
   ```
   content: "✅ Thought 8/8 [Complete]: 최종 결론 및 권장 사항"
   status: "completed"
   ```

2. **전체 요약 제공**:
   - 핵심 인사이트 정리
   - 주요 발견사항
   - 최종 결론 및 권장사항
   - 각 브랜치의 평가 (브랜치가 있는 경우)

3. **사고 과정 시각화**:
   ```
   ## 사고 과정 요약

   1. 💭 문제 정의 및 핵심 요구사항 파악
   2. 💭 주요 제약사항 및 트레이드오프 식별
   3. 💭 두 가지 주요 접근법 발견
      ├─ 🌿 Branch A: 성능 우선 (3단계)
      └─ 🌿 Branch B: 단순성 우선 (3단계)
   4. ✏️ 보안 요구사항 재평가 (Revision)
   5. 💭 각 접근법의 장단점 비교
   6. ✅ 최종 권장사항: 하이브리드 접근
   ```

---

## Validation Rules

각 생각을 처리하기 전에 다음 사항을 검증해야 합니다:

### Required Field Validation

✅ **필수 필드 존재**:
- `thought`: 비어있지 않은 문자열
- `thoughtNumber`: 양의 정수
- `totalThoughts`: 양의 정수
- `nextThoughtNeeded`: 불리언 값

### Type Validation

✅ **타입 검증**:
- `thought`: string 타입, 길이 > 0, 길이 < 10000
- `thoughtNumber`: number 타입, > 0
- `totalThoughts`: number 타입, > 0
- `nextThoughtNeeded`: boolean 타입
- `isRevision`: boolean 타입 (존재시)
- `revisesThought`: number 타입 (isRevision=true일 때)
- `branchId`: string 타입 (존재시)
- `branchFromThought`: number 타입 (branchId 존재시)

### Logic Validation

✅ **논리 검증**:
- `thoughtNumber ≤ totalThoughts` (자동 조정 가능)
- `isRevision=true`이면 `revisesThought` 필수
- `branchId`가 있으면 `branchFromThought` 필수
- `revisesThought ≤ thoughtNumber`
- `branchFromThought < thoughtNumber`

### Automatic Adjustments

⚙️ **자동 조정**:
- `thoughtNumber > totalThoughts`인 경우:
  - `totalThoughts`를 `thoughtNumber`로 자동 증가
  - 사용자에게 확장 사실 알림
  - 확장 이유 설명

---

## Output Formatting

### Emoji Conventions

각 생각의 타입에 따라 적절한 이모지를 사용합니다:

| 이모지 | 의미 | 사용 시점 |
|--------|------|----------|
| 💭 | 일반 생각 | 기본 추론 단계 |
| 🌿 | 분기 | 새로운 접근법 탐색 |
| ✏️ | 수정 | 이전 생각 재평가 |
| ✅ | 완료 | 마지막 단계 완료 |
| 🔍 | 조사 | 세부 분석 또는 조사 |
| 💡 | 인사이트 | 중요한 깨달음 |
| ⚠️ | 주의 | 잠재적 문제 발견 |
| 🎯 | 목표 | 목표 설정 또는 재확인 |

### Formatting Examples

**일반 생각**:
```
💭 Thought 3/10: 데이터베이스 스키마 설계 고려사항
```

**분기**:
```
🌿 [Branch: microservices] Thought 5/12: 마이크로서비스 아키텍처의 장점
```

**수정**:
```
✏️ [Revision of #4] Thought 4': API 버전 관리 전략 재평가
```

**완료**:
```
✅ Thought 10/10 [Complete]: 최종 아키텍처 권장사항 및 구현 로드맵
```

**인사이트 강조**:
```
💡 Thought 7/10: 핵심 발견 - 캐싱 레이어가 성능의 병목
```

---

## Examples

### Example 1: Basic Problem Analysis

**문제**: "새로운 e-commerce 플랫폼의 결제 시스템을 설계해야 합니다. 어떻게 접근해야 할까요?"

**Sequential Thinking 적용**:

```
💭 Thought 1/6: 결제 시스템의 핵심 요구사항 파악
- 지원해야 할 결제 수단: 신용카드, 계좌이체, 간편결제
- 보안 요구사항: PCI DSS 준수, 데이터 암호화
- 성능 목표: 초당 100건 트랜잭션 처리
- 안정성: 99.9% 가용성 필요

💭 Thought 2/6: 주요 제약사항 및 트레이드오프 식별
- 예산 제약: 초기 투자 최소화 필요
- 기술 스택: 기존 Node.js 백엔드와 호환
- 규제 요구사항: 국내 전자금융거래법 준수
- 트레이드오프: 직접 구현 vs PG사 API 활용

💭 Thought 3/6: 두 가지 주요 접근법 발견
분기 탐색이 필요함을 인식 → 브랜치 생성

🌿 [Branch: direct-integration] Thought 4a/8: PG사 직접 연동 접근
- 장점: 빠른 구축, 검증된 솔루션
- 단점: 수수료 부담, 제한된 커스터마이징
- 고려사항: 토스페이먼츠, NHN KCP 등 비교

🌿 [Branch: self-implementation] Thought 4b/8: 자체 결제 시스템 구축
- 장점: 완전한 제어, 장기적 비용 절감
- 단점: 개발 시간, 보안 인증 부담
- 고려사항: PCI DSS 인증 취득 필요

💭 Thought 5/8: 두 접근법의 비용 분석
PG 연동: 월 수수료 약 3-5%, 초기 비용 낮음
자체 구축: 개발 비용 약 6개월, 유지보수 필요
→ 초기 단계에서는 PG 연동이 현실적

💭 Thought 6/8: 하이브리드 전략 고려
Phase 1: PG사 API 연동으로 빠른 출시
Phase 2: 트래픽 증가 시 자체 시스템으로 단계적 전환
Phase 3: 멀티 PG 지원으로 리스크 분산

✏️ [Revision of #5] Thought 5': 장기 비용 재계산
새로운 인사이트: 월 거래량 1억원 이상 시 자체 구축이 유리
수정된 결론: 하이브리드 전략이 최적

✅ Thought 8/8 [Complete]: 최종 권장사항
1. Phase 1 (0-6개월): 토스페이먼츠 API 연동
2. Phase 2 (6-12개월): 거래량 모니터링 및 비용 분석
3. Phase 3 (12개월+): 필요시 자체 시스템 구축 검토
4. 보안: 모든 단계에서 PCI DSS 수준 유지
5. 모니터링: 실시간 거래 추적 및 이상 탐지 시스템
```

### Example 2: Debugging Complex Issue

**문제**: "프로덕션에서 간헐적으로 발생하는 500 에러를 디버깅해야 합니다."

**Sequential Thinking 적용**:

```
💭 Thought 1/7: 문제 현상 정확히 파악
- 에러 발생 빈도: 하루 10-20건
- 발생 시간: 주로 오후 2-4시 사이
- 영향 범위: 특정 API 엔드포인트 (/api/users/profile)
- 에러 메시지: "Database connection timeout"

🔍 Thought 2/7: 로그 및 메트릭 분석
- 데이터베이스 connection pool: 최대 100개
- 피크 시간대 활성 연결: 평균 85-95개
- 느린 쿼리: 일부 프로필 조회 쿼리가 2-3초 소요
- 잠재적 병목: connection pool 고갈

💭 Thought 3/7: 가설 수립
가설 1: Connection pool이 부족함
가설 2: 느린 쿼리가 connection을 오래 점유
가설 3: Connection leak 발생
→ 각 가설을 검증할 필요

🌿 [Branch: hypothesis-1] Thought 4a/10: Connection pool 크기 검증
- 현재 설정: maxConnections = 100
- 피크 시간 사용률: 95%
- 대기 시간: 평균 500ms
→ Pool 크기가 충분하지 않을 수 있음

🌿 [Branch: hypothesis-2] Thought 4b/10: 느린 쿼리 분석
- 프로필 조회 쿼리: 5개 테이블 JOIN
- 인덱스 누락: relationships 테이블에 user_id 인덱스 없음
- 쿼리 실행 계획 분석 결과: Full table scan 발생
→ 이것이 주요 원인일 가능성 높음

💡 Thought 5/10: 핵심 발견 - 복합 원인
단일 원인이 아닌 복합적 문제:
1. 인덱스 누락으로 쿼리가 느려짐
2. 느린 쿼리가 connection을 오래 점유
3. 피크 시간에 connection pool 고갈
4. 신규 요청이 timeout 발생

💭 Thought 6/10: 해결 방안 우선순위화
즉시 적용 (High Priority):
- relationships 테이블에 인덱스 추가
- Connection timeout 설정 조정 (30s → 10s)

단기 조치 (Medium Priority):
- Connection pool 크기 증가 (100 → 150)
- 느린 쿼리 재작성 및 최적화

장기 조치 (Low Priority):
- Connection pool 모니터링 대시보드 구축
- 자동 스케일링 정책 수립

✅ Thought 7/10 [Complete]: 실행 계획 및 검증 방법
1. 인덱스 추가 (예상 효과: 쿼리 시간 80% 감소)
   ```sql
   CREATE INDEX idx_relationships_user_id ON relationships(user_id);
   ```
2. Connection timeout 조정 후 모니터링
3. 1주일 후 에러 발생률 재측정
4. 필요시 추가 조치 실행

검증 메트릭:
- 에러 발생률: 목표 < 1건/일
- 평균 응답 시간: 목표 < 200ms
- Connection pool 사용률: 목표 < 70%
```

### Example 3: Architecture Decision with Branching

**문제**: "마이크로서비스 vs 모놀리식 아키텍처 중 무엇을 선택해야 할까요?"

(이 예시는 README.md의 examples/ 디렉토리에 자세히 작성됩니다)

---

## Best Practices

### 1. 명확한 초기 계획 수립

❌ **피해야 할 것**:
```
Thought 1/3: 문제를 생각해보자
Thought 2/3: 음... 더 생각해보니 복잡하네
Thought 3/5: 아니다, 단계를 더 늘려야겠다  ← 혼란스러운 진행
```

✅ **권장 방법**:
```
Thought 1/7: 문제 정의 - 시스템의 확장성 요구사항 분석
  - 현재 트래픽: 1만 DAU
  - 목표: 6개월 내 10만 DAU 지원
  - 예산 제약: 인프라 비용 월 $500 이내
  → 7단계로 체계적 분석 계획
```

### 2. 적절한 단계 수 설정

**권장 단계 수**:
- 간단한 분석: 3-5단계
- 중간 복잡도: 5-10단계
- 복잡한 문제: 10-15단계
- 매우 복잡한 문제: 15-20단계

**주의**: 20단계 이상은 일반적으로 문제를 너무 세분화한 것입니다.

### 3. 분기는 신중하게 사용

❌ **과도한 분기** (피해야 함):
```
Thought 2 → 5개 브랜치 생성
각 브랜치마다 10단계씩
→ 총 50단계, 너무 복잡함
```

✅ **적절한 분기**:
```
Thought 2 → 2-3개 주요 접근법만 브랜치
각 브랜치는 3-5단계로 핵심만 분석
→ 명확하고 관리 가능
```

### 4. 수정 기능의 효과적 활용

**수정이 적절한 경우**:
- 새로운 중요 정보 발견
- 이전 가정이 잘못되었음을 깨달음
- 더 나은 접근법 발견

**수정이 불필요한 경우**:
- 사소한 표현 수정
- 추가 설명 (→ 다음 단계에서 추가)
- 완전히 다른 방향 (→ 새로운 브랜치 생성)

### 5. 요약과 중간 체크포인트

매 3-5단계마다 중간 요약을 제공하세요:

```
💭 Thought 5/12: 중간 요약 - 지금까지의 주요 발견
1. 데이터베이스는 PostgreSQL이 적합
2. 캐싱 레이어가 필수적
3. 두 가지 배포 전략 고려 중
→ 다음: 각 배포 전략의 구체적 분석
```

### 6. 구체적이고 실행 가능한 결론

❌ **추상적 결론** (피해야 함):
```
✅ Thought 8/8: 좋은 아키텍처를 선택하면 됩니다.
```

✅ **구체적 결론**:
```
✅ Thought 8/8 [Complete]: 최종 권장사항
1. PostgreSQL + Redis 조합 채택
2. Docker Compose로 로컬 개발 환경 구성
3. Phase 1 (1-2주): 기본 CRUD API 구현
4. Phase 2 (3-4주): 캐싱 레이어 추가
5. Phase 3 (5-6주): 모니터링 및 최적화
예상 비용: 월 $350 (목표 $500 이내 충족)
```

---

## Integration with Other Tools & Skills

Sequential Thinking은 다음과 함께 사용하면 더욱 강력합니다:

### 1. Code Review Skill
```
Sequential Thinking으로 코드 리뷰 접근:
1. 코드의 목적과 요구사항 이해
2. 아키텍처 및 설계 패턴 분석
3. 잠재적 버그 및 엣지 케이스 식별
4. 성능 및 보안 고려사항 평가
5. 개선 제안 우선순위화
```

### 2. Test-Driven Development
```
TDD 프로세스를 Sequential Thinking으로:
1. 요구사항을 테스트 케이스로 변환
2. 각 테스트의 목적과 범위 정의
3. 구현 전략 수립
4. 단계별 구현 및 검증
```

### 3. Debugging Skill
```
체계적 디버깅:
1. 문제 현상 정확히 파악
2. 가능한 원인들 나열
3. 각 가설을 검증 (브랜치 활용)
4. 근본 원인 식별
5. 해결 방안 및 예방책 수립
```

---

## Troubleshooting

### Q: TodoWrite 항목이 너무 많아집니다

**A**: 다음 전략을 사용하세요:
- 완료된 생각은 즉시 completed로 변경
- totalThoughts를 현실적으로 설정 (5-10단계 권장)
- 너무 세분화하지 말고 의미 있는 단계로 그룹화
- 필요시 브랜치 대신 단순 나열 고려

### Q: 브랜치가 너무 복잡해집니다

**A**: 브랜치 관리 팁:
- 동시에 2-3개 브랜치만 활성화
- 각 브랜치의 목적을 명확한 ID로 표현
- 브랜치별로 3-5단계로 제한
- 불필요한 브랜치는 조기에 종료
- 브랜치 비교 단계를 명확히 설정

### Q: 중간에 완전히 다른 방향으로 가고 싶습니다

**A**: 두 가지 옵션:
1. **Revision 사용** (작은 방향 수정):
   - 기존 생각을 수정하고 계속 진행
   - 수정 이유를 명확히 설명

2. **새로운 세션 시작** (완전히 다른 접근):
   - 현재 세션 종료
   - 새로운 관점으로 처음부터 다시 시작
   - 이전 세션의 인사이트 참고

### Q: totalThoughts를 잘못 예상했습니다

**A**: 걱정하지 마세요:
- `needsMoreThoughts = true`로 자동 확장 가능
- thoughtNumber가 totalThoughts를 초과하면 자동 조정
- 사용자에게 확장 이유를 설명하면 됩니다
- 반대로 일찍 끝나도 괜찮습니다 (nextThoughtNeeded = false)

### Q: 브랜치를 언제 사용해야 하나요?

**A**: 브랜치 사용 기준:
- ✅ 사용해야 할 때:
  - 2-3개의 명확히 다른 접근법이 있을 때
  - 각 접근법을 독립적으로 평가해야 할 때
  - 트레이드오프를 비교해야 할 때

- ❌ 사용하지 말아야 할 때:
  - 단계를 순차적으로 진행하는 게 자연스러울 때
  - 차이가 미미한 옵션들일 때
  - 이미 3개 이상의 브랜치가 활성화되어 있을 때

---

## Technical Implementation Details

### Data Structures

이 skill은 내부적으로 다음 데이터 구조를 사용합니다:

```typescript
interface ThoughtData {
  // Required fields
  thought: string;                    // 1-10000 characters
  thoughtNumber: number;              // positive integer
  totalThoughts: number;              // positive integer
  nextThoughtNeeded: boolean;         // true or false

  // Optional fields
  isRevision?: boolean;               // default: false
  revisesThought?: number;            // required if isRevision=true
  branchFromThought?: number;         // branch origin point
  branchId?: string;                  // unique branch identifier
  needsMoreThoughts?: boolean;        // request for expansion
}

interface TodoItem {
  content: string;                    // formatted thought text
  activeForm: string;                 // progress description
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
}

interface ThinkingSession {
  thoughtHistory: ThoughtData[];      // all thoughts in order
  branches: Record<string, ThoughtData[]>;  // branched thoughts
  currentThought: number;             // current progress
  totalThoughts: number;              // total planned thoughts
}
```

### Processing Algorithm

```
1. Receive thought request
2. Validate all required fields
3. Perform type and logic validation
4. Check for automatic adjustments needed
   - thoughtNumber > totalThoughts → increase totalThoughts
5. Determine thought type (normal, branch, revision)
6. Format for TodoWrite with appropriate emoji and prefix
7. Update TodoWrite items:
   - Complete previous thought
   - Create/update current thought
8. Track in session state:
   - Add to thoughtHistory
   - Add to appropriate branch if branching
9. If nextThoughtNeeded = false:
   - Mark as completed
   - Generate session summary
   - Visualize thought process
10. Return formatted response to user
```

---

## Migration from MCP Server

기존 MCP 서버를 사용하시던 경우:

### 주요 차이점

| 항목 | MCP 서버 | Skill |
|------|---------|-------|
| 설치 | NPM/Docker 필요 | SKILL.md 파일만 |
| 상태 관리 | 서버 메모리 | TodoWrite |
| 성능 | ~50ms (IPC) | ~5ms (직접 호출) |
| 로깅 | Chalk 콘솔 출력 | TodoWrite 시각화 |
| 커스터마이징 | 소스 수정 + 빌드 | SKILL.md 수정 |

### 마이그레이션 가이드

1. **MCP 서버 제거** (선택사항):
   ```bash
   # MCP 서버 설정 제거
   # ~/.claude/mcp.json에서 sequential-thinking 항목 삭제
   ```

2. **Skill 설치**:
   ```bash
   mkdir -p ~/.claude/skills/sequential-thinking
   curl -o ~/.claude/skills/sequential-thinking/SKILL.md \
     https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/SKILL.md
   ```

3. **사용법 확인**:
   - 기본 사용법은 동일합니다
   - TodoWrite로 상태가 관리됩니다
   - 모든 핵심 기능 (branching, revision) 지원

---

## Contributing

버그 제보, 개선 제안, 또는 기여를 환영합니다!

- **GitHub Issues**: https://github.com/zerodice0/claude_sequential_thinking_skill/issues
- **Pull Requests**: https://github.com/zerodice0/claude_sequential_thinking_skill/pulls
- **Discussions**: https://github.com/zerodice0/claude_sequential_thinking_skill/discussions

---

## License

Apache 2.0 - [LICENSE](https://github.com/zerodice0/claude_sequential_thinking_skill/blob/main/LICENSE)

---

## Credits

이 skill은 다음을 기반으로 개발되었습니다:
- [Sequential Thinking MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking)
- [Model Context Protocol](https://modelcontextprotocol.io/)

---

## Version History

**v1.0.0** (2025-01-XX)
- Initial release as Claude Code Skill
- TodoWrite integration
- Full feature parity with MCP server
- Comprehensive documentation and examples
