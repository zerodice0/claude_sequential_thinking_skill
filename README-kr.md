# Sequential Thinking Skill for Claude Code

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/zerodice0/claude_sequential_thinking_skill)](https://github.com/zerodice0/claude_sequential_thinking_skill/stargazers)

> 한국어 | **[English](README.md)**

복잡한 문제를 체계적으로 분석하고 해결하는 Claude Code Skill

## 🎯 Overview

Sequential Thinking Skill은 복잡한 문제를 단계적으로 분석하고 해결하기 위한 구조화된 사고 프레임워크입니다. MCP (Model Context Protocol) 서버로 구현된 기능을 Claude Code Skill로 재구현하여, 별도의 서버 설치 없이 TodoWrite 도구를 활용한 체계적인 다단계 추론을 제공합니다.

### ✨ Key Features

- 🧠 **단계별 추론**: TodoWrite를 활용하여 각 사고 단계를 명확하게 추적
- 🌿 **분기 지원**: 동일한 지점에서 여러 접근 방식을 동시에 탐색
- ✏️ **수정 기능**: 이전 단계로 돌아가 새로운 인사이트 반영
- 📊 **시각화**: 이모지와 구조화된 출력으로 사고 흐름 표현
- 🎯 **동적 조정**: 필요에 따라 사고 단계 수를 자동 조정
- 💾 **상태 지속성**: TodoWrite를 통한 세션 간 상태 유지

---

## 🚀 Quick Start

### Installation

#### Method 1: Using Install Script (권장)

가장 쉽고 빠른 설치 방법:

```bash
# 저장소 클론
git clone https://github.com/zerodice0/claude_sequential_thinking_skill.git
cd claude_sequential_thinking_skill

# 설치 스크립트 실행 (대화형)
./install.sh

# 또는 직접 전역 설치
./install.sh --global

# 또는 로컬 프로젝트에만 설치
./install.sh --local
```

설치 스크립트는 다음을 자동으로 수행합니다:
- ✅ 필요한 디렉터리 생성
- ✅ SKILL.md 및 slash command 파일 복사
- ✅ 설치 검증 및 사용법 안내

#### Method 2: Via Marketplace (출시 후)

```bash
/plugin marketplace add anthropics/skills
/plugin install sequential-thinking@anthropic-agent-skills
```

#### Method 3: Manual Installation

```bash
# Skill 디렉토리 생성
mkdir -p ~/.claude/skills/sequential-thinking
mkdir -p ~/.claude/commands/sequential-thinking

# 파일 다운로드
curl -o ~/.claude/skills/sequential-thinking/SKILL.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/SKILL.md

curl -o ~/.claude/commands/sequential-thinking/think.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/.claude/commands/think.md

curl -o ~/.claude/commands/sequential-thinking/analyze.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/.claude/commands/analyze.md
```

### Uninstallation

설치를 제거하려면:

```bash
# 대화형 제거
./uninstall.sh

# 전역 설치 제거
./uninstall.sh --global

# 로컬 설치 제거
./uninstall.sh --local

# 모든 설치 제거
./uninstall.sh --all
```

### Basic Usage

#### Method 1: Using Slash Commands (권장)

Sequential thinking을 빠르게 활성화하려면 slash command를 사용하세요:

```bash
# 복잡한 문제 분석
/think How should I design a scalable microservices architecture?

# 빠른 체계적 분석
/analyze performance bottleneck in user authentication flow
```

#### Method 2: Natural Language (자동 활성화)

Claude Code에서 복잡한 문제를 다룰 때 자동으로 활성화됩니다:

```
You: "이 마이크로서비스 아키텍처의 장단점을 체계적으로 분석해줘"

Claude: [sequential-thinking skill 자동 활성화]

💭 Thought 1/6: 마이크로서비스 아키텍처의 핵심 특성 파악
...
```

스킬은 다음과 같은 경우 자동으로 활성화됩니다:
- "단계적으로 생각해봐", "체계적으로 분석해줘"
- 3단계 이상의 추론이 필요한 복잡한 문제
- 여러 옵션을 비교하고 평가하는 상황

#### Available Commands

- **`/think [problem]`**: 복잡한 문제에 대한 전체 sequential thinking 활성화
- **`/analyze [topic]`**: 빠른 체계적 분석을 위한 간소화 버전

---

## 📚 Documentation

### 🚀 Getting Started
- [⚡ 5분 시작 가이드](SKILL.md#-5분-시작-가이드) - 빠른 시작 튜토리얼
- [⚙️ Installation Guide](docs/installation.md) - 설치 방법 상세 및 검증
- [⚡ Slash Command Usage](examples/slash-command-usage.md) - `/think`와 `/analyze` 명령어 가이드

### 📖 Core Guides
- [📖 User Guide](docs/user-guide.md) - 전체 기능 및 사용 가이드
- [💡 Best Practices](docs/best-practices.md) - 효과적인 사용 패턴 및 가이드라인

### 🔄 Migration & Advanced
- [🔄 Migration from MCP](docs/migration-from-mcp.md) - MCP 서버에서 마이그레이션
- [🧪 Testing Guide](test/SKILL_TEST_GUIDE.md) - Skill 테스트 가이드

---

## 📋 Examples

### Example 1: Basic Problem Analysis

**Problem**: 새로운 결제 시스템 설계

```
💭 Thought 1/6: 결제 시스템의 핵심 요구사항 파악
💭 Thought 2/6: 주요 제약사항 및 트레이드오프 식별
🌿 [Branch A] Thought 3a/8: PG사 직접 연동 접근
🌿 [Branch B] Thought 3b/8: 자체 결제 시스템 구축
💭 Thought 4/8: 비용 분석 및 하이브리드 전략 고려
✅ Thought 6/8 [Complete]: 최종 권장사항 및 실행 계획
```

[→ 전체 예시 보기](examples/basic-usage.md)

### Example 2: Debugging with Branching

**Problem**: 프로덕션 간헐적 500 에러

```
💭 Thought 1/7: 문제 현상 정확히 파악
🔍 Thought 2/7: 로그 및 메트릭 분석
🌿 [Branch: hypothesis-1] Connection pool 검증
🌿 [Branch: hypothesis-2] 느린 쿼리 분석
💡 Thought 5/10: 핵심 발견 - 복합 원인 식별
✅ Thought 7/10 [Complete]: 실행 계획 및 검증 방법
```

[→ 전체 예시 보기](examples/debugging-scenario.md)

### Example 3: Architecture Decision

**Problem**: 마이크로서비스 vs 모놀리식

[→ 전체 예시 보기](examples/complex-problem.md)

### More Examples

- [Branching Example](examples/branching-example.md) - 분기 기능 활용
- [Revision Example](examples/revision-example.md) - 수정 기능 활용

---

## 🆚 Comparison

### MCP Server vs Skill

| Feature | MCP Server | Skill |
|---------|-----------|-------|
| **Installation** | NPM/Docker 필요 | 단일 파일 복사 |
| **Setup Time** | 5-10분 | 1분 |
| **Performance** | ~50ms (IPC 오버헤드) | ~5ms (직접 호출) |
| **Customization** | 소스 수정 + 빌드 | SKILL.md 직접 편집 |
| **State Management** | 메모리 (휘발성) | TodoWrite (지속성) |
| **Debugging** | 외부 프로세스 | 로컬 실행 |
| **Dependencies** | Node.js, npm | 없음 |

### When to Use

**Sequential Thinking Skill is best for:**
- 🎯 복잡한 문제 분석 (3단계 이상)
- 🔍 체계적인 디버깅 및 조사
- 🏗️ 아키텍처 및 설계 의사결정
- 📊 여러 옵션의 장단점 비교
- 🎨 창의적 문제 해결 및 브레인스토밍

**Not recommended for:**
- ❌ 단순한 정보 검색
- ❌ 1-2단계로 끝나는 간단한 질문
- ❌ 코드 생성만 필요한 경우

---

## 🎓 Core Concepts

### 1. Thoughts (생각)

각 사고 단계는 다음 구조를 가집니다:

```typescript
interface ThoughtData {
  // 필수 필드
  thought: string;              // 생각 내용
  thoughtNumber: number;        // 현재 단계
  totalThoughts: number;        // 총 단계
  nextThoughtNeeded: boolean;   // 다음 필요 여부

  // 선택 필드
  isRevision?: boolean;         // 수정 여부
  revisesThought?: number;      // 수정 대상
  branchId?: string;            // 분기 ID
  branchFromThought?: number;   // 분기 시작점
}
```

### 2. Branching (분기)

여러 접근법을 동시에 탐색:

```
Thought 1: 문제 정의
Thought 2: 제약사항 파악
  ├─ 🌿 Branch A: 성능 우선
  │   └─ Thought 3a, 4a, 5a
  └─ 🌿 Branch B: 단순성 우선
      └─ Thought 3b, 4b, 5b
Thought 6: 브랜치 비교 및 결론
```

### 3. Revision (수정)

이전 생각을 재평가하고 개선:

```
Thought 4: MySQL 선택
...
Thought 6: 실시간 분석 요구사항 발견
Thought 4' (revision): PostgreSQL로 재평가
```

---

## 💻 Technical Details

### Data Flow

```
User Input
    ↓
Sequential Thinking Skill Activation
    ↓
ThoughtData Validation
    ↓
TodoWrite Integration
    ↓
┌─ Regular Thought → 💭 TodoItem
├─ Branching → 🌿 TodoItem
├─ Revision → ✏️ TodoItem
└─ Completion → ✅ TodoItem
    ↓
Response to User
```

### Helper Functions (Optional)

복잡한 시나리오를 위한 TypeScript 헬퍼:

```typescript
// helpers/sequential-thinking.ts
export class SequentialThinkingHelper {
  validate(data: ThoughtData): ValidationResult;
  formatForTodoWrite(data: ThoughtData): TodoItem;
  recordThought(data: ThoughtData): void;
}
```

자세한 내용은 `helpers/` 디렉토리를 참조하세요.

---

## 🛠️ Development

### Prerequisites

```bash
# Node.js 18+ (헬퍼 개발용, 선택사항)
node --version

# Git
git --version
```

### Local Development

```bash
# Repository 클론
git clone https://github.com/zerodice0/claude_sequential_thinking_skill.git
cd claude_sequential_thinking_skill

# Dependencies 설치 (헬퍼 개발 시)
npm install

# 테스트 실행
npm test

# SKILL.md 수정 후 로컬 테스트
cp SKILL.md ~/.claude/skills/sequential-thinking/
```

### Running Tests

```bash
# 전체 테스트
npm test

# Watch 모드
npm run test:watch

# Coverage
npm run test:coverage

# 통합 테스트만 실행
npm run test:integration

# 통합 테스트 Watch 모드
npm run test:integration:watch
```

### Testing the Skill (MCP 서버와 독립적으로)

Skill 구현체를 MCP 서버와 충돌 없이 테스트하는 방법:

#### 방법 1: 테스트 전용 스킬 사용 (빠른 테스트)

```bash
# 1. 테스트 스킬이 이미 설치되어 있는지 확인
ls ~/.claude/skills/sequential-thinking-test/

# 2. 프롬프트에서 명시적으로 호출
"sequential-thinking-test 스킬을 사용해서
마이크로서비스 아키텍처를 단계별로 분석해줘"
```

#### 방법 2: MCP 서버 임시 비활성화 (완전한 테스트)

```bash
# 1. MCP 설정 백업
cp "$HOME/Library/Application Support/Claude/claude_desktop_config.json" \
   "$HOME/Library/Application Support/Claude/claude_desktop_config.json.backup"

# 2. claude_desktop_config.json에서 sequential-thinking 서버 비활성화
# "_disabled_sequential-thinking"으로 이름 변경

# 3. Skill 설치
mkdir -p ~/.claude/skills/sequential-thinking
cp SKILL.md ~/.claude/skills/sequential-thinking/

# 4. Claude 재시작 후 자동 활성화 테스트
"이 시스템을 단계별로 분석해줘"  # 자동 활성화됨
```

#### 자세한 테스트 가이드

전체 테스트 시나리오, 체크리스트, 트러블슈팅은 [test/SKILL_TEST_GUIDE.md](test/SKILL_TEST_GUIDE.md)를 참조하세요.

---

## 🤝 Contributing

버그 제보, 개선 제안, 기여를 환영합니다!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-improvement
   ```
3. **Make your changes**:
   - SKILL.md 개선
   - 예시 추가
   - 문서 업데이트
   - 헬퍼 함수 개선
4. **Test your changes**
5. **Commit with clear message**:
   ```bash
   git commit -m "feat: add example for complex debugging scenario"
   ```
6. **Push and create Pull Request**

### Contribution Guidelines

- 명확하고 설명적인 커밋 메시지 사용
- SKILL.md 수정 시 실제 사용 검증
- 새로운 기능은 예시와 함께 문서화
- 테스트 추가 (헬퍼 함수 수정 시)

자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참조하세요.

---

## 📜 License

Apache 2.0 License - [LICENSE](LICENSE) 파일을 참조하세요.

```
Copyright 2025 zerodice0

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
```

---

## 🙏 Credits

이 skill은 다음을 기반으로 개발되었습니다:

- [Sequential Thinking MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking) - 원본 MCP 구현
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP 표준
- [Claude Code](https://claude.ai/code) - Anthropic의 AI 코딩 도구

---

## 📞 Support

### Getting Help

- 📖 [Documentation](docs/user-guide.md) - 상세 가이드
- 💬 [GitHub Discussions](https://github.com/zerodice0/claude_sequential_thinking_skill/discussions) - 질문 및 토론
- 🐛 [GitHub Issues](https://github.com/zerodice0/claude_sequential_thinking_skill/issues) - 버그 제보

### Useful Links

- [Claude Code Documentation](https://docs.claude.com/claude-code)
- [Skills Marketplace](https://github.com/anthropics/skills)
- [MCP Documentation](https://modelcontextprotocol.io/introduction)

---

## 🗺️ Roadmap

### v1.0 (Current)
- ✅ Core skill implementation
- ✅ TodoWrite integration
- ✅ Branching and revision support
- ✅ Comprehensive documentation

### v1.1 (Planned)
- ⏳ Additional examples
- ⏳ Helper function enhancements
- ⏳ Integration with other skills
- ⏳ Performance optimizations

### v2.0 (Future)
- 🔮 Advanced visualization
- 🔮 Collaborative thinking sessions
- 🔮 Thought templates
- 🔮 Analytics and insights

---

## 📊 Statistics

![GitHub repo size](https://img.shields.io/github/repo-size/zerodice0/claude_sequential_thinking_skill)
![GitHub issues](https://img.shields.io/github/issues/zerodice0/claude_sequential_thinking_skill)
![GitHub pull requests](https://img.shields.io/github/issues-pr/zerodice0/claude_sequential_thinking_skill)
![GitHub last commit](https://img.shields.io/github/last-commit/zerodice0/claude_sequential_thinking_skill)

---

Made with ❤️ by [zerodice0](https://github.com/zerodice0)
