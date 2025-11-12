# Installation Guide

Complete installation instructions for Sequential Thinking Skill.

## Prerequisites

- Claude Code installed and configured
- Access to ~/.claude/skills directory
- (Optional) Git for development installation
- (Optional) Node.js 18+ for helper development

---

## Installation Methods

### Method 1: Install Script (Recommended)

**Easiest and most reliable method**

```bash
# Clone repository
git clone https://github.com/zerodice0/claude_sequential_thinking_skill.git
cd claude_sequential_thinking_skill

# Run interactive installer
./install.sh

# Or install directly to global location
./install.sh --global

# Or install to current project only
./install.sh --local
```

**What the script does**:

- ✅ Validates source files
- ✅ Creates necessary directories
- ✅ Copies SKILL.md and slash commands
- ✅ Sets proper permissions
- ✅ Verifies installation
- ✅ Provides usage instructions

**Advantages**:

- ✅ Fully automated process
- ✅ Error handling and validation
- ✅ Interactive or command-line mode
- ✅ Supports both global and local installation
- ✅ Checks for existing installations

**When to use**: For all users, especially beginners. This is the safest and easiest method.

**Installation Locations**:

- Global: `~/.claude/skills/sequential-thinking/` and `~/.claude/commands/sequential-thinking/`
- Local: `./.claude/skills/sequential-thinking/` and `./.claude/commands/sequential-thinking/`

---

### Method 2: Marketplace Installation

**Available after official release**

```bash
# Add anthropics skills marketplace
/plugin marketplace add anthropics/skills

# Install sequential-thinking skill
/plugin install sequential-thinking@anthropic-agent-skills
```

**Advantages**:

- ✅ One-click installation
- ✅ Automatic updates
- ✅ Version management
- ✅ Easy uninstallation

**When to use**: For most users, this is the simplest method.

---

### Method 3: Direct Download

**For immediate use without Git**

```bash
# Create directories
mkdir -p ~/.claude/skills/sequential-thinking
mkdir -p ~/.claude/commands/sequential-thinking

# Download SKILL.md
curl -o ~/.claude/skills/sequential-thinking/SKILL.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/SKILL.md

# Download slash commands
curl -o ~/.claude/commands/sequential-thinking/think.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/.claude/commands/think.md

curl -o ~/.claude/commands/sequential-thinking/analyze.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/.claude/commands/analyze.md
```

**Advantages**:

- ✅ Fast installation
- ✅ No git required
- ✅ Works immediately

**Disadvantages**:

- ❌ Manual updates required
- ❌ No version control
- ❌ Must download multiple files

**When to use**: When you want to try the skill quickly without Git or install script.

---

### Method 4: Git Clone (Development)

**For contributors and developers**

```bash
# Clone repository
git clone https://github.com/zerodice0/claude_sequential_thinking_skill.git \
  ~/.claude/skills/sequential-thinking

# Or via SSH
git clone git@github.com:zerodice0/claude_sequential_thinking_skill.git \
  ~/.claude/skills/sequential-thinking
```

**Advantages**:

- ✅ Easy updates (git pull)
- ✅ Version control
- ✅ Can contribute changes
- ✅ Access to all files

**Disadvantages**:

- ❌ Requires Git
- ❌ More setup

**When to use**: For development, customization, or contribution.

---

## Verification

After installation, verify the skill is available:

### 1. Check File Exists

```bash
# Verify SKILL.md is in place
ls -la ~/.claude/skills/sequential-thinking/SKILL.md
```

Expected output:

```
-rw-r--r--  1 user  staff  45678 Jan 15 10:30 SKILL.md
```

### 2. Test with Claude Code

Start Claude Code and try:

```
You: "Help me analyze this problem step by step"
```

The skill should activate automatically for complex problems.

### 3. Explicit Activation

Test explicit activation:

```
You: "Use sequential thinking to analyze..."
```

---

## Updating

### Marketplace Installation

```bash
# Check for updates
/plugin list

# Update if available
/plugin update sequential-thinking
```

### Direct Download

```bash
# Re-download latest version
curl -o ~/.claude/skills/sequential-thinking/SKILL.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/SKILL.md
```

### Git Clone

```bash
cd ~/.claude/skills/sequential-thinking
git pull origin main
```

---

## Uninstallation

### Using Uninstall Script (Recommended)

```bash
# Interactive uninstallation (detects installations)
./uninstall.sh

# Uninstall from global location
./uninstall.sh --global

# Uninstall from local location
./uninstall.sh --local

# Uninstall from all locations
./uninstall.sh --all
```

The uninstall script:

- ✅ Detects existing installations
- ✅ Shows what will be removed
- ✅ Asks for confirmation
- ✅ Safely removes all files
- ✅ Verifies complete removal

### Marketplace

```bash
/plugin uninstall sequential-thinking
```

### Manual

```bash
# Remove skill and commands directories
rm -rf ~/.claude/skills/sequential-thinking
rm -rf ~/.claude/commands/sequential-thinking

# Or for local installation
rm -rf ./.claude/skills/sequential-thinking
rm -rf ./.claude/commands/sequential-thinking
```

---

## Troubleshooting

### Skill Not Found

**Symptom**: Claude Code doesn't recognize the skill

**Solution**:

1. Check file location:
   ```bash
   ls ~/.claude/skills/sequential-thinking/SKILL.md
   ```
2. Verify file permissions:
   ```bash
   chmod 644 ~/.claude/skills/sequential-thinking/SKILL.md
   ```
3. Restart Claude Code

### Skill Not Activating

**Symptom**: Skill exists but doesn't activate

**Solution**:

1. Try explicit activation: "Use sequential thinking..."
2. Check SKILL.md has correct YAML frontmatter
3. Look for syntax errors in SKILL.md
4. Check Claude Code logs

### Permission Denied

**Symptom**: Cannot write to ~/.claude/skills

**Solution**:

```bash
# Create directory with correct permissions
mkdir -p ~/.claude/skills
chmod 755 ~/.claude/skills
```

### Git Clone Fails

**Symptom**: Git clone returns error

**Solution**:

1. Check internet connection
2. Verify Git is installed: `git --version`
3. Try HTTPS instead of SSH (or vice versa)
4. Check repository URL is correct

---

## Advanced Installation

### Custom Location

If you want to install in a different location:

```bash
# Install to custom location
mkdir -p /custom/path/skills/sequential-thinking
curl -o /custom/path/skills/sequential-thinking/SKILL.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/SKILL.md

# Create symlink
ln -s /custom/path/skills/sequential-thinking \
      ~/.claude/skills/sequential-thinking
```

### Multiple Versions

Install different versions for testing:

```bash
# Main version
mkdir -p ~/.claude/skills/sequential-thinking

# Beta version
mkdir -p ~/.claude/skills/sequential-thinking-beta

# Switch between versions by renaming
mv ~/.claude/skills/sequential-thinking{,-main}
mv ~/.claude/skills/sequential-thinking{-beta,}
```

### With Helper Functions

If you want to use TypeScript helpers:

```bash
# Clone full repository
cd ~/.claude/skills/sequential-thinking
npm install

# Build helpers
npm run build

# Run tests
npm test
```

---

## Platform-Specific Notes

### macOS

```bash
# Standard installation
mkdir -p ~/.claude/skills/sequential-thinking
curl -o ~/.claude/skills/sequential-thinking/SKILL.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/SKILL.md
```

### Linux

```bash
# Same as macOS
mkdir -p ~/.claude/skills/sequential-thinking
curl -o ~/.claude/skills/sequential-thinking/SKILL.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/SKILL.md
```

### Windows (WSL)

```bash
# Use WSL path
mkdir -p ~/.claude/skills/sequential-thinking
curl -o ~/.claude/skills/sequential-thinking/SKILL.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/SKILL.md
```

### Windows (Native)

```powershell
# Use PowerShell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\skills\sequential-thinking"

Invoke-WebRequest -Uri "https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/SKILL.md" `
  -OutFile "$env:USERPROFILE\.claude\skills\sequential-thinking\SKILL.md"
```

---

## Installation Verification

설치 후 반드시 다음 단계를 수행하여 올바르게 설치되었는지 확인하세요:

### ✅ Verification Checklist

**1. 파일 존재 확인**

```bash
# Global 설치의 경우
ls -la ~/.claude/skills/sequential-thinking/SKILL.md
ls -la ~/.claude/commands/sequential-thinking/

# Local 설치의 경우
ls -la ./.claude/skills/sequential-thinking/SKILL.md
ls -la ./.claude/commands/sequential-thinking/
```

**2. Skill 인식 테스트**

Claude Code에서 다음을 시도:

```
"단계적으로 이 문제를 분석해줘"
```

**Expected**: Sequential Thinking 활성화 메시지 표시

**3. Slash Command 테스트**

```
/think
```

**Expected**: 자동완성에 `/think` 표시

**4. 기능 확인**

간단한 문제로 전체 기능 테스트:

```
/think "Should I use REST or GraphQL for my API?"
```

**Expected**:

- 💭 아이콘과 함께 순차적 사고 시작
- TodoWrite 항목 생성
- 체계적인 분석 진행
- ✅ 최종 권장사항 제시

### 🔧 Common Issues

**Skill not found**:

- SKILL.md 파일 위치 확인
- 파일 권한 확인 (`chmod 644`)
- Claude Code 재시작

**Commands not working**:

- `.claude/commands/` 디렉토리 확인
- 명령 파일 권한 확인
- Claude Code 재시작

**설치 문제 해결**:

- [Troubleshooting](#troubleshooting) 섹션 참조
- [User Guide](user-guide.md) 확인
- [GitHub Issues](https://github.com/zerodice0/claude_sequential_thinking_skill/issues) 검색

---

## Next Steps

After successful installation:

1. ⚡ **Quick Start**: [SKILL.md의 5분 시작 가이드](../SKILL.md#-5분-시작-가이드) 참조
2. 📖 **Learn Basics**: [User Guide](user-guide.md)로 기본 사용법 익히기
3. 💡 **Best Practices**: [Best Practices](best-practices.md)로 효과적인 사용 패턴 학습
4. 📋 **Try Examples**: [Examples](../examples/)로 실전 예시 확인
5. 🤝 **Contribute**: [Contributing](../CONTRIBUTING.md) 가이드 참조

---

## Related Documents

### 📚 Documentation

- **[User Guide](user-guide.md)**: 전체 기능 및 사용법 상세 설명
- **[Best Practices](best-practices.md)**: 효과적인 사용 가이드라인
- **[Migration Guide](migration-from-mcp.md)**: MCP 서버에서 마이그레이션

### 📋 Examples

- **[Basic Usage](../examples/basic-usage.md)**: 기본 사용 패턴
- **[Branching Example](../examples/branching-example.md)**: 다중 접근 방식
- **[Complex Problem](../examples/complex-problem.md)**: 복잡한 문제 해결

### 🔗 Resources

- **[Main README](../README.md)**: 프로젝트 개요
- **[Changelog](../CHANGELOG.md)**: 버전 히스토리

---

## Support

Need help?

- 💬 [GitHub Discussions](https://github.com/zerodice0/claude_sequential_thinking_skill/discussions)
- 🐛 [Report Issues](https://github.com/zerodice0/claude_sequential_thinking_skill/issues)
- 📖 [Full Documentation](user-guide.md)
