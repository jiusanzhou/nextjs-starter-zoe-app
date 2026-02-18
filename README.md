# nextjs-starter-zoe-app

> 🚀 A modern, YAML-driven static site generator based on Next.js + shadcn/ui

<div align="center">

**Just care about your content. No need to fork or clone this repository!**

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

</div>

## ✨ Features

### Core
- **📄 Static Export** - Pure static HTML output, deploy anywhere (Vercel, Netlify, GitHub Pages, CDN)
- **📝 YAML Configuration** - Single `zoe-site.yaml` file to configure your entire site
- **📂 Zero-config Content** - Just add Markdown/MDX files to `content/` directory
- **🎨 7 Built-in Themes** - default, cyber, minimal, apple, github, vercel, stripe
- **🌙 Dark Mode** - Built-in light/dark theme toggle with system detection
- **🔍 SEO Ready** - Automatic metadata, Open Graph, and sitemap generation
- **📱 PWA Support** - Web manifest and app icons for installable experience
- **🔒 Type Safe** - Full TypeScript support

### Content
- **📰 Blog System** - Posts with tags, archives, pinned posts, drafts
- **🗂️ Projects Showcase** - Display projects from local content or GitHub API
- **📄 Dynamic Pages** - MDX pages with custom components
- **📡 RSS Feed** - Auto-generated RSS support
- **📦 Git Content** - Load content from remote Git repositories
- **💬 Comments** - Giscus, Utterances, Disqus integration
- **✨ Syntax Highlighting** - Shiki with dual theme (light/dark)

### Pages
- **💰 Pricing Page** - Configurable pricing table with monthly/yearly toggle
- **📱 App Landing** - App download page with GitHub/Gitee releases
- **❓ Help Center** - Q&A system powered by GitHub Issues
- **📥 Releases Page** - Display app releases from GitHub/Gitee

### UI/UX
- **📊 Analytics** - Google Analytics and Plausible support
- **⬆️ Go to Top** - Floating back-to-top button
- **📱 Mobile Nav** - Bottom navigation bar on mobile
- **🦶 Enhanced Footer** - Link groups, social icons, author card popover
- **🎬 Lottie Animation** - Support for Lottie animations in MDX
- **📲 WeChat Guide** - Browser compatibility prompt for WeChat

### Tech Stack
- **Next.js 16** - App Router, React Server Components
- **React 19** - Latest React with concurrent features
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components (Radix + Tailwind)
- **MDX 3** - Markdown with JSX components

---

## 🚀 Quick Start

### Method 1: Quick Script (Recommended)

No need to clone! Just create your content and run:

```bash
# Create new project
curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/scripts/zoe-site.sh | bash -s new my-site
cd my-site

# Or run in existing content directory
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

---

## 📁 Project Structure

```
my-site/
├── zoe-site.yaml          # Site configuration
├── content/
│   ├── posts/             # Blog posts (MDX/MD)
│   │   └── hello-world.md
│   ├── pages/             # Static pages
│   │   ├── about.md
│   │   └── app-landing.mdx
│   └── projects/          # Project showcases
│       └── my-project.md
├── public/
│   └── icons/             # PWA icons
└── out/                   # Static export output
```

---

## ⚙️ Configuration

Edit `zoe-site.yaml` to customize your site:

### Basic

```yaml
title: My Site
description: My awesome site
url: https://example.com
lang: zh-CN
version: v1.0

# Theme: default, cyber, minimal, apple, github, vercel, stripe
theme: default

author:
  name: Your Name
  email: you@example.com
  avatar: https://github.com/username.png
  minibio: A short bio about yourself
  github: username
  twitter: username
  telegram: username

organization:
  name: Company Name
  logo: /images/logo.png

copyright:
  from: 2020
  holder: Your Name
  location: City
```

### Navigation

```yaml
navs:
  - title: Home
    href: /
  - title: Blog
    href: /blog
  - title: Projects
    href: /projects
  - title: Pricing
    href: /pricing
  - title: Help
    href: /help
  - title: About
    href: /about
```

### Footer Links

```yaml
links:
  - title: Home
    category: Company
    href: /
  - title: About
    category: Company
    href: /about
  - title: GitHub
    category: Open Source
    href: https://github.com/username
```

### Social Links

```yaml
socials:
  github: username              # Auto-expands to https://github.com/username
  twitter: username
  telegram: username
  email: you@example.com
  linkedin: username
  youtube: "@channel"
  rss: /rss.xml
```

### Blog

```yaml
blog:
  title: Blog
  description: My thoughts and ideas
  basePath: /blog
  postsPerPage: 10

contentDirs:
  - content
```

### Git Remote Content

```yaml
gitContent:
  - name: my-blog
    remote: https://github.com/user/blog-content.git
    branch: main
    patterns:
      - "posts/**/*.md"
```

### Analytics

```yaml
analytics:
  googleId: G-XXXXXXXXXX
  plausibleDomain: example.com
```

### Comments

```yaml
comments:
  provider: giscus              # giscus | utterances | disqus
  repo: username/repo
  repoId: "R_xxx"
  categoryId: "DIC_xxx"
```

### RSS

```yaml
rss:
  enabled: true
  path: /rss.xml
  title: My Site RSS Feed
```

### GitHub Projects

Auto-fetch projects from GitHub API:

```yaml
projects:
  provider: github
  tag: my-tag                   # Filter by topic
  owners:
    - username
```

### Help Center

Build a help center from GitHub Issues:

```yaml
helpqa:
  provider: github
  repo: owner/repo
  labelPrefix: help             # Filters help:xxx labels
```

- Create labels like `help:常见问题`, `help:使用入门` for categories
- Create issues and assign these labels
- Assign issues to someone to mark them as "pinned/hot"

### App Releases

Display releases from GitHub or Gitee:

```yaml
releaseRepo:
  - provider: github
    repo: username/repo
    assetRegexPatterns:
      android: ".*\\.apk$"
      windows: ".*\\.exe$"
      macos: ".*\\.dmg$"
```

### Pricing Page

Configurable pricing table:

```yaml
pricing:
  enabled: true
  title: Choose Your Plan
  description: Simple, transparent pricing
  yearlyDiscount: 20
  showToggle: true
  
  # Global feature definitions
  featureDefinitions:
    - id: projects
      name: Projects
    - id: storage
      name: Storage
    - id: api
      name: API Access
    - id: support
      name: Support
  
  plans:
    - id: free
      name: Free
      price: 0
      currency: $
      priceUnit: /mo
      features:
        projects: "5"
        storage: "1GB"
        api: false
        support: "Community"
      cta: Get Started
      ctaLink: "#"

    - id: pro
      name: Pro
      price: 29
      originalPrice: 49       # Strikethrough price
      popular: true           # "Recommended" badge
      badge: Most Popular
      features:
        projects: "Unlimited"
        storage: "10GB"
        api: true
        support: "Email"
      cta: Upgrade Now
      ctaLink: "#"

    - id: enterprise
      name: Enterprise
      price: 99
      features:
        projects: "Unlimited"
        storage: "Unlimited"
        api: "Unlimited"
        support: "Dedicated"
      cta: Contact Sales
      ctaLink: "#"
```

Feature values:
- `true` → ✓ (green check)
- `false` → ✗ (gray X)
- `"string"` → Display text value

---

## 📝 Frontmatter

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
published: true           # false = draft
pinned: true              # Show at top of list
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

MDX pages can use custom components:

```mdx
---
title: App Landing
---

import { Section } from '@/components/section'
import { AppRelease } from '@/components/app-release'

<Section title="My App" description="Download now">
  <AppRelease repo="user/repo" />
</Section>
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

---

## 🎨 Themes

7 built-in themes available:

| Theme | Description |
|-------|-------------|
| `default` | Elegant purple tones |
| `cyber` | Futuristic cyan |
| `minimal` | Black & white minimalism |
| `apple` | Apple design style |
| `github` | GitHub green tones |
| `vercel` | Pure black & white |
| `stripe` | Purple-blue gradient |

Switch theme in config or use the palette icon in header.

---

## 🛠️ Commands

```bash
# Development (with hot reload)
pnpm dev

# Build static site (outputs to /out)
pnpm build

# Sync git content before build
pnpm sync-git

# Lint
pnpm lint
```

### Script Commands

```bash
# Start dev server
curl -sSL .../zoe-site.sh | bash -s dev

# Build for production
curl -sSL .../zoe-site.sh | bash -s build

# Create new project
curl -sSL .../zoe-site.sh | bash -s new my-site

# Show help
curl -sSL .../zoe-site.sh | bash -s help
```

---

## 📦 MDX Components

Available components in MDX pages:

| Component | Description |
|-----------|-------------|
| `Section` | Content section with title/description |
| `AuthorCard` | Author info card with socials |
| `AppRelease` | App download buttons from GitHub/Gitee |
| `PricingTable` | Pricing comparison table |
| `PricingCard` | Single pricing card |
| `TypingText` | Typewriter animation text |
| `Lottie` | Lottie animation player |

Example:

```mdx
<Section title="Features" position="center">
  <PricingCard plan={{
    id: "pro",
    name: "Pro",
    price: 29,
    features: { api: true, support: "Email" }
  }} />
</Section>
```

---

## 🔄 Migration from Gatsby

This template is the Next.js successor of `gatsby-starter-zoe-app`:

| Feature | Gatsby | Next.js |
|---------|--------|---------|
| UI Library | Chakra UI | shadcn/ui |
| Data Layer | GraphQL | TypeScript |
| Content | MDX 1 | MDX 3 |
| React | 17 | 19 |
| Styling | Emotion | Tailwind CSS 4 |
| Themes | 1 | 7 built-in |
| Output | SSR/SSG | Static Export |
| Mobile Nav | ❌ | ✅ Bottom bar |
| Pricing Page | ❌ | ✅ Configurable |

---

## 📄 License

MIT © [Zoe](https://zoe.im)

---

## 🔗 Links

- [GitHub Repository](https://github.com/jiusanzhou/nextjs-starter-zoe-app)
- [Gatsby Version](https://github.com/jiusanzhou/gatsby-starter-zoe-app)
- [Author](https://zoe.im)
