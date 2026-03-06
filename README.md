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

## Features

- **Config-Driven** — One `zoe-site.yaml` controls site metadata, navigation, sections, themes, and content
- **11 Section Types** — Hero, Features, Logos, Testimonials, Stats, Pricing, FAQ, CTA, Posts, Projects, Contact
- **3 Product-Grade Themes** — Stripe (purple-blue gradient), Vercel (minimal black & white), Linear (dark tech)
- **Static Export** — Pure HTML output, deploy anywhere (Vercel, Netlify, GitHub Pages)
- **Blog System** — MDX/Markdown posts with tags, archives, pinned posts, and drafts
- **Dark Mode** — System-aware light/dark toggle
- **SEO Ready** — Auto-generated metadata, Open Graph, sitemap, robots.txt
- **Fully Typed** — TypeScript end-to-end

## Themes

| Theme | Style | Best For |
|-------|-------|----------|
| `stripe` | Purple-blue gradient, vibrant | SaaS products, landing pages |
| `vercel` | Pure black & white, minimal | Developer tools, documentation |
| `linear` | Dark, techy, sleek | AI/ML startups, tech products |
| `default` | Elegant neutral tones | Personal sites, blogs |
| `terminal` | Green-on-black, retro | Hacker aesthetic |

Set in config:

```yaml
theme: stripe
```

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
