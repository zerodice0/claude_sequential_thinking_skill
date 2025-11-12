# Sequential Thinking Skill for Claude Code

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/zerodice0/claude_sequential_thinking_skill)](https://github.com/zerodice0/claude_sequential_thinking_skill/stargazers)

> **[한국어 문서](README-kr.md)** | English

A structured thinking framework for Claude Code that enables systematic multi-step reasoning to solve complex problems.

## 🎯 Overview

Sequential Thinking Skill is a structured reasoning framework designed for systematic analysis and problem-solving. Originally implemented as an MCP (Model Context Protocol) server, it has been reimagined as a Claude Code Skill that leverages TodoWrite for enhanced state management without requiring separate server installation.

### ✨ Key Features

- 🧠 **Step-by-Step Reasoning**: Clear tracking of each thought step using TodoWrite
- 🌿 **Branching Support**: Explore multiple approaches simultaneously from the same point
- ✏️ **Revision Capability**: Return to previous steps to incorporate new insights
- 📊 **Visual Flow**: Structured output with emojis to represent thinking progression
- 🎯 **Dynamic Adjustment**: Automatically adjusts thought count as needed
- 💾 **State Persistence**: Cross-session state management through TodoWrite

---

## 🚀 Quick Start

### Installation

#### Method 1: Using Install Script (Recommended)

The easiest and fastest installation method:

```bash
# Clone repository
git clone https://github.com/zerodice0/claude_sequential_thinking_skill.git
cd claude_sequential_thinking_skill

# Run interactive installer
./install.sh

# Or install directly to global location
./install.sh --global

# Or install to local project only
./install.sh --local
```

The install script automatically:

- ✅ Creates necessary directories
- ✅ Copies SKILL.md and slash command files
- ✅ Verifies installation and provides usage instructions

#### Method 2: Via Marketplace (After official release)

```bash
/plugin marketplace add anthropics/skills
/plugin install sequential-thinking@anthropic-agent-skills
```

#### Method 3: Manual Installation

```bash
# Create skill directory
mkdir -p ~/.claude/skills/sequential-thinking
mkdir -p ~/.claude/commands/sequential-thinking

# Download files
curl -o ~/.claude/skills/sequential-thinking/SKILL.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/SKILL.md

curl -o ~/.claude/commands/sequential-thinking/think.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/.claude/commands/think.md

curl -o ~/.claude/commands/sequential-thinking/analyze.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/.claude/commands/analyze.md
```

### Uninstallation

To remove the installation:

```bash
# Interactive removal
./uninstall.sh

# Remove global installation
./uninstall.sh --global

# Remove local installation
./uninstall.sh --local

# Remove all installations
./uninstall.sh --all
```

### Basic Usage

#### Method 1: Using Slash Commands (Recommended)

Quickly activate sequential thinking with slash commands:

```bash
# Analyze complex problems
/think How should I design a scalable microservices architecture?

# Quick systematic analysis
/analyze performance bottleneck in user authentication flow
```

#### Method 2: Natural Language (Auto-activation)

Automatically activates when dealing with complex problems in Claude Code:

```
You: "Systematically analyze the pros and cons of this microservices architecture"

Claude: [sequential-thinking skill auto-activated]

💭 Thought 1/6: Understanding core characteristics of microservices
...
```

The skill automatically activates when:

- "Think step by step", "Systematically analyze"
- Complex problems requiring 3+ reasoning steps
- Situations involving comparison and evaluation of multiple options

#### Available Commands

- **`/think [problem]`**: Full sequential thinking activation for complex problems
- **`/analyze [topic]`**: Streamlined version for quick systematic analysis

---

## 📚 Documentation

### 🚀 Getting Started

- [⚡ 5-Minute Quick Start](SKILL.md#-5분-시작-가이드) - Fast tutorial
- [⚙️ Installation Guide](docs/installation.md) - Detailed installation and verification
- [⚡ Slash Command Usage](examples/slash-command-usage.md) - `/think` and `/analyze` guide

### 📖 Core Guides

- [📖 User Guide](docs/user-guide.md) - Complete feature and usage guide
- [💡 Best Practices](docs/best-practices.md) - Effective usage patterns and guidelines

### 🔄 Migration & Advanced

- [🔄 Migration from MCP](docs/migration-from-mcp.md) - Migrating from MCP server
- [🧪 Testing Guide](test/SKILL_TEST_GUIDE.md) - Skill testing guide

---

## 📋 Examples

### Example 1: Basic Problem Analysis

**Problem**: Designing a new payment system

```
💭 Thought 1/6: Understanding core requirements of payment system
💭 Thought 2/6: Identifying key constraints and trade-offs
🌿 [Branch A] Thought 3a/8: Direct PG integration approach
🌿 [Branch B] Thought 3b/8: Custom payment system approach
💭 Thought 4/8: Cost analysis and hybrid strategy consideration
✅ Thought 6/8 [Complete]: Final recommendations and action plan
```

[→ View full example](examples/basic-usage.md)

### Example 2: Debugging with Branching

**Problem**: Intermittent 500 errors in production

```
💭 Thought 1/7: Accurately identifying problem symptoms
🔍 Thought 2/7: Analyzing logs and metrics
🌿 [Branch: hypothesis-1] Connection pool verification
🌿 [Branch: hypothesis-2] Slow query analysis
💡 Thought 5/10: Key discovery - identifying compound causes
✅ Thought 7/10 [Complete]: Action plan and verification method
```

[→ View full example](examples/debugging-scenario.md)

### Example 3: Architecture Decision

**Problem**: Microservices vs Monolith

[→ View full example](examples/complex-problem.md)

### More Examples

- [Branching Example](examples/branching-example.md) - Using branching features
- [Revision Example](examples/revision-example.md) - Using revision features

---

## 🆚 Comparison

### MCP Server vs Skill

| Feature              | MCP Server                  | Skill                   |
| -------------------- | --------------------------- | ----------------------- |
| **Installation**     | Requires NPM/Docker         | Single file copy        |
| **Setup Time**       | 5-10 minutes                | 1 minute                |
| **Performance**      | ~50ms (IPC overhead)        | ~5ms (direct call)      |
| **Customization**    | Source modification + build | Direct SKILL.md editing |
| **State Management** | Memory (volatile)           | TodoWrite (persistent)  |
| **Debugging**        | External process            | Local execution         |
| **Dependencies**     | Node.js, npm                | None                    |

### When to Use

**Sequential Thinking Skill is best for:**

- 🎯 Complex problem analysis (3+ steps)
- 🔍 Systematic debugging and investigation
- 🏗️ Architecture and design decisions
- 📊 Comparing pros and cons of multiple options
- 🎨 Creative problem-solving and brainstorming

**Not recommended for:**

- ❌ Simple information lookup
- ❌ Simple questions that end in 1-2 steps
- ❌ Cases where only code generation is needed

---

## 🎓 Core Concepts

### 1. Thoughts

Each thought step has the following structure:

```typescript
interface ThoughtData {
  // Required fields
  thought: string; // Thought content
  thoughtNumber: number; // Current step
  totalThoughts: number; // Total steps
  nextThoughtNeeded: boolean; // Whether next step is needed

  // Optional fields
  isRevision?: boolean; // Whether it's a revision
  revisesThought?: number; // Target of revision
  branchId?: string; // Branch ID
  branchFromThought?: number; // Branch starting point
}
```

### 2. Branching

Explore multiple approaches simultaneously:

```
Thought 1: Problem definition
Thought 2: Constraint identification
  ├─ 🌿 Branch A: Performance-first
  │   └─ Thought 3a, 4a, 5a
  └─ 🌿 Branch B: Simplicity-first
      └─ Thought 3b, 4b, 5b
Thought 6: Branch comparison and conclusion
```

### 3. Revision

Re-evaluate and improve previous thoughts:

```
Thought 4: Choose MySQL
...
Thought 6: Discover real-time analysis requirements
Thought 4' (revision): Re-evaluate with PostgreSQL
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

TypeScript helpers for complex scenarios:

```typescript
// helpers/sequential-thinking.ts
export class SequentialThinkingHelper {
  validate(data: ThoughtData): ValidationResult;
  formatForTodoWrite(data: ThoughtData): TodoItem;
  recordThought(data: ThoughtData): void;
}
```

See the `helpers/` directory for details.

---

## 🛠️ Development

### Prerequisites

```bash
# Node.js 18+ (optional, for helper development)
node --version

# Git
git --version
```

### Local Development

```bash
# Clone repository
git clone https://github.com/zerodice0/claude_sequential_thinking_skill.git
cd claude_sequential_thinking_skill

# Install dependencies (for helper development)
npm install

# Run tests
npm test

# Test locally after modifying SKILL.md
cp SKILL.md ~/.claude/skills/sequential-thinking/
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Integration tests only
npm run test:integration

# Integration tests watch mode
npm run test:integration:watch
```

### Testing the Skill (Independent of MCP server)

How to test the Skill implementation without conflicts with MCP server:

#### Method 1: Using Test-Specific Skill (Quick test)

```bash
# 1. Check if test skill is installed
ls ~/.claude/skills/sequential-thinking-test/

# 2. Explicitly call in prompt
"Use sequential-thinking-test skill to
analyze microservices architecture step by step"
```

#### Method 2: Temporarily Disable MCP Server (Complete test)

```bash
# 1. Backup MCP settings
cp "$HOME/Library/Application Support/Claude/claude_desktop_config.json" \
   "$HOME/Library/Application Support/Claude/claude_desktop_config.json.backup"

# 2. Disable sequential-thinking server in claude_desktop_config.json
# Rename to "_disabled_sequential-thinking"

# 3. Install Skill
mkdir -p ~/.claude/skills/sequential-thinking
cp SKILL.md ~/.claude/skills/sequential-thinking/

# 4. Test auto-activation after restarting Claude
"Analyze this system step by step"  # Auto-activates
```

#### Detailed Testing Guide

See [test/SKILL_TEST_GUIDE.md](test/SKILL_TEST_GUIDE.md) for complete test scenarios, checklists, and troubleshooting.

---

## 🤝 Contributing

Bug reports, improvement suggestions, and contributions are welcome!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-improvement
   ```
3. **Make your changes**:
   - Improve SKILL.md
   - Add examples
   - Update documentation
   - Enhance helper functions
4. **Test your changes**
5. **Commit with clear message**:
   ```bash
   git commit -m "feat: add example for complex debugging scenario"
   ```
6. **Push and create Pull Request**

### Contribution Guidelines

- Use clear and descriptive commit messages
- Verify actual usage when modifying SKILL.md
- Document new features with examples
- Add tests (when modifying helper functions)

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📜 License

Apache 2.0 License - See [LICENSE](LICENSE) file.

```
Copyright 2025 zerodice0

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
```

---

## 🙏 Credits

This skill was developed based on:

- [Sequential Thinking MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking) - Original MCP implementation
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP standard
- [Claude Code](https://claude.ai/code) - Anthropic's AI coding tool

---

## 📞 Support

### Getting Help

- 📖 [Documentation](docs/user-guide.md) - Detailed guide
- 💬 [GitHub Discussions](https://github.com/zerodice0/claude_sequential_thinking_skill/discussions) - Questions and discussions
- 🐛 [GitHub Issues](https://github.com/zerodice0/claude_sequential_thinking_skill/issues) - Bug reports

### Useful Links

- [Claude Code Documentation](https://docs.claude.com/claude-code)
- [Skills Marketplace](https://github.com/anthropics/skills)
- [MCP Documentation](https://modelcontextprotocol.io/introduction)

---

## 🗺️ Roadmap

### v1.1 (Current)

- ✅ GitHub Actions CI/CD pipeline
- ✅ Quick Start guide
- ✅ Enhanced cross-document references
- ✅ Installation verification guide

### v1.2 (Planned)

- ⏳ Additional real-world examples
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
