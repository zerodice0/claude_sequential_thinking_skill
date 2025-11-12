# Sequential Thinking Skill 테스트 가이드

MCP 서버와 독립적으로 Skill 구현체를 테스트하는 방법입니다.

## 🎯 테스트 목적

- ✅ MCP `sequential-thinking` 서버와 충돌 없이 Skill만 테스트
- ✅ 자동 활성화 로직 검증
- ✅ TodoWrite 통합 동작 확인
- ✅ 분기(Branching) 기능 검증

---

## 🔧 방법 1: 테스트 전용 스킬 사용 (권장)

### 설치

```bash
# 1. 테스트 스킬이 이미 설치되어 있는지 확인
ls ~/.claude/skills/sequential-thinking-test/

# 2. 없다면 레포지터리에서 설치
mkdir -p ~/.claude/skills/sequential-thinking-test
cp SKILL.md ~/.claude/skills/sequential-thinking-test/
```

### 사용법

**명시적 호출로 테스트**:

```
"sequential-thinking-test 스킬을 사용해서
마이크로서비스 vs 모놀리식 아키텍처를 단계별로 분석해줘"
```

### 테스트 케이스

#### TC-001: 기본 단계적 사고
**프롬프트**:
```
sequential-thinking-test 스킬을 사용해서
새로운 결제 시스템 설계를 단계별로 분석해줘
```

**기대 결과**:
- [ ] TodoWrite에 💭 아이콘 포함 항목 생성
- [ ] thoughtNumber/totalThoughts 형식 표시 (예: 1/5)
- [ ] 각 단계가 순차적으로 진행

**검증**:
```bash
# Claude Code에서 TodoWrite 확인:
# - 💭 Thought 1/X: [내용]
# - 💭 Thought 2/X: [내용]
# ...
```

#### TC-002: 분기 탐색
**프롬프트**:
```
sequential-thinking-test 스킬을 사용해서
데이터베이스 선택 (MySQL vs PostgreSQL)에 대해
두 가지 접근법을 분기하여 비교 분석해줘
```

**기대 결과**:
- [ ] 🌿 아이콘으로 분기 표시
- [ ] Branch A, Branch B 명확히 구분
- [ ] 각 브랜치가 독립적으로 탐색됨

**검증**:
```
예상 출력:
💭 Thought 1/6: 문제 정의
💭 Thought 2/6: 공통 요구사항 파악
🌿 [Branch A] Thought 3a/8: MySQL 접근법...
🌿 [Branch B] Thought 3b/8: PostgreSQL 접근법...
💭 Thought 6/8: 브랜치 비교 및 최종 권장사항
```

#### TC-003: 수정 기능
**프롬프트**:
```
sequential-thinking-test 스킬을 사용해서
API 설계를 분석하되, 중간에 새로운 요구사항이 발견되면
이전 단계를 수정해줘
```

**기대 결과**:
- [ ] ✏️ 아이콘으로 수정 표시
- [ ] revisesThought 필드가 설정됨
- [ ] 수정된 생각이 명확히 표시됨

#### TC-004: 동적 확장
**프롬프트**:
```
sequential-thinking-test 스킬을 사용해서
복잡한 분산 시스템 아키텍처를 분석하되,
필요하면 단계 수를 늘려줘
```

**기대 결과**:
- [ ] totalThoughts가 동적으로 증가
- [ ] needsMoreThoughts 플래그 활용

---

## 🔧 방법 2: MCP 서버 임시 비활성화

### 준비

```bash
# 1. MCP 설정 백업
cp "$HOME/Library/Application Support/Claude/claude_desktop_config.json" \
   "$HOME/Library/Application Support/Claude/claude_desktop_config.json.backup"

# 2. MCP 설정 파일 편집
# "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
```

### MCP 서버 비활성화

**방법 A**: 이름 변경
```json
{
  "mcpServers": {
    "_disabled_sequential-thinking": {  // 언더스코어 추가
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

**방법 B**: 주석 처리 (JSON은 주석 미지원이므로 제거 권장)
```json
{
  "mcpServers": {
    // "sequential-thinking" 항목 완전히 제거
  }
}
```

### Skill 설치

```bash
# 실제 이름으로 설치 (테스트용 아님)
mkdir -p ~/.claude/skills/sequential-thinking
cp SKILL.md ~/.claude/skills/sequential-thinking/
```

### Claude 재시작

```bash
# Claude Desktop/Code 완전 종료 후 재시작
# macOS에서:
killall Claude
# 또는 Activity Monitor에서 Claude 프로세스 강제 종료
```

### 자동 활성화 테스트

**프롬프트** (자동 활성화 키워드 사용):
```
이 마이크로서비스 아키텍처를 단계별로 분석해줘
```

**기대 동작**:
- ✅ `sequential-thinking` 스킬이 자동으로 활성화됨
- ✅ MCP 도구 (`mcp__sequential-thinking__sequentialthinking`) 호출 안 됨
- ✅ TodoWrite 통합 동작

### 원복

```bash
# MCP 설정 복원
cp "$HOME/Library/Application Support/Claude/claude_desktop_config.json.backup" \
   "$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# Claude 재시작
```

---

## 🔧 방법 3: 통합 테스트 스크립트

### 헬퍼 함수 테스트

```bash
# 1. 의존성 설치
cd /path/to/sequential_thinking_skill
npm install

# 2. 단위 테스트 실행
npm test

# 3. 커버리지 확인
npm run test:coverage
```

### 통합 테스트 실행

```bash
# 통합 테스트 스크립트 실행
npm run test:integration  # (구현 예정)
```

---

## ✅ 검증 체크리스트

### 자동 활성화
- [ ] "단계별로 생각해봐" → 스킬 활성화
- [ ] "체계적으로 분석해줘" → 스킬 활성화
- [ ] "단계적으로 접근해줘" → 스킬 활성화
- [ ] MCP 도구 직접 호출 안 됨

### TodoWrite 통합
- [ ] 💭 아이콘이 표시됨
- [ ] Thought X/Y 형식 정확
- [ ] activeForm 필드가 올바름
- [ ] status 필드 (in_progress, completed) 정확

### 분기 기능
- [ ] 🌿 아이콘으로 분기 표시
- [ ] branchId가 명확히 구분됨
- [ ] 독립적 탐색 경로

### 수정 기능
- [ ] ✏️ 아이콘으로 수정 표시
- [ ] revisesThought 필드 설정
- [ ] 수정 이력 추적

---

## 🚨 트러블슈팅

### 문제: MCP 서버가 여전히 호출됨

**원인**: Skill이 설치되지 않았거나 이름이 틀림

**해결**:
```bash
# 스킬 파일 확인
cat ~/.claude/skills/sequential-thinking/SKILL.md | head -5

# name 필드 확인
# 출력: name: sequential-thinking (또는 sequential-thinking-test)
```

### 문제: 스킬이 자동 활성화되지 않음

**원인**: 활성화 키워드가 매칭되지 않음

**해결**:
- 명시적으로 스킬 이름 언급
- SKILL.md의 활성화 조건 확인

### 문제: TodoWrite 항목이 생성되지 않음

**원인**: SKILL.md의 TodoWrite 통합 로직 문제

**해결**:
```bash
# SKILL.md의 TodoWrite 섹션 확인
grep -A 20 "TodoWrite Integration" ~/.claude/skills/sequential-thinking/SKILL.md
```

---

## 📊 테스트 결과 기록

### 테스트 실행 로그

**날짜**: YYYY-MM-DD
**환경**: Claude Code / Claude Desktop
**MCP 상태**: 활성화 / 비활성화

| TC | 테스트 케이스 | 결과 | 비고 |
|----|-------------|------|------|
| TC-001 | 기본 단계적 사고 | ✅ | - |
| TC-002 | 분기 탐색 | ✅ | - |
| TC-003 | 수정 기능 | ⚠️ | revisesThought 표시 개선 필요 |
| TC-004 | 동적 확장 | ✅ | - |

### 발견된 이슈

1. **이슈 제목**: [설명]
   - **재현 방법**: [단계]
   - **기대 결과**: [설명]
   - **실제 결과**: [설명]
   - **우선순위**: High / Medium / Low

---

## 📚 참고 자료

- [SKILL.md](../SKILL.md) - 스킬 구현 전체
- [User Guide](../docs/user-guide.md) - 사용자 가이드
- [Examples](../examples/) - 예시 모음
- [Helper Functions](../helpers/) - TypeScript 헬퍼

---

## 🤝 기여

테스트 결과를 공유하거나 새로운 테스트 케이스를 제안하려면:

1. 이슈 생성: https://github.com/zerodice0/claude_sequential_thinking_skill/issues
2. PR 제출: 새로운 테스트 케이스 추가
3. 디스커션: 테스트 방법론 논의

---

**마지막 업데이트**: 2025-01-12
