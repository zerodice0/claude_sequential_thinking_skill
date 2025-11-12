---
description: Use sequential thinking skill for complex problem-solving and systematic analysis
---

# Sequential Thinking Command

Activate the sequential thinking skill to systematically analyze complex problems using structured multi-step reasoning.

## Usage

```
/think [problem description]
```

## What It Does

This command activates the `sequential-thinking` skill, which provides:

- 🧠 **Step-by-step reasoning** with TodoWrite tracking
- 🌿 **Branching support** to explore multiple approaches
- ✏️ **Revision capability** to refine previous thoughts
- 📊 **Visual progress** with emojis and structured output
- 🎯 **Dynamic adjustment** of reasoning depth

## When to Use

- Complex problem analysis requiring multiple steps
- Debugging and root cause investigation
- Architecture and design decisions
- Comparing multiple options or approaches
- Strategic decision making
- Creative problem solving with exploration

## Examples

### Basic Usage

```
/think How should I design a scalable microservices architecture for an e-commerce platform?
```

### Debugging

```
/think Investigate why our API has intermittent 500 errors in production
```

### Design Decision

```
/think Compare REST vs GraphQL for our new API, considering team expertise and use cases
```

## Activation

When you run `/think`, Claude will:

1. Load the sequential-thinking skill
2. Initialize the thinking framework
3. Begin structured analysis of your problem
4. Show thought progression with numbered steps
5. Support branching and revision as needed
6. Provide a comprehensive final answer

The skill automatically manages complexity and adjusts the number of thinking steps based on the problem.

---

**Note**: This command automatically loads the `sequential-thinking` skill using the Skill tool.
