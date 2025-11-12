# Sequential Thinking Skill Testing Guide

> English | **[한국어](SKILL_TEST_GUIDE-kr.md)**

How to test the Skill implementation independently of the MCP server.

## 🎯 Testing Objectives

- ✅ Test Skill without conflicts with MCP `sequential-thinking` server
- ✅ Verify auto-activation logic
- ✅ Confirm TodoWrite integration
- ✅ Validate branching functionality

---

## 🔧 Method 1: Using Test-Specific Skill (Recommended)

### Installation

```bash
# 1. Check if test skill is already installed
ls ~/.claude/skills/sequential-thinking-test/

# 2. If not, install from repository
mkdir -p ~/.claude/skills/sequential-thinking-test
cp SKILL.md ~/.claude/skills/sequential-thinking-test/
```

### Usage

**Explicit invocation for testing**:

```
"Use sequential-thinking-test skill to
analyze microservices vs monolithic architecture step by step"
```

### Test Cases

#### TC-001: Basic Sequential Thinking
**Prompt**:
```
Use sequential-thinking-test skill to
analyze payment system design step by step
```

**Expected Results**:
- [ ] TodoWrite items created with 💭 icon
- [ ] Display format: thoughtNumber/totalThoughts (e.g., 1/5)
- [ ] Steps progress sequentially

**Verification**:
```bash
# Check TodoWrite in Claude Code:
# - 💭 Thought 1/X: [content]
# - 💭 Thought 2/X: [content]
# ...
```

#### TC-002: Branch Exploration
**Prompt**:
```
Use sequential-thinking-test skill to
compare database choices (MySQL vs PostgreSQL)
with branching to evaluate both approaches
```

**Expected Results**:
- [ ] Branches marked with 🌿 icon
- [ ] Branch A and Branch B clearly distinguished
- [ ] Each branch explored independently

**Verification**:
```
Expected output:
💭 Thought 1/6: Problem definition
💭 Thought 2/6: Common requirements
🌿 [Branch A] Thought 3a/8: MySQL approach...
🌿 [Branch B] Thought 3b/8: PostgreSQL approach...
💭 Thought 6/8: Branch comparison and final recommendation
```

#### TC-003: Revision Feature
**Prompt**:
```
Use sequential-thinking-test skill to
analyze API design, and if new requirements are discovered midway,
revise previous steps
```

**Expected Results**:
- [ ] Revisions marked with ✏️ icon
- [ ] revisesThought field is set
- [ ] Revised thoughts clearly indicated

#### TC-004: Dynamic Expansion
**Prompt**:
```
Use sequential-thinking-test skill to
analyze complex distributed system architecture,
expand steps if needed
```

**Expected Results**:
- [ ] totalThoughts dynamically increases
- [ ] needsMoreThoughts flag utilized

---

## 🔧 Method 2: Temporarily Disable MCP Server

### Preparation

```bash
# 1. Backup MCP settings
cp "$HOME/Library/Application Support/Claude/claude_desktop_config.json" \
   "$HOME/Library/Application Support/Claude/claude_desktop_config.json.backup"

# 2. Edit MCP configuration file
# "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
```

### Disable MCP Server

**Method A**: Rename
```json
{
  "mcpServers": {
    "_disabled_sequential-thinking": {  // Add underscore
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

**Method B**: Remove (JSON doesn't support comments, so removal recommended)
```json
{
  "mcpServers": {
    // Remove "sequential-thinking" entry completely
  }
}
```

### Install Skill

```bash
# Install with actual name (not for testing)
mkdir -p ~/.claude/skills/sequential-thinking
cp SKILL.md ~/.claude/skills/sequential-thinking/
```

### Restart Claude

```bash
# Completely quit and restart Claude Desktop/Code
# On macOS:
killall Claude
# Or force quit Claude process in Activity Monitor
```

### Test Auto-Activation

**Prompt** (using auto-activation keywords):
```
Analyze this microservices architecture step by step
```

**Expected Behavior**:
- ✅ `sequential-thinking` skill automatically activates
- ✅ MCP tool (`mcp__sequential-thinking__sequentialthinking`) NOT called
- ✅ TodoWrite integration works

### Restore

```bash
# Restore MCP settings
cp "$HOME/Library/Application Support/Claude/claude_desktop_config.json.backup" \
   "$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# Restart Claude
```

---

## 🔧 Method 3: Integration Test Scripts

### Helper Function Tests

```bash
# 1. Install dependencies
cd /path/to/sequential_thinking_skill
npm install

# 2. Run unit tests
npm test

# 3. Check coverage
npm run test:coverage
```

### Run Integration Tests

```bash
# Run integration test scripts
npm run test:integration
```

---

## ✅ Verification Checklist

### Auto-Activation
- [ ] "Think step by step" → Skill activates
- [ ] "Analyze systematically" → Skill activates
- [ ] "Approach step by step" → Skill activates
- [ ] MCP tool NOT directly called

### TodoWrite Integration
- [ ] 💭 icon displayed
- [ ] Thought X/Y format accurate
- [ ] activeForm field correct
- [ ] status field (in_progress, completed) accurate

### Branching Feature
- [ ] Branches marked with 🌿 icon
- [ ] branchId clearly distinguished
- [ ] Independent exploration paths

### Revision Feature
- [ ] Revisions marked with ✏️ icon
- [ ] revisesThought field set
- [ ] Revision history tracked

---

## 🚨 Troubleshooting

### Issue: MCP server still being called

**Cause**: Skill not installed or incorrect name

**Solution**:
```bash
# Check skill file
cat ~/.claude/skills/sequential-thinking/SKILL.md | head -5

# Verify name field
# Output: name: sequential-thinking (or sequential-thinking-test)
```

### Issue: Skill not auto-activating

**Cause**: Activation keywords not matched

**Solution**:
- Explicitly mention skill name
- Check activation conditions in SKILL.md

### Issue: TodoWrite items not created

**Cause**: TodoWrite integration logic issue in SKILL.md

**Solution**:
```bash
# Check TodoWrite section in SKILL.md
grep -A 20 "TodoWrite Integration" ~/.claude/skills/sequential-thinking/SKILL.md
```

---

## 📊 Test Results Log

### Test Execution Log

**Date**: YYYY-MM-DD
**Environment**: Claude Code / Claude Desktop
**MCP Status**: Enabled / Disabled

| TC | Test Case | Result | Notes |
|----|-----------|--------|-------|
| TC-001 | Basic sequential thinking | ✅ | - |
| TC-002 | Branch exploration | ✅ | - |
| TC-003 | Revision feature | ⚠️ | revisesThought display needs improvement |
| TC-004 | Dynamic expansion | ✅ | - |

### Issues Found

1. **Issue Title**: [Description]
   - **Reproduction Steps**: [Steps]
   - **Expected Result**: [Description]
   - **Actual Result**: [Description]
   - **Priority**: High / Medium / Low

---

## 📚 References

- [SKILL.md](../SKILL.md) - Complete skill implementation
- [User Guide](../docs/user-guide.md) - User guide
- [Examples](../examples/) - Example collection
- [Helper Functions](../helpers/) - TypeScript helpers

---

## 🤝 Contributing

To share test results or suggest new test cases:

1. Create issue: https://github.com/zerodice0/claude_sequential_thinking_skill/issues
2. Submit PR: Add new test cases
3. Discussion: Discuss testing methodologies

---

**Last Updated**: 2025-01-12
