# Example: Branching for Multiple Approaches

> English | **[한국어](branching-example-kr.md)**

Example demonstrating how to explore multiple approaches simultaneously using the branching feature.

## Problem Statement

**Situation**: Designing a system to process large-scale log data

**Requirements**:
- Process 100GB of log data daily
- Real-time search and analysis required
- Log retention period: 90 days
- Budget: Within $1000/month

**Question**: "Which architecture should we choose?"

---

## Sequential Thinking with Branching

```
💭 Thought 1/10: Problem definition and requirements analysis

Core requirements:
- Data volume: 100GB/day = 3TB/month = 9TB/90 days
- Performance: Real-time indexing and search
- Queries: Log search, aggregation, visualization
- Cost: $1000/month constraint

---

💭 Thought 2/10: Identifying major options

Three main approaches:
1. ELK Stack (Elasticsearch, Logstash, Kibana)
2. Managed Service (AWS CloudWatch, Datadog)
3. ClickHouse (OLAP database)

Creating 3 branches to evaluate each independently

---

🌿 [Branch: elk-stack] Thought 3a/10: ELK Stack approach

**Pros:**
✅ Open source (no licensing costs)
✅ Powerful search capabilities
✅ Rich community and plugins
✅ Complete control

**Cons:**
❌ Operational burden of self-hosting
❌ High resource requirements (RAM, CPU)
❌ Complex setup and tuning
❌ Monitoring and maintenance required

**Cost estimate (AWS basis):**
- EC2 instances: $400/month (m5.xlarge × 3)
- EBS storage: $300/month (9TB × $0.10)
- Total: $700/month + operational time

**Implementation complexity:** High
**Estimated build time:** 4-6 weeks

---

🌿 [Branch: managed-service] Thought 3b/10: Managed Service approach

**Pros:**
✅ Immediately available
✅ Auto-scaling
✅ Minimal management burden
✅ Built-in integrations and dashboards

**Cons:**
❌ High cost
❌ Rapid increase with data volume
❌ Limited customization
❌ Vendor lock-in

**Cost estimate:**
- AWS CloudWatch Logs: $0.50/GB ingestion + $0.03/GB storage
  - Ingestion: $1,500/month (100GB/day)
  - Storage: $270/month (9TB)
  - Total: ~$1,770/month ← Budget exceeded!

- Datadog: Similar or higher

**Implementation complexity:** Low
**Estimated build time:** 1 week

---

🌿 [Branch: clickhouse] Thought 3c/10: ClickHouse OLAP approach

**Pros:**
✅ Column-based DB (optimized for log analysis)
✅ Very fast aggregation queries
✅ High compression ratio (5-10x)
✅ Open source

**Cons:**
❌ Limited full-text search capabilities
❌ Learning curve
❌ Smaller ecosystem than ELK
❌ Self-hosting required

**Cost estimate:**
- EC2: $200/month (m5.large × 2)
- Storage: $90/month (1TB after compression)
- Total: $290/month ← Within budget!

**Implementation complexity:** Medium
**Estimated build time:** 2-3 weeks

---

💭 Thought 4/10: Comparing core trade-offs of each branch

| Criteria | ELK | Managed | ClickHouse |
|----------|-----|---------|------------|
| **Cost** | $700 | $1,770 ❌ | $290 ✅ |
| **Operational burden** | High | Low ✅ | Medium |
| **Search capability** | Best ✅ | Good | Limited |
| **Build time** | 6 weeks | 1 week ✅ | 3 weeks |
| **Scalability** | Good | Best ✅ | Very good |

---

💭 Thought 5/10: Considering actual usage patterns

Log analysis workload breakdown:
- 70%: Time-series aggregation (hourly error counts, etc.)
- 20%: Filtering and grouping
- 10%: Full-text search (finding specific messages)

**Insight:**
- Mostly OLAP-style queries
- Full-text search is supplementary
- Aligns well with ClickHouse's strengths

---

💭 Thought 6/10: Considering hybrid approach

**Idea:** ClickHouse + Elasticsearch Lite

ClickHouse as primary:
- Store and analyze time-series data
- Aggregation and dashboards

Small Elasticsearch cluster:
- Index only last 7 days of logs
- Dedicated to full-text search
- Cost: +$200/month

Total cost: $490/month (within budget)

---

💡 Thought 7/10: Key finding - ClickHouse is optimal

Analysis results:
1. Recommend standalone ClickHouse
2. Reasons:
   - Uses only 30% of budget ($290/$1000)
   - Handles 90% of workload effectively
   - Remaining budget allows adding monitoring tools

3. Full-text search limitation:
   - Compensate with structured logging (JSON field search)
   - Add small-scale Elasticsearch if needed

---

✅ Thought 10/10 [Complete]: Final recommended architecture

**Choice: ClickHouse-based architecture**

### Architecture

```
Log Sources
    ↓
Vector (Log Collector)
    ↓
ClickHouse Cluster (2 nodes)
    ↓
Grafana (Visualization)
```

### Implementation Plan

**Week 1-2:**
- Install ClickHouse cluster
- Design schema
- Configure Vector

**Week 3:**
- Build data collection pipeline
- Write basic queries

**Week 4:**
- Create Grafana dashboards
- Set up alerts
- Performance tuning

### Cost Breakdown

```
ClickHouse (m5.large × 2): $200
Storage (EBS): $90
Vector (included): $0
Grafana Cloud Free: $0
Buffer (20%): $60
---
Total: $350/month (35% of budget)
```

### Success Metrics

- Query response time < 1 second (95 percentile)
- Data latency < 1 minute
- Compression ratio > 5x
- Availability > 99.9%

---

## Key Learnings

### Benefits of using branches

1. **Parallel evaluation**: Deep analysis of three options simultaneously
2. **Bias prevention**: Fair opportunity for each option
3. **Clear comparison**: Structured comparison table generation
4. **Optimal choice**: Data-driven decision making

### Importance of branch naming

- `elk-stack`, `managed-service`, `clickhouse`
- Clear IDs allow immediate understanding of each branch's purpose

### Necessity of comparison phase

Explicit comparison in Thought 4 was decisive:
- All branch results at a glance
- Trade-offs clearly revealed
- Objective selection possible

---

## Exercise

Apply branching to this scenario:

**Problem**: "We need to choose a CI/CD tool. Which is better: Jenkins, GitLab CI, or GitHub Actions?"

**Hints**:
1. Create a branch for each tool
2. Evaluate using same criteria (cost, features, maintenance)
3. Consider team situation
4. Create comparison table
5. Make final recommendation
