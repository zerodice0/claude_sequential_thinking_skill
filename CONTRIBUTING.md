# Contributing to Sequential Thinking Skill

Thank you for your interest in contributing to Sequential Thinking Skill! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

### 1. 🐛 Reporting Bugs

Found a bug? Please create an issue with:

**Bug Report Template**:
```
**Describe the bug**
A clear and concise description of the bug.

**To Reproduce**
Steps to reproduce the behavior:
1. Use skill with '...'
2. Input '...'
3. See error

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened.

**Environment**
- Claude Code version:
- Skill version:
- OS:

**Additional context**
Any other relevant information.
```

### 2. 💡 Suggesting Enhancements

Have an idea for improvement? Create an issue with:

**Enhancement Template**:
```
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Any other relevant information, mockups, or examples.
```

### 3. 📝 Improving Documentation

Documentation improvements are always welcome:
- Fix typos or unclear explanations
- Add more examples
- Improve existing examples
- Translate documentation (future)

### 4. 🔧 Contributing Code

Code contributions include:
- Bug fixes
- New features
- Helper function improvements
- Test additions
- Performance optimizations

---

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js 18+ (for helper development)
node --version

# Git
git --version

# npm (comes with Node.js)
npm --version
```

### Development Setup

1. **Fork the repository**
   - Click "Fork" on GitHub
   - Clone your fork locally

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/claude_sequential_thinking_skill.git
   cd claude_sequential_thinking_skill
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/zerodice0/claude_sequential_thinking_skill.git
   ```

4. **Install dependencies** (if working with helpers):
   ```bash
   npm install
   ```

5. **Create a branch**:
   ```bash
   git checkout -b feature/my-amazing-feature
   ```

---

## 📋 Development Workflow

### Working on SKILL.md

The core skill definition in `SKILL.md`:

1. **Make changes**:
   - Edit `SKILL.md` with your improvements
   - Follow existing structure and formatting
   - Maintain consistency with examples

2. **Test locally**:
   ```bash
   # Copy to Claude skills directory
   cp SKILL.md ~/.claude/skills/sequential-thinking/

   # Test with Claude Code
   # Try various scenarios to ensure it works
   ```

3. **Verify**:
   - Test with simple problems
   - Test with branching
   - Test with revisions
   - Check TodoWrite integration

### Working on Helper Functions

TypeScript helper functions in `helpers/`:

1. **Make changes**:
   ```bash
   # Edit files in helpers/
   vim helpers/sequential-thinking.ts
   ```

2. **Run tests**:
   ```bash
   npm test
   ```

3. **Check coverage**:
   ```bash
   npm run coverage
   ```

4. **Lint code**:
   ```bash
   npm run lint
   ```

### Adding Examples

New examples in `examples/`:

1. **Create example file**:
   ```bash
   touch examples/my-new-example.md
   ```

2. **Follow template**:
   ```markdown
   # Example: [Title]

   ## Problem
   [Clear problem statement]

   ## Sequential Thinking Application
   [Step-by-step thought process]

   ## Results
   [Outcomes and insights]

   ## Key Learnings
   [What this example demonstrates]
   ```

3. **Reference in README**:
   - Add link to examples section
   - Include brief description

### Improving Documentation

Documentation in `docs/`:

1. **Edit documentation**:
   ```bash
   vim docs/user-guide.md
   ```

2. **Check links**:
   - Verify all internal links work
   - Ensure examples are up-to-date

3. **Test clarity**:
   - Can a new user understand it?
   - Are there enough examples?

---

## ✅ Pull Request Process

### Before Submitting

- [ ] Code compiles without errors
- [ ] Tests pass: `npm test`
- [ ] Lint checks pass: `npm run lint`
- [ ] Documentation updated if needed
- [ ] CHANGELOG.md updated
- [ ] Examples work with Claude Code
- [ ] Commit messages are clear and descriptive

### Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

**Format**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semi-colons, etc)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```bash
# Feature
git commit -m "feat(skill): add support for nested branching"

# Bug fix
git commit -m "fix(validation): handle edge case for thoughtNumber > totalThoughts"

# Documentation
git commit -m "docs(examples): add complex debugging scenario"

# Test
git commit -m "test(helpers): add unit tests for revision logic"
```

### Submitting Pull Request

1. **Push to your fork**:
   ```bash
   git push origin feature/my-amazing-feature
   ```

2. **Create Pull Request**:
   - Go to GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out PR template

3. **PR Description Template**:
   ```markdown
   ## Description
   [Clear description of changes]

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement
   - [ ] Refactoring

   ## Testing
   - [ ] Tested with Claude Code
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Examples verified

   ## Related Issues
   Fixes #(issue number)

   ## Screenshots (if applicable)
   [Add screenshots or examples]

   ## Checklist
   - [ ] Code follows project style
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] CHANGELOG.md updated
   - [ ] No breaking changes (or documented)
   ```

4. **Wait for review**:
   - Maintainers will review your PR
   - Address feedback if requested
   - Be responsive to comments

5. **After approval**:
   - PR will be merged
   - Your contribution will be recognized!

---

## 🎨 Code Style Guidelines

### SKILL.md Style

```markdown
# Clear hierarchical headings

## Major sections use H2

### Subsections use H3

- Use bullet points for lists
- Keep paragraphs concise
- Include code examples with proper formatting

**Emphasis** for important points
`code` for inline code
```

### TypeScript Style

```typescript
// Use clear, descriptive names
export interface ThoughtData {
  thought: string;  // Clear field names
  thoughtNumber: number;
}

// Document complex functions
/**
 * Validates thought data structure
 * @param data - ThoughtData to validate
 * @returns ValidationResult with errors
 */
export function validate(data: ThoughtData): ValidationResult {
  // Clear logic with early returns
  if (!data.thought) {
    return { valid: false, errors: ['thought is required'] };
  }

  // ... more validation
}

// Use consistent formatting
// - 2 spaces for indentation
// - Semicolons
// - Single quotes for strings
// - Trailing commas in multi-line
```

### Documentation Style

- **Clear headings**: Use descriptive section titles
- **Short paragraphs**: 3-4 sentences maximum
- **Code examples**: Include working examples
- **Links**: Use relative links for internal docs
- **Images**: Alt text for accessibility
- **Consistent tone**: Professional but friendly

---

## 🧪 Testing Guidelines

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { SequentialThinkingHelper } from '../helpers/sequential-thinking';

describe('SequentialThinkingHelper', () => {
  describe('validate', () => {
    it('should require thought field', () => {
      const helper = new SequentialThinkingHelper();
      const result = helper.validate({} as any);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('thought is required');
    });

    it('should validate thoughtNumber is positive', () => {
      const helper = new SequentialThinkingHelper();
      const result = helper.validate({
        thought: 'test',
        thoughtNumber: -1,
        totalThoughts: 5,
        nextThoughtNeeded: true
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('thoughtNumber must be positive');
    });
  });
});
```

### Test Coverage Goals

- **Core validation**: 100% coverage
- **Helper functions**: >90% coverage
- **Integration**: Key scenarios covered
- **Edge cases**: Known edge cases tested

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run coverage

# Specific file
npm test -- helpers/sequential-thinking.test.ts
```

---

## 📖 Documentation Standards

### Required Documentation

When adding features:
1. **SKILL.md**: Update usage protocol
2. **README.md**: Update features/examples
3. **CHANGELOG.md**: Add entry
4. **examples/**: Add practical example
5. **docs/**: Update relevant guides

### Example Documentation

For new features, provide:
- **What**: Clear description
- **Why**: Use case and benefits
- **How**: Step-by-step instructions
- **Example**: Working code/usage
- **Troubleshooting**: Common issues

---

## 🔍 Code Review Process

### What Reviewers Look For

1. **Functionality**:
   - Does it work as intended?
   - Are there edge cases?
   - Is error handling adequate?

2. **Code Quality**:
   - Is it readable and maintainable?
   - Does it follow project conventions?
   - Is it well-documented?

3. **Tests**:
   - Are tests comprehensive?
   - Do they cover edge cases?
   - Are they maintainable?

4. **Documentation**:
   - Is it clear and accurate?
   - Are examples provided?
   - Is CHANGELOG updated?

### Responding to Feedback

- **Be respectful**: Reviews are about code, not people
- **Ask questions**: If unclear, ask for clarification
- **Explain reasoning**: Share your thought process
- **Be open**: Consider alternative approaches
- **Iterate**: Make requested changes promptly

---

## 🎯 Priority Areas

Current priority areas for contribution:

### High Priority
- 🐛 Bug fixes
- 📖 Documentation improvements
- 🧪 Test coverage improvements
- 📝 More real-world examples

### Medium Priority
- ⚡ Performance optimizations
- 🔧 Helper function enhancements
- 🌐 Integration with other skills
- 📊 Analytics and insights

### Low Priority
- 🎨 Visual improvements
- 🔮 Advanced features
- 🌍 Internationalization
- 📱 Mobile-specific optimizations

---

## 🏆 Recognition

### Contributors

All contributors will be recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes

### Significant Contributions

Major contributions may result in:
- Maintainer status
- Decision-making input
- Feature naming rights

---

## 📞 Getting Help

### Questions?

- 💬 [GitHub Discussions](https://github.com/zerodice0/claude_sequential_thinking_skill/discussions)
- 📧 Email: [create issue instead]
- 💻 [Discord/Slack]: [if available]

### Resources

- [Claude Code Docs](https://docs.claude.com/claude-code)
- [Skills Marketplace](https://github.com/anthropics/skills)
- [Model Context Protocol](https://modelcontextprotocol.io/)

---

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to a positive environment**:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes**:
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of unacceptable behavior may be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

---

## 🙏 Thank You!

Your contributions make Sequential Thinking Skill better for everyone. Whether it's a bug report, feature suggestion, documentation improvement, or code contribution, we appreciate your time and effort!

Happy Contributing! 🚀
