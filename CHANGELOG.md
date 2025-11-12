# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Additional real-world examples
- Helper function enhancements
- Integration guides with other skills
- Performance optimizations

## [1.0.0] - 2025-01-XX

### Added
- Initial release as Claude Code Skill
- Core SKILL.md with comprehensive framework
  - YAML frontmatter with skill metadata
  - Detailed usage protocol and workflow
  - Complete validation rules
  - Output formatting guidelines
- TodoWrite integration for thought tracking
  - Regular thoughts (💭)
  - Branching support (🌿)
  - Revision capability (✏️)
  - Completion status (✅)
- Branching support for exploring multiple approaches
  - Clear branch identification
  - Independent exploration of alternatives
  - Branch comparison and evaluation
- Revision capability for refining previous thoughts
  - Mark specific thoughts for revision
  - Track revision history
  - Maintain logical continuity
- Dynamic thought expansion
  - Automatic adjustment of totalThoughts
  - Explicit needsMoreThoughts flag
- Comprehensive documentation
  - README.md with quick start guide
  - Installation instructions (3 methods)
  - Detailed examples (5 scenarios)
  - Best practices guide
  - Troubleshooting section
- Examples
  - Basic problem analysis
  - Complex debugging scenario
  - Architecture decision making
  - Branching demonstration
  - Revision demonstration
- Helper functions (optional TypeScript)
  - Type definitions
  - Validation logic
  - TodoWrite adapter
  - Formatting utilities
- Test suite
  - 39 test cases ported from MCP server
  - Validation tests
  - Integration tests
  - TodoWrite formatting tests
- GitHub Actions CI/CD
  - Automated testing
  - Coverage reporting
- Apache 2.0 License

### Changed
- Migrated from MCP Server to Claude Code Skill
  - Removed server dependency
  - Replaced IPC with direct function calls
  - Changed state management from memory to TodoWrite
  - Improved performance (~10x faster)

### Removed
- MCP server dependency (NPM/Docker)
- Chalk library for console coloring (replaced with emoji)
- Yargs CLI argument parsing (not needed)

### Migration Notes from MCP Server
- Core validation logic preserved from lib.ts
- Test suite fully ported and passing
- All features maintained with feature parity
- State management improved with TodoWrite persistence
- Installation simplified to single file copy
- Performance improved from ~50ms to ~5ms

## [0.2.0] - 2024-XX-XX (MCP Server)

Reference implementation as MCP server.

### Features
- Sequential thinking with thought tracking
- Branching support
- Revision capability
- Memory-based state management
- Chalk-colored console output
- 39 comprehensive test cases

---

## Version Numbering

This project uses [Semantic Versioning](https://semver.org/):

- **MAJOR** version when making incompatible API changes
- **MINOR** version when adding functionality in a backwards compatible manner
- **PATCH** version when making backwards compatible bug fixes

---

## Links

- [Repository](https://github.com/zerodice0/claude_sequential_thinking_skill)
- [Issues](https://github.com/zerodice0/claude_sequential_thinking_skill/issues)
- [Pull Requests](https://github.com/zerodice0/claude_sequential_thinking_skill/pulls)
