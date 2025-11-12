# Sequential Thinking Helpers

TypeScript 헬퍼 라이브러리 - sequential-thinking 스킬의 선택적 확장 기능

## 개요

이 헬퍼 라이브러리는 MCP 서버의 핵심 기능을 Claude Code 스킬 환경에 맞게 포팅한 것입니다. **완전히 선택적**이며, SKILL.md만으로도 충분히 사용 가능합니다.

### 주요 특징

- ✅ **타입 안정성**: TypeScript 타입 정의 제공
- ✅ **검증**: 입력 데이터 자동 검증
- ✅ **포맷팅**: 일관된 출력 포맷
- ✅ **TodoWrite 통합**: Claude의 TodoWrite 도구와 연동
- ✅ **세션 관리**: 사고 이력 및 브랜치 추적
- ✅ **MCP 호환**: 기존 MCP 서버 코드 마이그레이션 용이

## 파일 구조

```
helpers/
├── types.ts                  # 타입 정의
├── sequential-thinking.ts    # 핵심 로직
├── formatters.ts            # 출력 포맷팅
├── todowrite-adapter.ts     # TodoWrite 통합
├── index.ts                 # 메인 진입점
└── README.md               # 이 문서
```

## 설치 및 사용

### Option 1: 직접 사용 (권장)

```typescript
// 필요한 함수만 import
import { validateThought, processThought } from './helpers';

const result = validateThought({
  thought: "문제 분석",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
});

if (result.valid) {
  console.log("유효한 사고입니다!");
}
```

### Option 2: Quick Start 헬퍼 사용

```typescript
import { createSequentialThinking } from './helpers';

const thinking = createSequentialThinking();

// 사고 처리
const result = thinking.processThought({
  thought: "첫 번째 단계",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
});

// 통계 확인
const stats = thinking.getStats();
console.log(`진행률: ${stats.completedThoughts}/${stats.totalThoughts}`);
```

## 주요 API

### 1. Validation (검증)

```typescript
import { validateThought, normalizeThought } from './helpers';

// 검증만 수행
const validation = validateThought(input);
if (validation.valid) {
  // 처리 진행
}

// 검증 + 정규화
try {
  const thought = normalizeThought(input);
  // 검증된 ThoughtData 사용
} catch (error) {
  console.error("검증 실패:", error.message);
}
```

### 2. Processing (처리)

```typescript
import { processThought, createSessionState } from './helpers';

const sessionState = createSessionState();

const result = processThought(input, {
  sessionState,
  disableFormatting: false
});

if (result.success) {
  console.log(result.formattedOutput);
}
```

### 3. Formatting (포맷팅)

```typescript
import { formatThought, formatProgress } from './helpers';

// 사고 포맷팅
const formatted = formatThought(thoughtData, {
  useEmoji: true,
  includeBorder: true,
  maxWidth: 80
});

// 진행 상황 표시
const progress = formatProgress(3, 10); // [███░░░░░░░] 30% (3/10)
```

### 4. TodoWrite Integration

```typescript
import { createTodoWriteAdapter } from './helpers';

const adapter = createTodoWriteAdapter({
  enableTracking: true,
  maxTasksInList: 20,
  autoCleanup: true
});

// 사고를 TodoWrite 작업으로 추적
const task = adapter.trackThought(thoughtData);

// 통계 확인
const stats = adapter.getStats();
console.log(`브랜치: ${stats.branchCount}, 수정: ${stats.revisionCount}`);

// 세션 내보내기/가져오기
const json = adapter.exportSession();
adapter.importSession(json);
```

## 사용 예시

### 예시 1: 기본 워크플로우

```typescript
import {
  createSequentialThinking,
  createInitialThought,
  createFinalThought
} from './helpers';

const thinking = createSequentialThinking();

// 초기 사고
let result = thinking.processThought(
  createInitialThought("문제 정의", 5)
);

// 중간 사고들...

// 최종 사고
result = thinking.processThought(
  createFinalThought("최종 결론", 5, 5)
);

console.log("완료!");
console.log(thinking.getStats());
```

### 예시 2: 브랜치 탐색

```typescript
import { createBranchThought, processThought } from './helpers';

// 메인 사고 3에서 브랜치 생성
const branchThought = createBranchThought(
  "접근법 A 탐색",
  4,
  10,
  "approach-a",
  3
);

const result = processThought(branchThought, { sessionState });

if (result.success) {
  console.log(`브랜치: ${result.branches?.join(', ')}`);
}
```

### 예시 3: 수정 (Revision)

```typescript
import { createRevisionThought, processThought } from './helpers';

// 사고 2를 수정
const revision = createRevisionThought(
  "수정된 분석 내용",
  6,
  10,
  2
);

const result = processThought(revision);

if (result.success) {
  console.log("✏️ 수정 완료");
}
```

### 예시 4: TodoWrite 통합

```typescript
import { createTodoWriteAdapter } from './helpers';

const adapter = createTodoWriteAdapter();

// Todo 목록 생성
const todos = adapter.generateTodoList(5, ['option-a', 'option-b']);

// Claude의 TodoWrite 도구와 함께 사용
// todos 배열을 TodoWrite 도구에 전달
```

## 타입 정의

### ThoughtData

```typescript
interface ThoughtData {
  thought: string;              // 사고 내용 (필수)
  thoughtNumber: number;        // 현재 단계 번호 (필수)
  totalThoughts: number;        // 전체 단계 수 (필수)
  nextThoughtNeeded: boolean;   // 다음 단계 필요 여부 (필수)

  isRevision?: boolean;         // 수정 여부
  revisesThought?: number;      // 수정 대상 번호
  branchFromThought?: number;   // 브랜치 분기점
  branchId?: string;            // 브랜치 ID
  needsMoreThoughts?: boolean;  // 추가 단계 필요
}
```

### ValidationResult

```typescript
interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}
```

### ProcessingResult

```typescript
interface ProcessingResult {
  success: boolean;
  thoughtNumber: number;
  totalThoughts: number;
  nextThoughtNeeded: boolean;
  branches?: string[];
  thoughtHistoryLength?: number;
  error?: string;
  formattedOutput?: string;
}
```

## 고급 기능

### 세션 상태 관리

```typescript
import { createSessionState, getSessionStats } from './helpers';

const state = createSessionState();

// 사고 처리 후...

const stats = getSessionStats(state);
console.log(`
  총 사고: ${stats.totalThoughts}
  브랜치: ${stats.branchCount}
  수정: ${stats.revisionCount}
  완료율: ${stats.completionRate}%
`);
```

### 사고 검색

```typescript
import { findThought, getBranchThoughts } from './helpers';

// 특정 사고 찾기
const thought = findThought(state, 3);

// 브랜치의 모든 사고
const branchThoughts = getBranchThoughts(state, 'approach-a');
```

### 커스텀 포맷팅

```typescript
import { formatThought } from './helpers';

const customFormat = formatThought(thoughtData, {
  useEmoji: false,          // 이모지 비활성화
  includeBorder: true,      // 테두리 표시
  includeTimestamp: true,   // 타임스탬프 추가
  maxWidth: 100             // 최대 너비 설정
});
```

## MCP 서버에서 마이그레이션

기존 MCP 서버 코드를 헬퍼로 쉽게 전환할 수 있습니다:

### Before (MCP 서버)

```typescript
import { SequentialThinkingServer } from './lib';

const server = new SequentialThinkingServer();
const result = server.processThought(input);
```

### After (헬퍼)

```typescript
import { createSequentialThinking } from './helpers';

const thinking = createSequentialThinking();
const result = thinking.processThought(input);
```

더 자세한 마이그레이션 가이드는 [docs/migration-from-mcp.md](../docs/migration-from-mcp.md)를 참조하세요.

## 성능 고려사항

- **경량**: 외부 의존성 최소화 (chalk 제외, 선택적)
- **효율적**: 메모리 사용량 최적화
- **확장 가능**: 대규모 사고 이력 지원

### 메모리 관리

```typescript
const adapter = createTodoWriteAdapter({
  maxTasksInList: 20,      // 최대 작업 수 제한
  autoCleanup: true        // 자동 정리 활성화
});
```

## 문제 해결

### 검증 오류

```typescript
const result = validateThought(input);

if (!result.valid) {
  console.error("검증 실패:", result.errors);
  console.warn("경고:", result.warnings);
}
```

### 세션 복구

```typescript
// 세션 내보내기
const backup = adapter.exportSession();

// 오류 발생 시 복구
try {
  // 작업 수행
} catch (error) {
  adapter.importSession(backup);
}
```

## 라이선스

Apache 2.0 - 본 프로젝트와 동일

## 기여

개선 사항이나 버그 리포트는 GitHub 이슈로 제출해주세요.
