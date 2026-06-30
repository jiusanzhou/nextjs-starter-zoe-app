#!/usr/bin/env bash
#
# zoe-site.sh — One-shot builder for nextjs-starter-zoe-app
#
# Usage (from a user repo containing zoe-site.yaml + content/):
#   curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/scripts/zoe-site.sh | bash
#   curl -sSL .../zoe-site.sh | bash -s dev
#   curl -sSL .../zoe-site.sh | bash -s build
#   curl -sSL .../zoe-site.sh | bash -s new my-site
#
# Environment variables:
#   ZOE_THEME_REPO      Theme repo (default: jiusanzhou/nextjs-starter-zoe-app)
#   ZOE_THEME_BRANCH    Branch (default: main)
#   ZOE_CACHE_DIR       Cache root (default: $HOME/.cache/zoe-site)
#   ZOE_OUTPUT_DIR      Where to place build output (default: $PWD/out)
#   ZOE_BASE_PATH       basePath for static export (e.g. /my-repo)
#   GITHUB_TOKEN        Optional; bumps GitHub API rate limit for /releases
#
set -euo pipefail

THEME_REPO="${ZOE_THEME_REPO:-jiusanzhou/nextjs-starter-zoe-app}"
BRANCH="${ZOE_THEME_BRANCH:-main}"
CACHE_DIR="${ZOE_CACHE_DIR:-$HOME/.cache/zoe-site}"
THEME_DIR="$CACHE_DIR/$(basename "$THEME_REPO")"
OUTPUT_DIR_DEFAULT="$(pwd)/out"
OUTPUT_DIR="${ZOE_OUTPUT_DIR:-$OUTPUT_DIR_DEFAULT}"

# Colors (auto-disable when not a TTY)
if [ -t 1 ]; then
    RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
    BLUE='\033[0;34m'; PURPLE='\033[0;35m'; CYAN='\033[0;36m'; NC='\033[0m'
else
    RED=''; GREEN=''; YELLOW=''; BLUE=''; PURPLE=''; CYAN=''; NC=''
fi

log_info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
log_success() { echo -e "${GREEN}[OK]${NC} $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }
log_step()    { echo -e "${CYAN}▶${NC} $*"; }

print_banner() {
    [ -n "$PURPLE" ] || return 0
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║  🚀 Zoe Site — Next.js Starter                           ║"
    echo "║  YAML-driven site generator (Next.js + shadcn/ui)        ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# ─────────────────────────────────────────────────────────────────────────────
# Detection
# ─────────────────────────────────────────────────────────────────────────────

PKG_MANAGER=""

detect_pkg_manager() {
    if command -v pnpm &> /dev/null; then
        PKG_MANAGER="pnpm"
    elif command -v npm &> /dev/null; then
        PKG_MANAGER="npm"
    else
        log_error "Neither pnpm nor npm found"
        exit 1
    fi
}

check_dependencies() {
    log_step "Checking dependencies"
    local bin
    for bin in node git; do
        if ! command -v "$bin" &> /dev/null; then
            log_error "$bin not installed"
            exit 1
        fi
    done
    detect_pkg_manager
    log_success "node=$(node -v) git=$(git --version | cut -d' ' -f3) pkg=$PKG_MANAGER"
}

# ─────────────────────────────────────────────────────────────────────────────
# Theme setup
# ─────────────────────────────────────────────────────────────────────────────

setup_theme() {
    log_step "Preparing theme: $THEME_REPO@$BRANCH"
    mkdir -p "$CACHE_DIR"

    if [ -d "$THEME_DIR/.git" ]; then
        log_info "Updating cached theme at $THEME_DIR"
        (cd "$THEME_DIR" && \
            git fetch --depth 1 origin "$BRANCH" && \
            git checkout -q "$BRANCH" && \
            git reset --hard "origin/$BRANCH")
    else
        rm -rf "$THEME_DIR"
        log_info "Cloning theme into $THEME_DIR"
        git clone --depth 1 --branch "$BRANCH" \
            "https://github.com/$THEME_REPO.git" "$THEME_DIR"
    fi
    log_success "Theme ready"
}

install_deps() {
    log_step "Installing dependencies ($PKG_MANAGER)"
    (cd "$THEME_DIR" && {
        if [ "$PKG_MANAGER" = "pnpm" ]; then
            pnpm install --frozen-lockfile 2>/dev/null || pnpm install
        else
            npm ci 2>/dev/null || npm install
        fi
    })
    log_success "Dependencies installed"
}

# ─────────────────────────────────────────────────────────────────────────────
# User content injection
# ─────────────────────────────────────────────────────────────────────────────

# Find the user's zoe-site.yaml in cwd, return absolute path or empty
find_user_config() {
    local dir; dir="$(pwd)"
    for ext in yaml yml json; do
        if [ -f "$dir/zoe-site.$ext" ]; then
            echo "$dir/zoe-site.$ext"
            return 0
        fi
    done
    return 1
}

# Detect content directories in cwd (content/, src/content/, posts/)
detect_content_dirs() {
    local dir; dir="$(pwd)"
    local found=()
    for candidate in content src/content posts pages; do
        if [ -d "$dir/$candidate" ]; then
            found+=("$dir/$candidate")
        fi
    done
    # Comma-joined
    local IFS=','
    echo "${found[*]}"
}

# Export environment for Next.js build
export_user_env() {
    local context="$(pwd)"
    local user_config; user_config="$(find_user_config || true)"
    local content_dirs; content_dirs="$(detect_content_dirs)"

    if [ -n "$user_config" ]; then
        log_success "Found user config: $user_config"
        export ZOE_CONFIG_PATH="$user_config"
    else
        log_warn "No zoe-site.yaml in $context (will use theme defaults)"
    fi

    if [ -n "$content_dirs" ]; then
        log_success "Found content dirs: $content_dirs"
        export ZOE_CONTENT_DIRS="$content_dirs"
    fi

    if [ -n "${ZOE_BASE_PATH:-}" ]; then
        export PAGES_BASE_PATH="$ZOE_BASE_PATH"
        export NEXT_PUBLIC_BASE_PATH="$ZOE_BASE_PATH"
        log_info "basePath: $ZOE_BASE_PATH"
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
# Commands
# ─────────────────────────────────────────────────────────────────────────────

cmd_dev() {
    export_user_env
    log_step "Starting dev server"
    (cd "$THEME_DIR" && \
        if [ "$PKG_MANAGER" = "pnpm" ]; then pnpm dev; else npm run dev; fi)
}

cmd_build() {
    export_user_env
    log_step "Building static site"
    (cd "$THEME_DIR" && \
        if [ "$PKG_MANAGER" = "pnpm" ]; then pnpm build; else npm run build; fi)

    # Copy build output to user-visible location
    local theme_out="$THEME_DIR/out"
    if [ ! -d "$theme_out" ]; then
        log_error "Build output not found at $theme_out"
        log_warn "Static export may be disabled — check next.config.ts (need output: 'export')"
        exit 1
    fi

    mkdir -p "$OUTPUT_DIR"
    log_step "Copying output → $OUTPUT_DIR"
    # rsync if available, else cp -r
    if command -v rsync &> /dev/null; then
        rsync -a --delete "$theme_out/" "$OUTPUT_DIR/"
    else
        rm -rf "$OUTPUT_DIR"
        cp -r "$theme_out" "$OUTPUT_DIR"
    fi

    # Build summary
    local file_count; file_count=$(find "$OUTPUT_DIR" -type f | wc -l | tr -d ' ')
    local total_size; total_size=$(du -sh "$OUTPUT_DIR" | cut -f1)
    log_success "Build complete"
    echo ""
    echo -e "  ${CYAN}Output:${NC}  $OUTPUT_DIR"
    echo -e "  ${CYAN}Files:${NC}   $file_count"
    echo -e "  ${CYAN}Size:${NC}    $total_size"
    echo ""
}

cmd_start() {
    cmd_build
    log_step "Serving production build at http://localhost:3000"
    (cd "$THEME_DIR" && \
        if [ "$PKG_MANAGER" = "pnpm" ]; then pnpm start; else npm start; fi)
}

cmd_new() {
    local name="${1:-my-zoe-site}"
    log_step "Creating new project: $name"

    if [ -d "$name" ]; then
        log_error "Directory '$name' already exists"
        exit 1
    fi

    mkdir -p "$name/content/posts" "$name/content/pages"

    cat > "$name/zoe-site.yaml" <<'EOF'
title: My Site
description: Built with nextjs-starter-zoe-app
url: https://example.com
lang: zh-CN
theme: vercel

author:
  name: Your Name
  email: you@example.com

navs:
  - title: Home
    href: /
  - title: Blog
    href: /blog
  - title: About
    href: /about

blog:
  title: Blog
  description: Latest posts

contentDirs: [content]

rss:
  enabled: true
  path: /rss.xml
EOF

    cat > "$name/content/posts/hello-world.md" <<'EOF'
---
title: Hello World
date: 2024-01-01
tags: [intro]
published: true
---

# Hello World

Welcome to your new site, built with `nextjs-starter-zoe-app`.
EOF

    cat > "$name/content/pages/about.md" <<'EOF'
---
title: About
---

# About

This is the about page.
EOF

    cat > "$name/.gitignore" <<'EOF'
node_modules/
out/
.next/
.cache/
.env.local
.DS_Store
EOF

    log_success "Project created at ./$name"
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    echo "  cd $name"
    echo "  curl -sSL https://raw.githubusercontent.com/$THEME_REPO/$BRANCH/scripts/zoe-site.sh | bash -s dev"
    echo ""
}

cmd_help() {
    cat <<EOF
Usage: zoe-site.sh [command] [args]

Commands:
  dev               Start dev server (http://localhost:3000)
  build             Build static site → \$ZOE_OUTPUT_DIR (default: ./out)
  start             Build + serve production
  new <name>        Scaffold a new project
  help              Show this help

Environment:
  ZOE_THEME_REPO     Theme repo (default: $THEME_REPO)
  ZOE_THEME_BRANCH   Branch (default: $BRANCH)
  ZOE_CACHE_DIR      Cache dir (default: \$HOME/.cache/zoe-site)
  ZOE_OUTPUT_DIR     Output dir (default: \$PWD/out)
  ZOE_BASE_PATH      basePath for sub-path deploy (e.g. /my-repo)
  GITHUB_TOKEN       Bumps /releases API rate limit

Examples:
  # Build in current repo (zoe-site.yaml + content/)
  curl -sSL https://raw.githubusercontent.com/$THEME_REPO/$BRANCH/scripts/zoe-site.sh | bash -s build

  # Scaffold new
  curl -sSL .../zoe-site.sh | bash -s new my-site

  # GitHub Pages sub-path
  ZOE_BASE_PATH=/my-repo curl -sSL .../zoe-site.sh | bash -s build
EOF
}

# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

main() {
    print_banner

    local cmd="${1:-help}"
    shift || true

    case "$cmd" in
        new)
            cmd_new "$@"
            ;;
        help|--help|-h|"")
            cmd_help
            ;;
        dev|build|start)
            check_dependencies
            setup_theme
            install_deps
            "cmd_$cmd" "$@"
            ;;
        *)
            log_error "Unknown command: $cmd"
            cmd_help
            exit 1
            ;;
    esac
}

main "$@"
