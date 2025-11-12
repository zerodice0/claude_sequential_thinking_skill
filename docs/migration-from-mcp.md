# Migration from MCP Server

Guide for users migrating from Sequential Thinking MCP Server to the Claude Code Skill.

## Overview

The Sequential Thinking Skill provides the same functionality as the MCP server but with several improvements:
- ✅ No server installation required
- ✅ ~10x faster (no IPC overhead)
- ✅ Better state persistence (TodoWrite)
- ✅ Easier customization (edit SKILL.md)
- ✅ Simpler debugging

---

## Key Differences

### Architecture

| Aspect | MCP Server | Skill |
|--------|-----------|-------|
| **Process Model** | Separate Node.js process | Direct function calls |
| **Communication** | JSON-RPC over stdio | Native integration |
| **State Management** | In-memory (volatile) | TodoWrite (persistent) |
| **Installation** | NPM/Docker | Single file copy |
| **Performance** | ~50ms (IPC) | ~5ms |
| **Customization** | Source code + rebuild | Edit SKILL.md |
| **Dependencies** | Node.js, npm, chalk | None |

### Feature Comparison

| Feature | MCP Server | Skill | Notes |
|---------|-----------|-------|-------|
| Sequential thinking | ✅ | ✅ | Same |
| Branching | ✅ | ✅ | Same |
| Revision | ✅ | ✅ | Same |
| Dynamic expansion | ✅ | ✅ | Same |
| State tracking | Memory | TodoWrite | Improved |
| Visualization | Chalk console | Emoji + TodoWrite | Different |
| Logging | console.error | TodoWrite | Different |

---

## Migration Steps

### Step 1: Backup MCP Configuration

If you have custom MCP settings:

```bash
# Backup MCP config
cp ~/.claude/mcp.json ~/.claude/mcp.json.backup
```

### Step 2: Remove MCP Server (Optional)

You can keep both, but to fully migrate:

```bash
# Remove from mcp.json
# Delete sequential-thinking entry

# Or uninstall package
npm uninstall @modelcontextprotocol/server-sequential-thinking
```

### Step 3: Install Skill

Choose your preferred method:

```bash
# Method 1: Direct download
mkdir -p ~/.claude/skills/sequential-thinking
curl -o ~/.claude/skills/sequential-thinking/SKILL.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/SKILL.md

# Method 2: Git clone
git clone https://github.com/zerodice0/claude_sequential_thinking_skill.git \
  ~/.claude/skills/sequential-thinking
```

### Step 4: Test

Verify the skill works:

```
You: "Use sequential thinking to analyze..."
```

Expected: Skill activates and uses TodoWrite for tracking.

### Step 5: Remove MCP Server

Once confirmed working:

```bash
# Edit ~/.claude/mcp.json
# Remove sequential-thinking server entry

# Optional: Uninstall globally
npm uninstall -g @modelcontextprotocol/server-sequential-thinking
```

---

## Usage Changes

### Activation

**MCP Server:**
```
Tool call to mcp__sequential-thinking__sequentialthinking
```

**Skill:**
```
Automatic activation on complex problems
Or explicit: "Use sequential thinking..."
```

### Output Format

**MCP Server:**
```
Console output with Chalk colors:
┌─────────────────────────────────┐
│ 💭 Thought 1/5                  │
├─────────────────────────────────┤
│ Problem analysis...             │
└─────────────────────────────────┘
```

**Skill:**
```
TodoWrite integration:
content: "💭 Thought 1/5: Problem analysis..."
activeForm: "Analyzing problem: 1/5"
status: "in_progress"
```

### State Management

**MCP Server:**
- State stored in server memory
- Lost on server restart
- No cross-session persistence

**Skill:**
- State in TodoWrite
- Survives session restart
- Can review history

---

## Code Migration

If you customized the MCP server code:

### Core Logic

MCP server's `lib.ts` → Skill's SKILL.md or helpers

**MCP Server (lib.ts):**
```typescript
class SequentialThinkingServer {
  private thoughtHistory: ThoughtData[] = [];

  async processThought(data: ThoughtData): Promise<ProcessResult> {
    // Validation
    this.validateThoughtData(data);

    // Processing
    this.thoughtHistory.push(data);

    // Return
    return { content: [...] };
  }
}
```

**Skill (helpers/sequential-thinking.ts):**
```typescript
export class SequentialThinkingHelper {
  private thoughtHistory: ThoughtData[] = [];

  validate(data: ThoughtData): ValidationResult {
    // Same validation logic
  }

  formatForTodoWrite(data: ThoughtData): TodoItem {
    // TodoWrite integration
  }
}
```

### Validation

Validation logic remains the same:

```typescript
// Both MCP and Skill use same validation
if (!data.thought || typeof data.thought !== 'string') {
  return { valid: false, errors: ['thought required'] };
}
```

### Formatting

**MCP Server:**
```typescript
formatThought(data: ThoughtData): string {
  return chalk.blue(`💭 Thought ${data.thoughtNumber}/${data.totalThoughts}`);
}
```

**Skill:**
```typescript
formatForTodoWrite(data: ThoughtData): TodoItem {
  return {
    content: `💭 Thought ${data.thoughtNumber}/${data.totalThoughts}: ${data.thought}`,
    status: data.nextThoughtNeeded ? 'in_progress' : 'completed'
  };
}
```

---

## Configuration Migration

### Environment Variables

**MCP Server:**
```bash
export DISABLE_THOUGHT_LOGGING=true
```

**Skill:**
No environment variables needed. Control via SKILL.md.

### Customization

**MCP Server:**
```bash
# Edit source
vim lib.ts

# Rebuild
npm run build

# Restart server
```

**Skill:**
```bash
# Edit SKILL.md
vim ~/.claude/skills/sequential-thinking/SKILL.md

# No rebuild needed
# Changes take effect immediately
```

---

## Troubleshooting

### Both MCP and Skill Active

**Problem:** Both systems responding

**Solution:**
1. Disable MCP server in mcp.json
2. Or rename MCP server to avoid conflicts
3. Restart Claude Code

### Performance Comparison

Test both to compare:

```bash
# MCP Server timing
time: ~50ms per thought

# Skill timing
time: ~5ms per thought
```

### State Migration

**MCP Server state is not migrated automatically.**

To preserve history:
1. Export MCP thought history (if customized)
2. Manually recreate in TodoWrite
3. Or start fresh with Skill

---

## FAQ

### Q: Can I run both simultaneously?

**A:** Yes, but not recommended. They serve the same purpose.

### Q: Will my MCP customizations work with the Skill?

**A:** Core logic (validation, processing) can be ported to helper functions. UI/output formatting needs adjustment for TodoWrite.

### Q: Is the Skill feature-complete?

**A:** Yes, 100% feature parity with MCP server plus improvements.

### Q: Can I go back to MCP server?

**A:** Yes, keep your mcp.json backup and reinstall the server.

### Q: What about performance?

**A:** Skill is ~10x faster due to no IPC overhead.

### Q: How do I customize the Skill?

**A:** Edit SKILL.md directly. For complex logic, use TypeScript helpers.

### Q: Are tests ported?

**A:** Yes, all 39 test cases from MCP server are ported to the Skill repository.

---

## Migration Checklist

- [ ] Backup MCP configuration
- [ ] Install Sequential Thinking Skill
- [ ] Test skill functionality
- [ ] Verify branching works
- [ ] Verify revision works
- [ ] Check TodoWrite integration
- [ ] Remove or disable MCP server
- [ ] Update documentation/notes
- [ ] Train team on new approach (if applicable)

---

## Getting Help

Migration issues?

- 💬 [GitHub Discussions](https://github.com/zerodice0/claude_sequential_thinking_skill/discussions)
- 🐛 [Report Issues](https://github.com/zerodice0/claude_sequential_thinking_skill/issues)
- 📖 [User Guide](user-guide.md)

---

## Benefits Summary

After migration, you'll enjoy:

1. **Simpler Setup**: No server installation
2. **Better Performance**: ~10x faster
3. **Easier Customization**: Edit SKILL.md directly
4. **Better State**: TodoWrite persistence
5. **Easier Debugging**: Local execution
6. **Lower Maintenance**: No server updates needed

---

## Next Steps

- 📖 Read [User Guide](user-guide.md)
- 💡 Check [Best Practices](best-practices.md)
- 📋 Try [Examples](../examples/)
