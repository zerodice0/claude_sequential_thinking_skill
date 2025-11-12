#!/usr/bin/env bash
#
# Sequential Thinking Skill Installer
# Install sequential thinking skill and slash commands for Claude Code
#
# Usage:
#   ./install.sh              # Interactive installation
#   ./install.sh --global     # Install globally (recommended)
#   ./install.sh --local      # Install to current project
#   ./install.sh --help       # Show help
#

set -euo pipefail

# ============================================================================
# Constants
# ============================================================================

SCRIPT_VERSION="1.0.0"
SKILL_NAME="sequential-thinking"
SOURCE_SKILL="SKILL.md"
SOURCE_COMMANDS_DIR=".claude/commands"

# ============================================================================
# Colors
# ============================================================================

if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    CYAN='\033[0;36m'
    BOLD='\033[1m'
    NC='\033[0m'
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    CYAN=''
    BOLD=''
    NC=''
fi

# ============================================================================
# Logging Functions
# ============================================================================

log_info() {
    echo -e "${BLUE}ℹ${NC}  $1"
}

log_success() {
    echo -e "${GREEN}✅${NC} $1"
}

log_error() {
    echo -e "${RED}❌${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}⚠️${NC}  $1"
}

log_step() {
    echo -e "${CYAN}[$1/$2]${NC} $3"
}

log_header() {
    echo ""
    echo -e "${BOLD}$1${NC}"
    echo ""
}

# ============================================================================
# Utility Functions
# ============================================================================

show_help() {
    cat << EOF
${BOLD}Sequential Thinking Skill Installer${NC} v${SCRIPT_VERSION}

${BOLD}USAGE:${NC}
    $0 [OPTIONS]

${BOLD}OPTIONS:${NC}
    --global        Install globally to ~/.claude/ (recommended)
    --local         Install to current project ./.claude/
    --help          Show this help message
    --version       Show version information

${BOLD}EXAMPLES:${NC}
    $0              # Interactive installation (asks for location)
    $0 --global     # Install globally
    $0 --local      # Install to current project

${BOLD}INSTALLATION PATHS:${NC}
    Global:  ~/.claude/skills/${SKILL_NAME}/
             ~/.claude/commands/${SKILL_NAME}/

    Local:   ./.claude/skills/${SKILL_NAME}/
             ./.claude/commands/${SKILL_NAME}/

${BOLD}WHAT GETS INSTALLED:${NC}
    - SKILL.md          → skills/${SKILL_NAME}/
    - analyze.md        → commands/${SKILL_NAME}/
    - think.md          → commands/${SKILL_NAME}/

For more information, visit:
https://github.com/zerodice0/claude_sequential_thinking_skill

EOF
}

show_version() {
    echo "Sequential Thinking Skill Installer v${SCRIPT_VERSION}"
}

# ============================================================================
# Validation Functions
# ============================================================================

verify_source_files() {
    local missing_files=()

    if [[ ! -f "$SOURCE_SKILL" ]]; then
        missing_files+=("$SOURCE_SKILL")
    fi

    if [[ ! -d "$SOURCE_COMMANDS_DIR" ]]; then
        missing_files+=("$SOURCE_COMMANDS_DIR/")
    else
        if [[ ! -f "$SOURCE_COMMANDS_DIR/analyze.md" ]]; then
            missing_files+=("$SOURCE_COMMANDS_DIR/analyze.md")
        fi
        if [[ ! -f "$SOURCE_COMMANDS_DIR/think.md" ]]; then
            missing_files+=("$SOURCE_COMMANDS_DIR/think.md")
        fi
    fi

    if [[ ${#missing_files[@]} -gt 0 ]]; then
        log_error "Missing source files:"
        for file in "${missing_files[@]}"; do
            echo "  - $file"
        done
        echo ""
        log_error "Please run this script from the sequential_thinking_skill directory."
        return 1
    fi

    return 0
}

check_existing_installation() {
    local target_dir="$1"

    if [[ -d "$target_dir/skills/${SKILL_NAME}" ]] || [[ -d "$target_dir/commands/${SKILL_NAME}" ]]; then
        return 0  # Exists
    fi

    return 1  # Does not exist
}

check_write_permission() {
    local target_dir="$1"
    local parent_dir

    # If target exists, check if writable
    if [[ -d "$target_dir" ]]; then
        if [[ ! -w "$target_dir" ]]; then
            return 1
        fi
        return 0
    fi

    # If target doesn't exist, check parent directory
    parent_dir=$(dirname "$target_dir")
    if [[ -d "$parent_dir" ]]; then
        if [[ ! -w "$parent_dir" ]]; then
            return 1
        fi
        return 0
    fi

    # Parent doesn't exist either, check if we can create it
    return 0
}

# ============================================================================
# Installation Functions
# ============================================================================

create_directories() {
    local target_dir="$1"

    log_step 1 4 "Creating directories..."

    mkdir -p "$target_dir/skills/${SKILL_NAME}"
    mkdir -p "$target_dir/commands/${SKILL_NAME}"

    if [[ ! -d "$target_dir/skills/${SKILL_NAME}" ]] || [[ ! -d "$target_dir/commands/${SKILL_NAME}" ]]; then
        log_error "Failed to create directories"
        return 1
    fi

    return 0
}

copy_skill_file() {
    local target_dir="$1"

    log_step 2 4 "Copying skill file..."

    cp "$SOURCE_SKILL" "$target_dir/skills/${SKILL_NAME}/SKILL.md"

    if [[ ! -f "$target_dir/skills/${SKILL_NAME}/SKILL.md" ]]; then
        log_error "Failed to copy skill file"
        return 1
    fi

    return 0
}

copy_command_files() {
    local target_dir="$1"

    log_step 3 4 "Copying command files..."

    cp "$SOURCE_COMMANDS_DIR/analyze.md" "$target_dir/commands/${SKILL_NAME}/analyze.md"
    cp "$SOURCE_COMMANDS_DIR/think.md" "$target_dir/commands/${SKILL_NAME}/think.md"

    if [[ ! -f "$target_dir/commands/${SKILL_NAME}/analyze.md" ]] || \
       [[ ! -f "$target_dir/commands/${SKILL_NAME}/think.md" ]]; then
        log_error "Failed to copy command files"
        return 1
    fi

    return 0
}

verify_installation() {
    local target_dir="$1"

    log_step 4 4 "Verifying installation..."

    local expected_files=(
        "$target_dir/skills/${SKILL_NAME}/SKILL.md"
        "$target_dir/commands/${SKILL_NAME}/analyze.md"
        "$target_dir/commands/${SKILL_NAME}/think.md"
    )

    for file in "${expected_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            log_error "Verification failed: $file not found"
            return 1
        fi
    done

    return 0
}

perform_installation() {
    local target_dir="$1"
    local install_type="$2"

    echo ""
    log_header "📦 Installing Sequential Thinking Skill"

    log_info "Installation type: ${BOLD}${install_type}${NC}"
    log_info "Target directory: ${BOLD}${target_dir}${NC}"
    echo ""

    # Create directories
    if ! create_directories "$target_dir"; then
        return 1
    fi

    # Copy skill file
    if ! copy_skill_file "$target_dir"; then
        return 1
    fi

    # Copy command files
    if ! copy_command_files "$target_dir"; then
        return 1
    fi

    # Verify installation
    if ! verify_installation "$target_dir"; then
        return 1
    fi

    echo ""
    log_success "Installation completed successfully!"

    return 0
}

show_installation_summary() {
    local target_dir="$1"

    echo ""
    log_header "📍 Installation Summary"

    echo "Installed files:"
    echo -e "  ${GREEN}✓${NC} $target_dir/skills/${SKILL_NAME}/SKILL.md"
    echo -e "  ${GREEN}✓${NC} $target_dir/commands/${SKILL_NAME}/analyze.md"
    echo -e "  ${GREEN}✓${NC} $target_dir/commands/${SKILL_NAME}/think.md"

    echo ""
    log_header "🎯 Usage"

    echo ""
    echo "You can now use the following commands in Claude Code:"
    echo ""
    echo -e "  ${BOLD}/think [problem]${NC}"
    echo "    Use full sequential thinking for complex problems"
    echo "    Example: /think How to design a scalable microservices architecture?"
    echo ""
    echo -e "  ${BOLD}/analyze [topic]${NC}"
    echo "    Quick systematic analysis"
    echo "    Example: /analyze performance bottleneck in authentication"
    echo ""

    echo ""
    log_header "📚 Learn More"

    echo "Documentation: https://github.com/zerodice0/claude_sequential_thinking_skill"
    echo "User Guide:    https://github.com/zerodice0/claude_sequential_thinking_skill/blob/main/docs/user-guide.md"
    echo ""
}

# ============================================================================
# Main Installation Logic
# ============================================================================

install_global() {
    local target_dir="$HOME/.claude"

    # Check if already installed
    if check_existing_installation "$target_dir"; then
        log_warning "Sequential Thinking Skill is already installed globally."
        echo ""
        read -p "Do you want to overwrite the existing installation? [y/N] " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Installation cancelled."
            exit 0
        fi
        echo ""
    fi

    # Check write permission
    if ! check_write_permission "$target_dir"; then
        log_error "No write permission for $target_dir"
        log_info "Try running with appropriate permissions or use --local instead."
        exit 1
    fi

    # Perform installation
    if ! perform_installation "$target_dir" "Global"; then
        log_error "Installation failed"
        exit 1
    fi

    show_installation_summary "$target_dir"
}

install_local() {
    local target_dir=".claude"

    # Check if already installed
    if check_existing_installation "$target_dir"; then
        log_warning "Sequential Thinking Skill is already installed locally."
        echo ""
        read -p "Do you want to overwrite the existing installation? [y/N] " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Installation cancelled."
            exit 0
        fi
        echo ""
    fi

    # Check write permission
    if ! check_write_permission "$target_dir"; then
        log_error "No write permission for $target_dir"
        exit 1
    fi

    # Perform installation
    if ! perform_installation "$target_dir" "Local"; then
        log_error "Installation failed"
        exit 1
    fi

    show_installation_summary "$target_dir"
}

prompt_install_location() {
    log_header "🚀 Sequential Thinking Skill Installer v${SCRIPT_VERSION}"

    echo "Select installation location:"
    echo ""
    echo -e "  ${BOLD}1)${NC} Global (recommended)"
    echo -e "     Install to ${CYAN}~/.claude/${NC}"
    echo "     Available in all Claude Code projects"
    echo ""
    echo -e "  ${BOLD}2)${NC} Local"
    echo -e "     Install to ${CYAN}./.claude/${NC}"
    echo "     Available only in current project"
    echo ""

    while true; do
        read -p "Enter your choice [1]: " choice
        choice=${choice:-1}

        case $choice in
            1)
                install_global
                break
                ;;
            2)
                install_local
                break
                ;;
            *)
                log_error "Invalid choice. Please enter 1 or 2."
                ;;
        esac
    done
}

# ============================================================================
# Main Entry Point
# ============================================================================

main() {
    # Verify source files
    if ! verify_source_files; then
        exit 1
    fi

    # Parse arguments
    case "${1:-}" in
        --global)
            install_global
            ;;
        --local)
            install_local
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        --version|-v)
            show_version
            exit 0
            ;;
        "")
            prompt_install_location
            ;;
        *)
            log_error "Unknown option: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@"
