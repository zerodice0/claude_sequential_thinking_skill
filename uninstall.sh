#!/usr/bin/env bash
#
# Sequential Thinking Skill Uninstaller
# Remove sequential thinking skill and slash commands from Claude Code
#
# Usage:
#   ./uninstall.sh              # Interactive uninstallation
#   ./uninstall.sh --global     # Uninstall from global location
#   ./uninstall.sh --local      # Uninstall from current project
#   ./uninstall.sh --help       # Show help
#

set -euo pipefail

# ============================================================================
# Constants
# ============================================================================

SCRIPT_VERSION="1.0.0"
SKILL_NAME="sequential-thinking"

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
${BOLD}Sequential Thinking Skill Uninstaller${NC} v${SCRIPT_VERSION}

${BOLD}USAGE:${NC}
    $0 [OPTIONS]

${BOLD}OPTIONS:${NC}
    --global        Uninstall from ~/.claude/
    --local         Uninstall from ./.claude/
    --all           Uninstall from both locations
    --help          Show this help message
    --version       Show version information

${BOLD}EXAMPLES:${NC}
    $0              # Interactive uninstallation (detects installation)
    $0 --global     # Uninstall from global location
    $0 --local      # Uninstall from local location
    $0 --all        # Uninstall from both locations

${BOLD}WHAT GETS REMOVED:${NC}
    - ~/.claude/skills/${SKILL_NAME}/
    - ~/.claude/commands/${SKILL_NAME}/
    - ./.claude/skills/${SKILL_NAME}/
    - ./.claude/commands/${SKILL_NAME}/

EOF
}

show_version() {
    echo "Sequential Thinking Skill Uninstaller v${SCRIPT_VERSION}"
}

# ============================================================================
# Detection Functions
# ============================================================================

check_installation() {
    local target_dir="$1"

    if [[ -d "$target_dir/skills/${SKILL_NAME}" ]] || [[ -d "$target_dir/commands/${SKILL_NAME}" ]]; then
        return 0  # Installed
    fi

    return 1  # Not installed
}

detect_installations() {
    local global_installed=false
    local local_installed=false

    if check_installation "$HOME/.claude"; then
        global_installed=true
    fi

    if check_installation ".claude"; then
        local_installed=true
    fi

    if [[ "$global_installed" == false ]] && [[ "$local_installed" == false ]]; then
        return 1  # Nothing installed
    fi

    # Return status in global variables (for use in main script)
    GLOBAL_INSTALLED=$global_installed
    LOCAL_INSTALLED=$local_installed

    return 0  # At least one installation found
}

# ============================================================================
# Uninstallation Functions
# ============================================================================

remove_directories() {
    local target_dir="$1"
    local removed_count=0

    if [[ -d "$target_dir/skills/${SKILL_NAME}" ]]; then
        log_step 1 2 "Removing skill directory..."
        rm -rf "$target_dir/skills/${SKILL_NAME}"
        ((removed_count++))
    fi

    if [[ -d "$target_dir/commands/${SKILL_NAME}" ]]; then
        log_step 2 2 "Removing commands directory..."
        rm -rf "$target_dir/commands/${SKILL_NAME}"
        ((removed_count++))
    fi

    return $removed_count
}

verify_removal() {
    local target_dir="$1"

    if [[ -d "$target_dir/skills/${SKILL_NAME}" ]] || [[ -d "$target_dir/commands/${SKILL_NAME}" ]]; then
        log_error "Verification failed: Some directories still exist"
        return 1
    fi

    return 0
}

perform_uninstallation() {
    local target_dir="$1"
    local install_type="$2"

    echo ""
    log_header "🗑️  Uninstalling Sequential Thinking Skill"

    log_info "Uninstallation type: ${BOLD}${install_type}${NC}"
    log_info "Target directory: ${BOLD}${target_dir}${NC}"
    echo ""

    # Check if installed
    if ! check_installation "$target_dir"; then
        log_warning "Sequential Thinking Skill is not installed in $install_type location."
        return 1
    fi

    # Confirm removal
    log_warning "This will remove the following directories:"
    [[ -d "$target_dir/skills/${SKILL_NAME}" ]] && echo "  - $target_dir/skills/${SKILL_NAME}/"
    [[ -d "$target_dir/commands/${SKILL_NAME}" ]] && echo "  - $target_dir/commands/${SKILL_NAME}/"
    echo ""

    read -p "Are you sure you want to continue? [y/N] " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Uninstallation cancelled."
        return 1
    fi

    echo ""

    # Remove directories
    if ! remove_directories "$target_dir"; then
        log_error "Uninstallation failed"
        return 1
    fi

    # Verify removal
    if ! verify_removal "$target_dir"; then
        return 1
    fi

    echo ""
    log_success "Uninstallation completed successfully!"

    return 0
}

show_uninstall_summary() {
    echo ""
    log_header "📍 Uninstallation Summary"

    echo "Sequential Thinking Skill has been removed from your system."
    echo ""
    echo "To reinstall, run:"
    echo "  ${BOLD}./install.sh${NC}"
    echo ""
}

# ============================================================================
# Main Uninstallation Logic
# ============================================================================

uninstall_global() {
    local target_dir="$HOME/.claude"

    if perform_uninstallation "$target_dir" "Global"; then
        show_uninstall_summary
        return 0
    fi

    return 1
}

uninstall_local() {
    local target_dir=".claude"

    if perform_uninstallation "$target_dir" "Local"; then
        show_uninstall_summary
        return 0
    fi

    return 1
}

uninstall_all() {
    local success=true

    # Try uninstalling from global
    if check_installation "$HOME/.claude"; then
        if ! uninstall_global; then
            success=false
        fi
    fi

    # Try uninstalling from local
    if check_installation ".claude"; then
        if ! uninstall_local; then
            success=false
        fi
    fi

    if [[ "$success" == false ]]; then
        return 1
    fi

    return 0
}

prompt_uninstall_location() {
    log_header "🗑️  Sequential Thinking Skill Uninstaller v${SCRIPT_VERSION}"

    # Detect installations
    if ! detect_installations; then
        log_warning "Sequential Thinking Skill is not installed."
        echo ""
        log_info "Installation locations checked:"
        echo "  - Global: $HOME/.claude/"
        echo "  - Local:  ./.claude/"
        echo ""
        exit 0
    fi

    # Show detected installations
    log_info "Detected installations:"
    if [[ "$GLOBAL_INSTALLED" == true ]]; then
        echo -e "  ${GREEN}✓${NC} Global: $HOME/.claude/"
    else
        echo -e "  ${RED}✗${NC} Global: Not installed"
    fi

    if [[ "$LOCAL_INSTALLED" == true ]]; then
        echo -e "  ${GREEN}✓${NC} Local:  ./.claude/"
    else
        echo -e "  ${RED}✗${NC} Local:  Not installed"
    fi

    echo ""

    # Build menu
    local options=()
    local actions=()

    if [[ "$GLOBAL_INSTALLED" == true ]]; then
        options+=("Global (~/.claude/)")
        actions+=("global")
    fi

    if [[ "$LOCAL_INSTALLED" == true ]]; then
        options+=("Local (./.claude/)")
        actions+=("local")
    fi

    if [[ "$GLOBAL_INSTALLED" == true ]] && [[ "$LOCAL_INSTALLED" == true ]]; then
        options+=("Both locations")
        actions+=("all")
    fi

    options+=("Cancel")
    actions+=("cancel")

    # Show menu
    echo "Select what to uninstall:"
    echo ""

    for i in "${!options[@]}"; do
        echo "  ${BOLD}$((i+1)))${NC} ${options[$i]}"
    done

    echo ""

    # Get user choice
    while true; do
        read -p "Enter your choice [${#options[@]}]: " choice
        choice=${choice:-${#options[@]}}

        if [[ "$choice" =~ ^[0-9]+$ ]] && [[ "$choice" -ge 1 ]] && [[ "$choice" -le ${#options[@]} ]]; then
            local action="${actions[$((choice-1))]}"

            case "$action" in
                global)
                    uninstall_global
                    break
                    ;;
                local)
                    uninstall_local
                    break
                    ;;
                all)
                    uninstall_all
                    break
                    ;;
                cancel)
                    log_info "Uninstallation cancelled."
                    exit 0
                    ;;
            esac
        else
            log_error "Invalid choice. Please enter a number between 1 and ${#options[@]}."
        fi
    done
}

# ============================================================================
# Main Entry Point
# ============================================================================

main() {
    # Parse arguments
    case "${1:-}" in
        --global)
            uninstall_global
            ;;
        --local)
            uninstall_local
            ;;
        --all)
            uninstall_all
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
            prompt_uninstall_location
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
