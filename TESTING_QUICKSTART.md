# Sequential Thinking Skill - Testing Quick Start

> English | **[한국어](TESTING_QUICKSTART-kr.md)**

The fastest way to test the Skill without MCP server.

## ⚡ Get Started in 5 Minutes

### 1. Verify Test Skill Installation

Already installed:

```bash
ls ~/.claude/skills/sequential-thinking-test/
# Output: SKILL.md
```

### 2. Restart Claude Code/Desktop

```bash
# Complete shutdown on macOS
killall Claude

# Or force quit Claude process in Activity Monitor
# Then restart the Claude app
```

### 3. Run Test Prompt

In a new conversation, type:

```
Use sequential-thinking-test skill to
analyze payment system design step by step
```

### 4. Expected Results

TodoWrite items should be created like:

```
💭 Thought 1/6: Understanding core payment system requirements
💭 Thought 2/6: Security and compliance requirements
💭 Thought 3/6: Analyzing payment gateway options
...
✅ Thought 6/6 [Complete]: Final architecture recommendations
```

## ✅ Checklist

If the test is successful:

- [ ] 💭 icon appears in TodoWrite
- [ ] Progress shown in "Thought X/Y" format
- [ ] MCP tool (`mcp__sequential-thinking__sequentialthinking`) NOT called

## 🔄 Additional Test Cases

### Testing Branching Feature

```
Use sequential-thinking-test skill to
compare MySQL vs PostgreSQL with branching
```

**Expected Result**:

```
💭 Thought 1/6: Defining database requirements
💭 Thought 2/6: Establishing common evaluation criteria
🌿 [Branch A] Thought 3a/8: Exploring MySQL approach
🌿 [Branch B] Thought 3b/8: Exploring PostgreSQL approach
💭 Thought 6/8: Branch comparison and final recommendation
```

## 📚 More Detailed Guides

- Full test scenarios: [test/SKILL_TEST_GUIDE.md](test/SKILL_TEST_GUIDE.md)
- Integration test code: [test/integration/skill-test.ts](test/integration/skill-test.ts)
- MCP server disabling method: [test/SKILL_TEST_GUIDE.md#method-2-temporarily-disable-mcp-server](test/SKILL_TEST_GUIDE.md#method-2-temporarily-disable-mcp-server)

## 🐛 Troubleshooting

### "Skill is not activating"

1. Confirm Claude is completely restarted
2. Verify skill file is in the correct location:
   ```bash
   cat ~/.claude/skills/sequential-thinking-test/SKILL.md | head -3
   ```
3. Check name field:
   ```yaml
   ---
   name: sequential-thinking-test # Must be exact
   ---
   ```

### "MCP tool is still being called"

Explicitly mention the skill name:

```
"Use sequential-thinking-test skill to ..."
```

### "TodoWrite items look strange"

Ensure you have the latest SKILL.md:

```bash
cd /path/to/sequential_thinking_skill
cp SKILL.md ~/.claude/skills/sequential-thinking-test/
```

## 🎉 Success?

Now try these:

1. Auto-activation test (after disabling MCP server)
2. Test with complex real-world problems
3. Run integration test script: `npm run test:integration`

---

**Questions or Issues?**

- Report at [GitHub Issues](https://github.com/zerodice0/claude_sequential_thinking_skill/issues)
- See [Full Testing Guide](test/SKILL_TEST_GUIDE.md)
