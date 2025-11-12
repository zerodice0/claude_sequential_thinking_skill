# Sequential Thinking Skill 테스트 빠른 시작 가이드

MCP 서버 없이 Skill만 테스트하는 가장 빠른 방법입니다.

## ⚡ 5분 안에 시작하기

### 1. 테스트 스킬 설치 확인

이미 설치되어 있습니다:

```bash
ls ~/.claude/skills/sequential-thinking-test/
# 출력: SKILL.md
```

### 2. Claude Code/Desktop 재시작

```bash
# macOS에서 완전 종료
killall Claude

# 또는 Activity Monitor에서 Claude 프로세스 종료 후
# Claude 앱을 다시 실행
```

### 3. 테스트 프롬프트 실행

새로운 대화에서 다음과 같이 입력:

```
sequential-thinking-test 스킬을 사용해서
새로운 결제 시스템 설계를 단계별로 분석해줘
```

### 4. 기대 결과

TodoWrite에 다음과 같은 항목이 생성됩니다:

```
💭 Thought 1/6: 결제 시스템의 핵심 요구사항 파악
💭 Thought 2/6: 보안 및 규정 준수 요구사항
💭 Thought 3/6: 결제 게이트웨이 옵션 분석
...
✅ Thought 6/6 [Complete]: 최종 아키텍처 권장사항
```

## ✅ 체크리스트

테스트가 성공적이면:

- [ ] TodoWrite에 💭 아이콘이 표시됨
- [ ] Thought X/Y 형식으로 진행 상황 표시
- [ ] MCP 도구(`mcp__sequential-thinking__sequentialthinking`)가 호출되지 않음

## 🔄 다음 테스트 케이스

### 분기 기능 테스트

```
sequential-thinking-test 스킬을 사용해서
MySQL vs PostgreSQL 선택을
두 가지 분기로 나눠서 비교 분석해줘
```

**기대 결과**:

```
💭 Thought 1/6: 데이터베이스 요구사항 정의
💭 Thought 2/6: 공통 평가 기준 수립
🌿 [Branch A] Thought 3a/8: MySQL 접근법 탐색
🌿 [Branch B] Thought 3b/8: PostgreSQL 접근법 탐색
💭 Thought 6/8: 브랜치 비교 및 최종 권장
```

## 📚 더 자세한 가이드

- 전체 테스트 시나리오: [test/SKILL_TEST_GUIDE.md](test/SKILL_TEST_GUIDE.md)
- 통합 테스트 코드: [test/integration/skill-test.ts](test/integration/skill-test.ts)
- MCP 서버 비활성화 방법: [test/SKILL_TEST_GUIDE.md#방법-2-mcp-서버-임시-비활성화](test/SKILL_TEST_GUIDE.md#방법-2-mcp-서버-임시-비활성화)

## 🐛 문제 해결

### "스킬이 활성화되지 않아요"

1. Claude 완전 재시작 확인
2. 스킬 파일이 올바른 위치에 있는지 확인:
   ```bash
   cat ~/.claude/skills/sequential-thinking-test/SKILL.md | head -3
   ```
3. name 필드 확인:
   ```yaml
   ---
   name: sequential-thinking-test # 정확해야 함
   ---
   ```

### "MCP 도구가 여전히 호출돼요"

명시적으로 스킬 이름을 언급하세요:

```
"sequential-thinking-test 스킬을 사용해서 ..."
```

### "TodoWrite 항목이 이상해요"

SKILL.md의 최신 버전인지 확인:

```bash
cd /path/to/sequential_thinking_skill
cp SKILL.md ~/.claude/skills/sequential-thinking-test/
```

## 🎉 성공하셨나요?

이제 다음을 시도해보세요:

1. 자동 활성화 테스트 (MCP 서버 비활성화 후)
2. 복잡한 실제 문제로 테스트
3. 통합 테스트 스크립트 실행: `npm run test:integration`

---

**질문이나 이슈가 있나요?**

- [GitHub Issues](https://github.com/zerodice0/claude_sequential_thinking_skill/issues)에 보고해주세요
- [전체 테스트 가이드](test/SKILL_TEST_GUIDE.md)를 참조하세요
