# User Guide

Complete guide to using Sequential Thinking Skill effectively.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Usage](#basic-usage)
3. [Advanced Features](#advanced-features)
4. [Common Patterns](#common-patterns)
5. [Tips & Tricks](#tips--tricks)

---

## Getting Started

### What is Sequential Thinking?

Sequential Thinking is a structured approach to solving complex problems by:
- Breaking down problems into logical steps
- Exploring multiple approaches through branching
- Refining ideas through revision
- Tracking progress with TodoWrite

### When to Use

✅ **Use Sequential Thinking for:**
- Complex multi-step problems
- Architecture and design decisions
- Systematic debugging
- Comparing multiple options
- Creative problem-solving

❌ **Don't use for:**
- Simple factual questions
- Direct code generation
- Quick lookups
- Single-step tasks

---

## Basic Usage

### Automatic Activation

The skill activates automatically when you:

```
"Analyze this architecture systematically"
"Think through this step by step"
"Help me debug this complex issue"
```

### Explicit Activation

Force activation with:

```
"Use sequential thinking to..."
"Apply sequential thinking framework to..."
```

### Basic Workflow

```
💭 Thought 1/5: Define the problem
💭 Thought 2/5: Identify constraints
💭 Thought 3/5: Explore solutions
💭 Thought 4/5: Evaluate options
✅ Thought 5/5 [Complete]: Final recommendation
```

---

## Advanced Features

### 1. Branching

Explore multiple approaches simultaneously:

```
💭 Thought 1: Problem definition
💭 Thought 2: Two main approaches identified
🌿 [Branch: approach-A] Thought 3a: Performance-focused
🌿 [Branch: approach-B] Thought 3b: Simplicity-focused
💭 Thought 4: Compare and decide
```

**When to branch:**
- 2-3 distinct approaches exist
- Trade-offs need evaluation
- Parallel exploration beneficial

**When not to branch:**
- Only one clear path
- Options are very similar
- Already have 3+ branches

### 2. Revision

Refine previous thoughts with new insights:

```
💭 Thought 3: Choose MySQL database
💭 Thought 4: Design API schema
💭 Thought 5: Discover real-time requirements
✏️ [Revision of #3] Thought 3': PostgreSQL better for real-time
💭 Thought 6: Adjust API design accordingly
```

**When to revise:**
- New information changes conclusion
- Found error in previous reasoning
- Better approach discovered

**When not to revise:**
- Minor wording changes (just continue)
- Completely different direction (new branch)
- Too many revisions (restart session)

### 3. Dynamic Expansion

Adjust thought count as needed:

```
💭 Thought 1/5: Start analysis
💭 Thought 2/5: Realize more depth needed
💭 Thought 3/8: [Expanded from 5 to 8]
...
```

This happens automatically when `thoughtNumber > totalThoughts`.

---

## Common Patterns

### Pattern 1: Problem Analysis

```
1. Define problem clearly
2. Identify constraints and requirements
3. List possible approaches
4. Evaluate each approach
5. Recommend solution
```

### Pattern 2: Debugging

```
1. Describe symptoms accurately
2. Gather relevant data/logs
3. Form hypotheses (use branching)
4. Test each hypothesis
5. Identify root cause
6. Propose solution
7. Verify fix
```

### Pattern 3: Architecture Decision

```
1. State requirements and goals
2. List architecture options
3. Branch: Evaluate each option
   - Option A branch
   - Option B branch
   - Option C branch
4. Compare branches
5. Final recommendation
6. Implementation roadmap
```

### Pattern 4: Design Review

```
1. Understand current design
2. Identify strengths
3. Identify weaknesses
4. Propose improvements
5. Evaluate trade-offs
6. Prioritize changes
```

---

## Tips & Tricks

### Planning Thoughts

**Good planning:**
```
💭 Thought 1/7: Problem analysis
  Goals: Understand requirements
  Constraints: Budget, timeline
  Next: Identify approaches
```

**Poor planning:**
```
💭 Thought 1/3: Let's think about this
```

### Naming Branches

**Good names:**
- `performance-first`
- `security-focused`
- `user-experience`
- `cost-optimized`

**Poor names:**
- `option-1`
- `approach`
- `test`
- `alternative`

### Managing Complexity

**Keep it manageable:**
- 5-10 thoughts for simple problems
- 10-15 for complex problems
- 2-3 branches maximum
- 3-5 thoughts per branch

**Signs of over-complexity:**
- More than 20 total thoughts
- More than 3 active branches
- Multiple revisions of same thought
- Lost track of original question

### Progress Checkpoints

Add intermediate summaries:

```
💭 Thought 5/12: Checkpoint - Progress so far
  ✅ Identified 3 main approaches
  ✅ Evaluated performance implications
  ⏳ Next: Cost analysis
```

### Effective Conclusions

**Good conclusion:**
```
✅ Thought 10/10 [Complete]: Final Recommendations
1. Use PostgreSQL + Redis
2. Phase 1: Basic CRUD (2 weeks)
3. Phase 2: Caching layer (2 weeks)
4. Expected cost: $400/month
5. Monitor: Response times, error rates
```

**Poor conclusion:**
```
✅ Thought 10/10: We should probably use a good database
```

---

## TodoWrite Integration

### Understanding TodoWrite Items

Each thought creates a TodoWrite item:

```
content: "💭 Thought 3/10: Database selection analysis"
activeForm: "Analyzing databases: 3/10"
status: "in_progress"
```

### Status Management

- `in_progress`: Current thought
- `completed`: Finished thoughts
- `pending`: Future thoughts (optional)

### Cleaning Up

TodoWrite items accumulate. Best practices:
- Complete thoughts promptly
- Don't create too many branches
- Use reasonable totalThoughts

---

## Troubleshooting

### Problem: Too Many TodoWrite Items

**Solution:**
- Reduce totalThoughts
- Complete branches before starting new ones
- Use revision instead of new thoughts

### Problem: Lost Track of Original Question

**Solution:**
- Add checkpoint thoughts
- Reference original question
- Restart if needed

### Problem: Branches Too Complex

**Solution:**
- Limit to 2-3 branches
- Keep branches focused
- Merge or abandon branches early

### Problem: Not Making Progress

**Solution:**
- Break down into smaller steps
- Use more specific thought descriptions
- Consider if sequential thinking is right tool

---

## Examples Reference

See detailed examples in:
- [Basic Usage](../examples/basic-usage.md)
- [Branching](../examples/branching-example.md)
- [Revision](../examples/revision-example.md)
- [Complex Problem](../examples/complex-problem.md)
- [Debugging](../examples/debugging-scenario.md)

---

## Next Steps

- 💡 Read [Best Practices](best-practices.md)
- 🔄 Check [Migration Guide](migration-from-mcp.md) (if coming from MCP)
- 🤝 Consider [Contributing](../CONTRIBUTING.md)
