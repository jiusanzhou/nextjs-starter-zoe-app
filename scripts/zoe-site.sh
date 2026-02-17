#!/bin/bash
#
# zoe-site.sh - Quick install and run script for nextjs-starter-zoe-app
#
# Usage:
#   curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/scripts/zoe-site.sh | bash
#   curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/scripts/zoe-site.sh | bash -s dev
#   curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/scripts/zoe-site.sh | bash -s build
#

set -e

THEME_REPO="jiusanzhou/nextjs-starter-zoe-app"
BRANCH="main"
CACHE_DIR="${ZOE_CACHE_DIR:-$HOME/.cache/zoe-site}"
THEME_DIR="$CACHE_DIR/nextjs-starter-zoe-app"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_banner() {
    echo -e "${PURPLE}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║   🚀 Zoe Site - Next.js Starter                          ║"
    echo "║                                                           ║"
    echo "║   A modern, YAML-driven site generator                    ║"
    echo "║   Based on Next.js + shadcn/ui                            ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 is not installed. Please install it first."
        exit 1
    fi
}

# Check dependencies
check_dependencies() {
    log_info "Checking dependencies..."
    check_command "node"
    check_command "git"
    
    # Check for pnpm or npm
    if command -v pnpm &> /dev/null; then
        PKG_MANAGER="pnpm"
    elif command -v npm &> /dev/null; then
        PKG_MANAGER="npm"
    else
        log_error "Neither pnpm nor npm found. Please install one of them."
        exit 1
    fi
    
    log_success "Dependencies OK (using $PKG_MANAGER)"
}

# Clone or update theme
setup_theme() {
    log_info "Setting up theme..."
    
    mkdir -p "$CACHE_DIR"
    
    if [ -d "$THEME_DIR" ]; then
        log_info "Updating existing theme..."
        cd "$THEME_DIR"
        git fetch origin $BRANCH
        git checkout $BRANCH
        git reset --hard origin/$BRANCH
    else
        log_info "Cloning theme..."
        git clone --depth 1 --branch $BRANCH \
            "https://github.com/$THEME_REPO.git" "$THEME_DIR"
    fi
    
    log_success "Theme ready at $THEME_DIR"
}

# Find zoe-site.yaml in current directory or parents
find_config() {
    local dir="$1"
    
    while [ "$dir" != "/" ]; do
        for ext in yaml yml toml json; do
            if [ -f "$dir/zoe-site.$ext" ]; then
                echo "$dir/zoe-site.$ext"
                return 0
            fi
        done
        dir=$(dirname "$dir")
    done
    
    return 1
}

# Generate config list
generate_config_list() {
    local context_dir="$1"
    local config_list="$THEME_DIR/config-list.txt"
    
    log_info "Looking for zoe-site config..."
    
    local configs=()
    
    for ext in yaml yml toml json; do
        if [ -f "$context_dir/zoe-site.$ext" ]; then
            configs+=("$context_dir/zoe-site.$ext")
        fi
    done
    
    if [ ${#configs[@]} -eq 0 ]; then
        log_warn "No zoe-site config found in $context_dir"
        log_info "Using default configuration"
        echo "" > "$config_list"
    else
        log_success "Found config: ${configs[*]}"
        printf '%s\n' "${configs[@]}" > "$config_list"
    fi
}

# Install dependencies
install_deps() {
    cd "$THEME_DIR"
    
    if [ -f "pnpm-lock.yaml" ] && command -v pnpm &> /dev/null; then
        PKG_MANAGER="pnpm"
    elif [ -f "package-lock.json" ]; then
        PKG_MANAGER="npm"
    fi
    
    log_info "Installing dependencies with $PKG_MANAGER..."
    
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm install --frozen-lockfile 2>/dev/null || pnpm install
    else
        npm ci 2>/dev/null || npm install
    fi
    
    log_success "Dependencies installed"
}

# Sync git content
sync_git_content() {
    cd "$THEME_DIR"
    
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm sync-git 2>/dev/null || true
    else
        npm run sync-git 2>/dev/null || true
    fi
}

# Run dev server
cmd_dev() {
    log_info "Starting development server..."
    cd "$THEME_DIR"
    
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm dev
    else
        npm run dev
    fi
}

# Run build
cmd_build() {
    log_info "Building site..."
    cd "$THEME_DIR"
    
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm build
    else
        npm run build
    fi
    
    log_success "Build complete! Output in $THEME_DIR/.next"
    
    # Copy to current directory if requested
    if [ "$COPY_OUTPUT" = "true" ]; then
        local output_dir="${OUTPUT_DIR:-./out}"
        log_info "Exporting static files to $output_dir..."
        
        if [ "$PKG_MANAGER" = "pnpm" ]; then
            pnpm next export -o "$output_dir" 2>/dev/null || \
            cp -r "$THEME_DIR/out" "$output_dir" 2>/dev/null || \
            log_warn "Static export not available, use 'next start' for production"
        fi
    fi
}

# Run production server
cmd_start() {
    log_info "Starting production server..."
    cd "$THEME_DIR"
    
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm start
    else
        npm run start
    fi
}

# Create new project
cmd_new() {
    local project_name="${1:-my-zoe-site}"
    
    log_info "Creating new project: $project_name"
    
    if [ -d "$project_name" ]; then
        log_error "Directory $project_name already exists"
        exit 1
    fi
    
    mkdir -p "$project_name"
    cd "$project_name"
    
    # Create default config
    cat > zoe-site.yaml << 'EOF'
# Zoe Site Configuration
title: My Site
description: A site built with nextjs-starter-zoe-app
url: https://example.com
lang: zh-CN

version: "1.0"

author:
  name: Your Name
  email: you@example.com

navs:
  - title: 首页
    href: /
  - title: 博客
    href: /blog
  - title: 关于
    href: /about

blog:
  title: 博客
  description: 我的博客文章

theme: default

contentDirs:
  - content

rss:
  enabled: true
  path: /rss.xml
EOF
    
    # Create content directories
    mkdir -p content/{posts,pages,projects}
    
    # Create sample post
    cat > content/posts/hello-world.md << 'EOF'
---
title: Hello World
description: 我的第一篇文章
date: 2024-01-01
tags:
  - 入门
published: true
---

# Hello World

欢迎来到我的网站！

这是使用 **nextjs-starter-zoe-app** 创建的第一篇文章。
EOF
    
    # Create about page
    cat > content/pages/about.md << 'EOF'
---
title: 关于
description: 关于我
---

# 关于我

这是关于页面。
EOF
    
    log_success "Project created: $project_name"
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    echo "  cd $project_name"
    echo "  curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/scripts/zoe-site.sh | bash -s dev"
    echo ""
}

# Show help
cmd_help() {
    echo "Usage: zoe-site.sh [command] [options]"
    echo ""
    echo "Commands:"
    echo "  dev       Start development server"
    echo "  build     Build for production"
    echo "  start     Start production server"
    echo "  new       Create new project"
    echo "  help      Show this help"
    echo ""
    echo "Examples:"
    echo "  # Start dev server in current directory"
    echo "  curl -sSL https://git.io/zoe-site | bash"
    echo ""
    echo "  # Create new project"
    echo "  curl -sSL https://git.io/zoe-site | bash -s new my-site"
    echo ""
    echo "  # Build site"
    echo "  curl -sSL https://git.io/zoe-site | bash -s build"
    echo ""
    echo "Environment variables:"
    echo "  ZOE_CACHE_DIR   Cache directory (default: ~/.cache/zoe-site)"
    echo ""
}

# Main
main() {
    print_banner
    
    local cmd="${1:-dev}"
    shift || true
    
    case "$cmd" in
        new)
            cmd_new "$@"
            ;;
        help|--help|-h)
            cmd_help
            ;;
        dev|build|start)
            check_dependencies
            setup_theme
            generate_config_list "$(pwd)"
            install_deps
            sync_git_content
            
            case "$cmd" in
                dev)
                    cmd_dev
                    ;;
                build)
                    cmd_build
                    ;;
                start)
                    cmd_build
                    cmd_start
                    ;;
            esac
            ;;
        *)
            log_error "Unknown command: $cmd"
            cmd_help
            exit 1
            ;;
    esac
}

main "$@"
