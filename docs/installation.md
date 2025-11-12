# Installation Guide

Complete installation instructions for Sequential Thinking Skill.

## Prerequisites

- Claude Code installed and configured
- Access to ~/.claude/skills directory
- (Optional) Git for development installation
- (Optional) Node.js 18+ for helper development

---

## Installation Methods

### Method 1: Marketplace Installation (Recommended)

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

### Method 2: Direct Download

**For immediate use**

```bash
# Create skills directory
mkdir -p ~/.claude/skills/sequential-thinking

# Download SKILL.md
curl -o ~/.claude/skills/sequential-thinking/SKILL.md \
  https://raw.githubusercontent.com/zerodice0/claude_sequential_thinking_skill/main/SKILL.md
```

**Advantages**:
- ✅ Fast installation
- ✅ No git required
- ✅ Works immediately

**Disadvantages**:
- ❌ Manual updates required
- ❌ No version control

**When to use**: When you want to try the skill quickly without Git.

---

### Method 3: Git Clone (Development)

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

### Marketplace

```bash
/plugin uninstall sequential-thinking
```

### Manual

```bash
# Remove skill directory
rm -rf ~/.claude/skills/sequential-thinking
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

## Next Steps

After successful installation:

1. 📖 Read the [User Guide](user-guide.md)
2. 💡 Check out [Best Practices](best-practices.md)
3. 📋 Try the [Examples](../examples/)
4. 🤝 Consider [Contributing](../CONTRIBUTING.md)

---

## Support

Need help?
- 💬 [GitHub Discussions](https://github.com/zerodice0/claude_sequential_thinking_skill/discussions)
- 🐛 [Report Issues](https://github.com/zerodice0/claude_sequential_thinking_skill/issues)
- 📖 [Documentation](user-guide.md)
