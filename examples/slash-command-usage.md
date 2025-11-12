# Slash Command Usage Examples

> English | **[한국어](slash-command-usage-kr.md)**

This guide demonstrates how to use the `/think` and `/analyze` commands effectively.

---

## `/think` Command

Use `/think` for complex problems requiring deep analysis, branching, and revision.

### Example 1: Architecture Design

```bash
/think How should I design a scalable e-commerce platform with microservices?
```

**Expected Output:**
```
💭 Thought 1/8: Define core business requirements and constraints
💭 Thought 2/8: Identify key microservices (catalog, cart, orders, payment)
🌿 [Branch: sync-pattern] Thought 3a/10: Synchronous communication approach
🌿 [Branch: async-pattern] Thought 3b/10: Event-driven architecture approach
💭 Thought 4/10: Evaluate both patterns against scalability needs
✏️ [Revision of #4] Thought 4'/10: Hybrid approach with async for orders
💭 Thought 5/10: Data consistency strategy
...
✅ Thought 10/10 [Complete]: Final architecture recommendation
```

### Example 2: Complex Debugging

```bash
/think Why is our authentication API experiencing intermittent 500 errors in production?
```

**Expected Output:**
```
💭 Thought 1/7: Gather information about error patterns
💭 Thought 2/7: Analyze error logs and timing
🌿 [Branch: db-connection] Thought 3a/9: Database connection pool exhaustion
🌿 [Branch: race-condition] Thought 3b/9: Race condition in token validation
💭 Thought 4/9: Test hypotheses with monitoring data
✏️ [Revision of #3a] Thought 3a'/9: Not just pool size, connection leak detected
...
✅ Thought 9/9 [Complete]: Root cause identified and fix recommended
```

### Example 3: Technology Decision

```bash
/think Should we use PostgreSQL or MongoDB for our analytics platform?
```

**Expected Output:**
```
💭 Thought 1/6: Define data characteristics and access patterns
💭 Thought 2/6: Identify key requirements (queries, scale, consistency)
🌿 [Branch: postgres] Thought 3a/8: PostgreSQL strengths and limitations
🌿 [Branch: mongodb] Thought 3b/8: MongoDB strengths and limitations
💭 Thought 4/8: Compare performance for our specific use case
💭 Thought 5/8: Consider team expertise and operational overhead
✅ Thought 8/8 [Complete]: Recommendation with justification
```

---

## `/analyze` Command

Use `/analyze` for quicker systematic analysis without deep branching.

### Example 1: Performance Analysis

```bash
/analyze performance bottleneck in user dashboard loading
```

**Expected Output:**
```
💭 Thought 1/5: Measure current performance metrics
💭 Thought 2/5: Identify main bottlenecks (DB queries, API calls, rendering)
💭 Thought 3/5: Prioritize improvements by impact
💭 Thought 4/5: Recommend optimization strategies
✅ Thought 5/5 [Complete]: Action plan with expected improvements
```

### Example 2: Code Review

```bash
/analyze code quality issues in the payment processing module
```

**Expected Output:**
```
💭 Thought 1/4: Review code structure and patterns
💭 Thought 2/4: Identify issues (error handling, validation, security)
💭 Thought 3/4: Assess severity and priority
✅ Thought 4/4 [Complete]: Prioritized improvement recommendations
```

### Example 3: Quick Comparison

```bash
/analyze pros and cons of React vs Vue for our dashboard
```

**Expected Output:**
```
💭 Thought 1/5: List key comparison criteria
💭 Thought 2/5: React advantages and disadvantages
💭 Thought 3/5: Vue advantages and disadvantages
💭 Thought 4/5: Apply to our specific context
✅ Thought 5/5 [Complete]: Recommendation based on team and project needs
```

---

## When to Use Which Command

### Use `/think` when:
- ✅ Problem is complex and multi-faceted
- ✅ Need to explore multiple approaches (branching)
- ✅ Might need to revise thinking based on new insights
- ✅ Requires 6+ thinking steps
- ✅ Deep analysis and comprehensive solution needed

### Use `/analyze` when:
- ✅ Need quick systematic breakdown
- ✅ Problem is moderately complex (3-5 steps)
- ✅ Single clear path of analysis
- ✅ Time-sensitive decision support
- ✅ Straightforward comparison or evaluation

---

## Tips for Effective Usage

### 1. Be Specific
❌ `/think improve performance`
✅ `/think how to reduce API response time from 800ms to <200ms`

### 2. Provide Context
❌ `/analyze database options`
✅ `/analyze PostgreSQL vs MongoDB for time-series IoT data with 1M writes/day`

### 3. State Your Constraints
✅ `/think design a caching strategy (budget: $200/month, <10ms latency)`

### 4. Combine with Other Tools
```bash
# First analyze the problem
/analyze root cause of memory leak in worker service

# Then implement the solution
[Based on analysis, implement the fix]

# Finally verify
/analyze effectiveness of the implemented fix
```

---

## Advanced Patterns

### Pattern 1: Multi-Stage Problem Solving

```bash
# Stage 1: Understand the problem
/analyze current system architecture and bottlenecks

# Stage 2: Design solution
/think how to refactor for 10x scale with zero downtime

# Stage 3: Validate approach
/analyze risks and mitigation strategies for proposed refactoring
```

### Pattern 2: Decision Making with Evidence

```bash
# Gather evidence first
[Use tools to collect metrics, logs, etc.]

# Then analyze with context
/think Given [metrics], should we scale vertically or horizontally?
```

### Pattern 3: Iterative Refinement

```bash
# Initial thinking
/think design authentication system

# Refine based on feedback
/think refine authentication design considering [new security requirements]
```

---

## Troubleshooting

### Issue: Too Many Branching Paths

**Solution**: Use `/analyze` for initial filtering, then `/think` for deep dive
```bash
/analyze compare 5 authentication providers
# Output: Top 2 candidates identified

/think detailed evaluation of Auth0 vs Firebase Auth for our use case
```

### Issue: Thinking Process Too Long

**Solution**: Break into smaller problems
```bash
# Instead of:
/think design entire microservices platform

# Do:
/analyze identify core microservices needed
/think design service communication patterns
/think design data consistency strategy
```

### Issue: Need Quick Answer

**Solution**: Use `/analyze` instead of `/think`
```bash
# Fast decision needed:
/analyze should we use REST or GraphQL for this API
```

---

## Summary

| Command | Depth | Speed | Branching | Best For |
|---------|-------|-------|-----------|----------|
| `/think` | Deep | Slower | ✅ Yes | Complex problems, architecture, major decisions |
| `/analyze` | Moderate | Faster | ❌ Limited | Quick analysis, comparisons, straightforward problems |

Choose the command that matches your problem complexity and time constraints.
