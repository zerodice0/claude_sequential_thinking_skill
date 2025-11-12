# Best Practices

Guidelines for effective use of Sequential Thinking Skill.

## Core Principles

### 1. 명확한 목표 설정

**시작 전에:**
- 해결하려는 문제가 무엇인가?
- 원하는 결과는 무엇인가?
- 성공 기준은 무엇인가?

**Example:**
```
❌ "이 코드를 분석해줘"
✅ "이 코드의 성능 병목을 찾고 개선 방안을 제시해줘"
```

### 2. 적절한 범위 설정

**Too Narrow:**
```
Thought 1/2: 문제 파악
Thought 2/2: 해결책
← 너무 단순함
```

**Too Broad:**
```
Thought 1/30: 시작...
← 너무 복잡함
```

**Just Right:**
```
Thought 1/8: Problem definition
Thought 2/8: Constraint analysis
...
Thought 8/8: Final recommendation
```

---

## Thought Planning

### Estimate Thoughts Realistically

| Complexity | Thoughts | Use Case |
|------------|----------|----------|
| Simple | 3-5 | Basic analysis, single decision |
| Medium | 5-10 | Multi-factor analysis, comparison |
| Complex | 10-15 | Architecture design, debugging |
| Very Complex | 15-20 | System redesign, research |

### Structure Your Thoughts

**Good structure:**
```
1-2: Problem definition and understanding
3-5: Analysis and exploration
6-7: Evaluation and comparison
8: Conclusion and recommendations
```

**Poor structure:**
```
1: Random observation
2: Another random thought
3: Sudden conclusion
```

---

## Branching Best Practices

### When to Branch

✅ **Branch when:**
- 2-3 distinct approaches exist
- Each needs independent evaluation
- Trade-offs are significant

❌ **Don't branch when:**
- Options are very similar
- Sequential analysis is better
- Already have 3+ branches

### Branch Management

**Naming:**
```
✅ Good: "performance-optimized", "security-first", "cost-effective"
❌ Poor: "option1", "branch", "test"
```

**Length:**
```
✅ Good: 3-5 thoughts per branch
❌ Poor: 10+ thoughts per branch
```

**Comparison:**
```
Always include a thought to compare branches:
💭 Thought 8/10: Branch comparison
  - Branch A: Fast but expensive
  - Branch B: Slow but cheap
  - Recommendation: Branch A for production
```

---

## Revision Guidelines

### When to Revise

**Valid reasons:**
- New critical information discovered
- Previous assumption was wrong
- Better approach identified
- Logical error found

**Invalid reasons:**
- Minor wording change
- Adding small details
- Completely different direction

### Revision Pattern

```
✅ Good revision:
💭 Thought 4: Choose MySQL
💭 Thought 5: Design schema
💭 Thought 6: Discover JSON requirements
✏️ Thought 4': PostgreSQL better for JSON
💭 Thought 7: Adjust schema design

❌ Poor revision:
💭 Thought 4: Choose MySQL
✏️ Thought 4': Actually PostgreSQL
✏️ Thought 4'': No wait, MySQL
✏️ Thought 4''': Let me think...
```

---

## Writing Effective Thoughts

### Be Specific

**Vague:**
```
💭 Thought 3/8: Think about the database
```

**Specific:**
```
💭 Thought 3/8: Database selection - comparing PostgreSQL vs MySQL
  Factors: JSON support, performance, cost
  Requirements: Handle 10K writes/second, JSONB queries
```

### Show Your Reasoning

**Weak:**
```
💭 Thought 5/8: Use Redis
```

**Strong:**
```
💭 Thought 5/8: Add Redis caching layer
  Rationale: 80% read traffic, 20% write
  Expected: 5x performance improvement
  Trade-off: Added complexity, $50/month cost
```

### Link to Previous Thoughts

```
💭 Thought 4/8: Based on Thought 2's constraint analysis,
  budget limits us to $500/month. This eliminates
  the enterprise database option from Thought 3.
```

---

## TodoWrite Optimization

### Minimize Items

**Strategy 1: Reasonable totalThoughts**
```
✅ Start with 5-10 thoughts
❌ Start with 20+ thoughts
```

**Strategy 2: Complete promptly**
```
✅ Mark completed immediately after finishing
❌ Leave many in_progress
```

**Strategy 3: Limit branches**
```
✅ 2-3 branches max
❌ 5+ branches
```

### Clear Descriptions

```
✅ Good: "💭 Thought 3/8: Performance bottleneck analysis"
❌ Poor: "💭 Thought 3/8: Thinking..."
```

---

## Common Patterns

### Pattern: Problem-Solution

```
1. Define problem precisely
2. Identify constraints
3. List possible solutions
4. Evaluate each solution
5. Recommend best solution
```

### Pattern: Comparison

```
1. Define criteria
2. Branch: Option A evaluation
3. Branch: Option B evaluation
4. Branch: Option C evaluation
5. Compare all options
6. Make recommendation
```

### Pattern: Investigation

```
1. Describe symptoms
2. Gather data
3. Form hypotheses (branch)
4. Test hypotheses
5. Identify cause
6. Propose solution
```

### Pattern: Design

```
1. Requirements gathering
2. Constraint identification
3. Design exploration (branch if needed)
4. Trade-off analysis
5. Final design
6. Implementation plan
```

---

## Anti-Patterns to Avoid

### 🚫 Over-Engineering

```
❌ Problem: Simple question
    Response: 20 thoughts with 5 branches

✅ Better: 5 focused thoughts
```

### 🚫 Analysis Paralysis

```
❌ Thought 15/30: Still analyzing...
    Never reaching conclusion

✅ Better: Set thought limit, make decision
```

### 🚫 Losing Focus

```
❌ Thought 1: Solve database issue
    Thought 5: Now discussing UI design
    Thought 8: Talking about deployment

✅ Better: Stay focused on original problem
```

### 🚫 Excessive Revision

```
❌ Revising same thought 3-4 times

✅ Better: Branch or restart session
```

---

## Quality Checklist

Before completing a thinking session:

- [ ] Original question fully answered?
- [ ] All important factors considered?
- [ ] Trade-offs clearly explained?
- [ ] Recommendation specific and actionable?
- [ ] Reasoning logical and clear?
- [ ] All branches compared (if branched)?
- [ ] TodoWrite items cleaned up?

---

## Performance Tips

### Faster Thinking

1. **Start focused**: Clear problem definition
2. **Estimate well**: Right number of thoughts
3. **Stay on track**: Don't deviate
4. **Decide promptly**: Don't over-analyze

### Better Quality

1. **Be specific**: Concrete details
2. **Show reasoning**: Why, not just what
3. **Consider alternatives**: Branches when appropriate
4. **Summarize**: Checkpoints for complex problems

---

## Domain-Specific Tips

### For Code Review

```
1. Understand requirements
2. Analyze architecture
3. Identify issues (branch by category)
4. Prioritize fixes
5. Recommend improvements
```

### For Architecture Design

```
1. Gather requirements
2. Identify constraints
3. Propose options (branch)
4. Evaluate each option
5. Compare and recommend
6. Implementation roadmap
```

### For Debugging

```
1. Reproduce issue
2. Gather data
3. Form hypotheses (branch)
4. Test each hypothesis
5. Identify root cause
6. Fix and verify
```

---

## Integration with Other Tools

### With Code Analysis

```
Sequential Thinking for:
- Understanding complex code flows
- Identifying refactoring opportunities
- Planning large changes
```

### With Testing

```
Sequential Thinking for:
- Test strategy development
- Coverage analysis
- Test case prioritization
```

### With Documentation

```
Sequential Thinking for:
- Organizing documentation structure
- Explaining complex concepts
- Creating tutorials
```

---

## Measuring Success

### Good Session Indicators

- ✅ Clear, actionable conclusion
- ✅ Logical thought progression
- ✅ Appropriate depth
- ✅ All key factors considered
- ✅ Trade-offs explained

### Improvement Needed

- ❌ Vague conclusion
- ❌ Jumping around randomly
- ❌ Too shallow or too deep
- ❌ Missing important factors
- ❌ No trade-off analysis

---

## Learn More

- 📖 [User Guide](user-guide.md)
- 📋 [Examples](../examples/)
- 🤝 [Contributing](../CONTRIBUTING.md)
