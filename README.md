# nextjs-starter-zoe-app

> 🚀 A modern, YAML-driven site generator based on Next.js + shadcn/ui

<div align="center">

**Just care about your content. No need to fork or clone this repository!**

</div>

## Quick Install

**One command to start:**

```bash
# Create new project
curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/scripts/zoe-site.sh | bash -s new my-site

# Or run in existing content directory
curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/scripts/zoe-site.sh | bash
```

**Or use npx:**

```bash
# Clone the template
npx degit jiusanzhou/nextjs-starter-zoe-app my-site
cd my-site
pnpm install
pnpm dev
```

## Features

- **🎨 7 Built-in Themes** - default, cyber, minimal, apple, github, vercel, stripe
- **📝 YAML Configuration** - Single `zoe-site.yaml` file to configure your entire site
- **📂 Zero-config Content** - Just add Markdown/MDX files to `content/` directory
- **🚀 Modern Stack** - Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **💎 Beautiful UI** - shadcn/ui components (Radix + Tailwind)
- **🔍 SEO Ready** - Automatic metadata generation
- **🌙 Dark Mode** - Built-in light/dark theme toggle
- **📰 Blog System** - Posts, tags, archives out of the box
- **🗂️ Projects Showcase** - Display your projects beautifully
- **📡 RSS Feed** - Auto-generated RSS support
- **📦 Git Content** - Load content from remote Git repositories
- **🔒 Type Safe** - Full TypeScript support

## Usage

### Method 1: Quick Script (Recommended)

No need to clone! Just create your content and run:

```bash
# 1. Create your content directory
mkdir my-site && cd my-site

# 2. Create your config file
cat > zoe-site.yaml << EOF
title: My Site
description: My awesome site
theme: default
EOF

# 3. Run the script
curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/scripts/zoe-site.sh | bash
```

### Method 2: Clone Template

```bash
npx degit jiusanzhou/nextjs-starter-zoe-app my-site
cd my-site
pnpm install
pnpm dev
```

### Method 3: Fork & Customize

Fork this repository and customize to your needs.

## Configuration

Edit `zoe-site.yaml` to customize your site:

```yaml
title: My Site
description: My awesome site
url: https://example.com
lang: zh-CN

# Theme: default, cyber, minimal, apple, github, vercel, stripe
theme: default

author:
  name: Your Name
  email: you@example.com
  avatar: https://github.com/username.png
  minibio: A short bio about yourself

navs:
  - title: Home
    href: /
  - title: Blog
    href: /blog
  - title: Projects
    href: /projects
  - title: About
    href: /about

socials:
  github: https://github.com/username
  twitter: https://twitter.com/username

blog:
  title: Blog
  description: My thoughts and ideas
  basePath: /blog

contentDirs:
  - content

# Load content from remote Git repos
gitContent:
  - name: my-blog
    remote: https://github.com/user/blog-content.git
    branch: main

rss:
  enabled: true
  path: /rss.xml
```

## Content Structure

```
content/
├── posts/          # Blog posts (MDX/MD)
│   └── hello-world.md
├── pages/          # Static pages
│   └── about.md
└── projects/       # Project showcases
    └── my-project.md
```

## Frontmatter

### Posts

```yaml
---
title: Post Title
description: Post description
date: 2024-01-01
tags:
  - tag1
  - tag2
banner: /images/banner.jpg
published: true
pinned: false
---
```

### Pages

```yaml
---
title: Page Title
description: Page description
layout: default
---
```

### Projects

```yaml
---
title: Project Name
description: Project description
repo: https://github.com/user/repo
url: https://project.com
tags:
  - Next.js
  - TypeScript
featured: true
---
```

## Themes

7 built-in themes available:

| Theme | Description |
|-------|-------------|
| `default` | 简洁优雅紫色调 |
| `cyber` | 未来科技感青色 |
| `minimal` | 黑白极简主义 |
| `apple` | Apple 设计风格 |
| `github` | GitHub 绿色调 |
| `vercel` | Vercel 纯黑白 |
| `stripe` | Stripe 紫蓝渐变 |

Switch theme in config or use the palette icon in header.

## Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start

# Sync git content
pnpm sync-git

# Lint
pnpm lint
```

## Script Commands

When using the quick install script:

```bash
# Start dev server
curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/scripts/zoe-site.sh | bash -s dev

# Build for production
curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/scripts/zoe-site.sh | bash -s build

# Create new project
curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/scripts/zoe-site.sh | bash -s new my-site

# Show help
curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/scripts/zoe-site.sh | bash -s help
```

## Migration from Gatsby

This template is the Next.js successor of `gatsby-starter-zoe-app`. Key differences:

| Feature | Gatsby | Next.js |
|---------|--------|---------|
| UI Library | Chakra UI | shadcn/ui |
| Data Layer | GraphQL | TypeScript |
| Content | MDX 1 | MDX 3 / remark |
| React | 17 | 19 |
| Styling | Emotion | Tailwind CSS 4 |
| Themes | 1 | 7 built-in |

## License

MIT © [Zoe](https://zoe.im)
