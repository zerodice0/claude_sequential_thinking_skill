# Example: Systematic Debugging

> English | **[한국어](debugging-scenario-kr.md)**

Example demonstrating how to apply sequential thinking to systematic debugging. This is the same scenario as Example 2 in SKILL.md.

## Problem Statement

**Situation**: Intermittent 500 errors occurring in production

**Symptoms**:

- Error frequency: 10-20 occurrences per day
- Occurrence time: Mainly 2-4 PM
- Impact: Specific API (`/api/users/profile`)
- Error message: "Database connection timeout"

**Question**: "How should we debug and resolve this?"

---

## Sequential Thinking Process

```
💭 Thought 1/10: Accurately identifying the problem symptoms

**Error log analysis:**
```

[2025-01-15 14:23:41] ERROR: Database connection timeout
at pg.connect (postgres.js:142)
at UserController.getProfile (user.controller.js:45)
Request ID: req-abc123
User ID: 789456
Duration: 30050ms (timeout at 30s)

````

**Observed patterns:**
- Time period: 14:00-16:00 (peak time)
- Specific endpoint: GET /api/users/profile
- Consistent error: connection timeout
- Timeout duration: Exactly 30 seconds
- Some succeed on retry

**Additional data needed:**
- Database connection pool status
- Traffic patterns during that time
- Slow query logs
- System resource usage

---

🔍 Thought 2/10: Collecting relevant metrics and logs

**Database Connection Pool:**
- Max connections: 100
- Active connections during peak: 85-98
- Waiting requests: Up to 15
- Average connection usage time: 50ms
- Some connections during peak: 2000-3000ms

**Traffic Patterns:**
- Normal: 50 req/s
- 14:00-16:00: 150 req/s (3x)
- Especially /api/users/profile: 30 req/s

**Slow Query Logs:**
```sql
-- Query time: 2847ms
SELECT u.*, p.*, r.*
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN relationships r ON u.id = r.user_id
WHERE u.id = $1;
````

**Explain Analyze Results:**

- Full table scan on relationships table
- Missing index found!

---

💭 Thought 3/10: Formulating hypotheses

**Hypothesis List:**

**Hypothesis 1: Insufficient Connection Pool**

- Evidence: 95% usage during peak
- Mechanism: New requests wait for connection → timeout

**Hypothesis 2: Slow Queries Occupying Connections**

- Evidence: Some queries take 2-3 seconds
- Mechanism: Slow queries occupy connections longer → pool exhaustion

**Hypothesis 3: Database Performance Issues**

- Evidence: Only occurs during specific time periods
- Mechanism: DB resource shortage

**Hypothesis 4: Connection Leak**

- Evidence: Some connection usage times very long
- Mechanism: Unreturned connections accumulate

**Assessment:** Hypotheses 1 and 2 most likely
→ Verify each as a branch

---

🌿 [Branch: hypothesis-pool] Thought 4a/10: Verifying insufficient connection pool hypothesis

**Verification Method:**

1. Temporarily increase pool size (100 → 200)
2. Monitor during peak time
3. Observe error rate changes

**Test Results (Staging):**

- Pool 100: 1.2% error rate
- Pool 150: 0.8% error rate
- Pool 200: 0.5% error rate

**Interpretation:**

- Increasing pool reduces errors
- But doesn't completely solve it
- Root cause is elsewhere

**Conclusion:** Partial cause, not main cause

---

🌿 [Branch: hypothesis-query] Thought 4b/10: Verifying slow query hypothesis

**Problem Query Analysis:**

```sql
-- Current query
SELECT u.*, p.*, r.*
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN relationships r ON u.id = r.user_id
WHERE u.id = $1;

-- Explain: Seq Scan on relationships (cost=0..15892)
```

**Index Check:**

```sql
-- Existing indexes
users: PRIMARY KEY (id)
profiles: PRIMARY KEY (id), INDEX (user_id)
relationships: PRIMARY KEY (id)  -- No user_id index!
```

**Missing Index:**

```sql
CREATE INDEX idx_relationships_user_id
ON relationships(user_id);
```

**Test (Staging):**

- Before index: Average 2500ms
- After index: Average 45ms (98% improvement!)

**Connection Pool Impact:**

- Fast query → Fast connection return
- Pool usage: 95% → 65%
- Waiting queue: 15 → 0

**Conclusion:** This is the main cause!

---

💡 Thought 5/10: Key finding - Compound cause and chain effect

**Root Cause Chain:**

```
Missing index on relationships
    ↓
Slow queries (2-3 seconds)
    ↓
Long connection occupation
    ↓
Pool exhaustion during peak
    ↓
New requests wait
    ↓
30-second timeout occurs
    ↓
500 Error
```

**Integrated Understanding:**

- Not single cause but compound causes
- Fine during normal time (low traffic)
- Problem explodes during peak (3x traffic)

**Impact Calculation:**

- Add index: 98% faster query
- Fast connection return: 30% reduction in pool usage
- Remove waiting queue: Prevent timeouts

---

💭 Thought 6/10: Prioritizing solutions

**Immediate (Urgent, Today):**

1. ✅ Add index
   - `CREATE INDEX idx_relationships_user_id ON relationships(user_id)`
   - Impact: 98% query improvement
   - Risk: Low (read index)
   - Time: 5 minutes

2. ✅ Adjust connection timeout
   - Current: 30 seconds
   - Change: 10 seconds
   - Reason: Fast fail gives retry opportunity
   - Risk: Low

**Short-term (This Week):** 3. ✅ Increase connection pool

- 100 → 150
- Provide buffer
- Risk: Need to monitor DB load

4. ✅ Query optimization
   - Remove unnecessary JOINs
   - SELECT only needed columns
   - Prevent N+1 queries

**Long-term (This Month):** 5. ✅ Strengthen monitoring

- Slow query alerts
- Connection pool dashboard
- Consider auto-scaling

6. ✅ Introduce caching
   - Cache profiles with Redis
   - Target cache hit rate: 80%
   - Reduce DB load

---

✅ Thought 10/10 [Complete]: Execution plan and verification method

**Immediate Actions (Today)**

**Step 1: Add index (14:00 deployment)**

```sql
-- Deploy to production
CREATE INDEX CONCURRENTLY idx_relationships_user_id
ON relationships(user_id);
-- CONCURRENTLY prevents locks
-- Expected time: 2-3 minutes
```

**Step 2: Adjust timeout (14:05 deployment)**

```javascript
// Before
pool: {
  connectionTimeoutMillis: 30000;
}

// After
pool: {
  connectionTimeoutMillis: 10000;
}
```

**Step 3: Monitoring (14:10)**

- Real-time error rate tracking
- Connection pool usage
- Query response time

**Verification Metrics (After 24 hours):**

**Before (baseline):**

- Error occurrences: 10-20/day
- Average response time: 450ms
- P95 response time: 2800ms
- Connection pool usage: 95%

**After (target):**

- ✅ Error occurrences: < 1/day (95% reduction)
- ✅ Average response time: < 200ms (56% improvement)
- ✅ P95 response time: < 500ms (82% improvement)
- ✅ Connection pool usage: < 70% (26% reduction)

**Rollback Plan:**

- If index issues: `DROP INDEX idx_relationships_user_id`
- If timeout issues: Restore original value
- Can rollback immediately (< 1 minute)

**Long-term Improvements (Week 1-4):**

**Week 1:**

- [ ] Increase connection pool to 150
- [ ] Set slow query alert (>500ms)

**Week 2:**

- [ ] Rewrite profile query (remove N+1)
- [ ] Remove unnecessary JOINs

**Week 3:**

- [ ] Implement Redis caching
- [ ] Cache warming strategy

**Week 4:**

- [ ] Performance benchmark
- [ ] Documentation and team sharing

**Post-mortem:**

- Root cause: Missing index
- Lesson: Importance of initial schema design
- Prevention: Auto-create indexes on all FKs rule
- Improvement: DB schema review process

---

## Results

### Resolution Results (After 24 hours)

**Actual Metrics:**

- 0 errors (Goal achieved!)
- Average response time: 180ms
- P95 response time: 420ms
- Connection pool: 62% usage

**Business Impact:**

- Improved user experience
- Eliminated customer complaints
- Increased system reliability

---

## Key Learnings

### Importance of Systematic Debugging

**Without Sequential Thinking:**

```
"Connection timeout error?"
→ "Need to increase pool size"
→ Increase pool to 200
→ Errors still occur
→ Frustration...
```

**With Sequential Thinking:**

```
1. Accurately identify symptoms
2. Collect data
3. Formulate hypotheses
4. Verify each hypothesis with branches
5. Find root cause
6. Prioritize solutions
7. Verify and monitor
```

### Effect of Branching

Independently verified two hypotheses:

- Hypothesis 1 (pool): Partial cause
- Hypothesis 2 (query): Main cause

If done sequentially:

- Would have only increased pool
- Would have missed root cause

### Recognizing Compound Causes

Not single cause but chain:

1. Missing index
2. Slow queries
3. Connection occupation
4. Pool exhaustion
5. Timeout

---

## Debugging Pattern

Pattern used in this example:

```
1. Symptom → Accurately identify symptoms
2. Data Collection → Collect metrics/logs
3. Hypothesis → Possible causes
4. Branch Testing → Verify each hypothesis
5. Root Cause → Identify root cause
6. Prioritize → Prioritize solutions
7. Execute → Execute and verify
8. Monitor → Continuous monitoring
9. Document → Document learnings
10. Prevent → Prevent recurrence
```

---

## Exercise

Apply this to the following debugging scenario:

**Problem**: "Service slows down every day at 3 AM. CPU usage reaches 100%."

**Hints**:

1. Accurately identify symptoms
2. Investigate what runs at 3 AM
3. Formulate hypotheses (scheduled jobs? batch processing? backup?)
4. Verify each hypothesis with branches
5. Root cause and solution
