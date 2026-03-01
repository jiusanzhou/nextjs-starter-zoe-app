#!/bin/bash
# zoe-site.sh — 自动拉取 Next.js 主题并运行
#
# 用法（在内容仓库目录下）：
#   bash hack/zoe-site.sh dev [port] [host]
#   bash hack/zoe-site.sh build
#
# 或远程执行：
#   bash <(curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/hack/zoe-site.sh) dev

theme="jiusanzhou/nextjs-starter-zoe-app"
branch="main"
script="hack/zoe-site.js"
target="/tmp/zoe-site"

if [ ! -d "$target" ]; then mkdir -p "$target"; fi

curl -sSL "https://raw.githubusercontent.com/$theme/$branch/$script" \
    > "$target/zoe-site.js"

node "$target/zoe-site.js" "$@"
