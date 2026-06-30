# nextjs-starter-zoe-app

> A config-driven, production-ready website starter built with Next.js, shadcn/ui, and Tailwind CSS. Ship landing pages, SaaS sites, developer tools, and personal blogs — all from a single YAML file.

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

</div>

---

## 🎨 Live Demo

**[👉 zoe.im/nextjs-starter-zoe-app](https://zoe.im/nextjs-starter-zoe-app/)** — Click the palette button (bottom-left) to switch themes live. URL is shareable.

Try any theme directly:

| Theme | Style | Preview |
|-------|-------|---------|
| **Wenzi · 文子** | 纸感杂志风，奶油米黄底 + 撞色高光 | [?theme=wenzi](https://zoe.im/nextjs-starter-zoe-app/?theme=wenzi) |
| **WellWell** | 暖橙 + 自然绿，"好好工作 = 好好生活" | [?theme=wellwell](https://zoe.im/nextjs-starter-zoe-app/?theme=wellwell) |
| **Linear** | 深蓝紫，玻璃质感，AI/科技感 | [?theme=linear](https://zoe.im/nextjs-starter-zoe-app/?theme=linear) |
| **Stripe** | 紫青渐变，鲜亮活力 | [?theme=stripe](https://zoe.im/nextjs-starter-zoe-app/?theme=stripe) |
| **Vercel** | 纯黑白，极简开发风 | [?theme=vercel](https://zoe.im/nextjs-starter-zoe-app/?theme=vercel) |
| **Terminal** | 黑底绿字，黑客美学 | [?theme=terminal](https://zoe.im/nextjs-starter-zoe-app/?theme=terminal) |
| **Default** | 优雅中性色调 | [?theme=default](https://zoe.im/nextjs-starter-zoe-app/?theme=default) |

### Real-world sites built with this starter

- **[zoe.im](https://zoe.im)** — Zoe 的个人主页（`default` 主题）
- **[wellwell.work](https://wellwell.work)** — 好好工作 · WellWell Work（`wellwell` 主题）

> 💡 Both sites are pure data repositories — the framework is pulled at build time via GitHub Actions. See [wellwellwork.github.io](https://github.com/wellwellwork/wellwellwork.github.io) for the data-only setup pattern.

---

## Features

- **Config-Driven** — One `zoe-site.yaml` controls site metadata, navigation, sections, themes, and content
- **11 Section Types** — Hero, Features, Logos, Testimonials, Stats, Pricing, FAQ, CTA, Posts, Projects, Contact
- **7 Product-Grade Themes** — From minimal Vercel to magazine-style Wenzi, each with light/dark
- **Static Export** — Pure HTML output, deploy anywhere (Vercel, Netlify, GitHub Pages)
- **Blog System** — MDX/Markdown posts with tags, archives, pinned posts, and drafts
- **Dark Mode** — System-aware light/dark toggle (orthogonal to color themes)
- **SEO Ready** — Auto-generated metadata, Open Graph, sitemap, robots.txt
- **Fully Typed** — TypeScript end-to-end

## Themes

| Theme | Style | Best For |
|-------|-------|----------|
| `default` | Elegant neutral tones | Personal sites, blogs |
| `vercel` | Pure black & white, minimal | Developer tools, documentation |
| `stripe` | Purple-blue gradient, vibrant | SaaS products, landing pages |
| `linear` | Dark, techy, glass morphism | AI/ML startups, tech products |
| `terminal` | Green-on-black, retro | Hacker aesthetic, CLI tools |
| `wellwell` | Warm orange + natural green | Indie studios, build-in-public |
| `wenzi` | Paper-cream + magazine accents | Personal brand, editorial sites |

Set in config:

```yaml
theme: wenzi
```

All themes ship with both light and dark variants. The color theme (e.g. `wenzi`) and light/dark mode are independent — they can be combined freely.

## Section Types

Build your homepage by composing sections in `zoe-site.yaml`:

| Section | Description |
|---------|-------------|
| `hero` | Main banner with badge, typing animation, CTA buttons, optional image/video |
| `features` | Feature grid (cards/icons/bento style, 2-4 columns) |
| `logos` | Logo bar (scrolling or grid) |
| `testimonials` | Customer quotes with avatar, role, company |
| `stats` | Key metrics display |
| `pricing` | Pricing plans with highlighted tier |
| `faq` | Accordion Q&A |
| `cta` | Call-to-action (simple/gradient/card) |
| `posts` | Latest blog posts |
| `projects` | GitHub project showcase |
| `contact` | Contact information |

## Quick Start

```bash
# Clone
npx degit jiusanzhou/nextjs-starter-zoe-app my-site
cd my-site

# Install
pnpm install

# Dev
pnpm dev

# Build (static export to /out)
pnpm build
```

Then edit `zoe-site.yaml` to make it yours.

## Example Configurations

The `examples/` directory includes ready-to-use configs for different use cases:

| File | Site | Theme | Description |
|------|------|-------|-------------|
| `personal-site.yaml` | Zoe | default | Personal blog & portfolio |
| `saas-product.yaml` | FlowAI | stripe | AI workflow automation product |
| `developer-tool.yaml` | DevKit | vercel | Minimal developer tool site |
| `startup.yaml` | NeuralSpace | linear | AI infrastructure startup |

Copy any example to use it:

```bash
cp examples/saas-product.yaml zoe-site.yaml
```

## Configuration

All configuration lives in `zoe-site.yaml`:

```yaml
title: My Product
description: One-line description
theme: stripe
lang: en

navs:
  - title: Product
    href: /#features
  - title: Pricing
    href: /#pricing

sections:
  - type: hero
    badge: "New"
    greeting: Build something great
    description: Your product description here
    cta:
      - text: Get Started
        href: /signup
    align: left

  - type: features
    title: Features
    columns: 3
    style: cards
    items:
      - icon: "\u26A1"
        title: Fast
        description: Blazing fast performance

  - type: pricing
    title: Pricing
    plans:
      - name: Free
        price: "$0"
        features: [Feature A, Feature B]
      - name: Pro
        price: "$29"
        features: [Everything in Free, Feature C]
        highlighted: true
```

See the [example configs](./examples/) for complete reference.

## Content

Add Markdown/MDX files to `content/`:

```
content/
  posts/       # Blog posts
  pages/       # Static pages (about, etc.)
```

Post frontmatter:

```yaml
---
title: My Post
date: 2024-01-01
tags: [ai, automation]
published: true
---
```

## Tech Stack

- **Next.js 16** — App Router, React Server Components, Static Export
- **React 19** — Latest concurrent features
- **Tailwind CSS 4** — Utility-first styling
- **shadcn/ui** — Radix + Tailwind component library
- **MDX 3** — Markdown with JSX
- **TypeScript 5** — Full type safety

## License

MIT © [Zoe](https://zoe.im)
