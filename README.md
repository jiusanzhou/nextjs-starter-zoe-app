# nextjs-starter-zoe-app

> 🚀 A modern, YAML-driven site generator based on Next.js + shadcn/ui

## Features

- **YAML Configuration** - Single `zoe-site.yaml` file to configure your entire site
- **Zero-config Content** - Just add Markdown/MDX files to `content/` directory
- **Modern Stack** - Next.js 16, React 19, TypeScript, Tailwind CSS
- **Beautiful UI** - shadcn/ui components (Radix + Tailwind)
- **SEO Ready** - Automatic metadata generation
- **Dark Mode** - Built-in theme support
- **Blog System** - Posts, tags, archives out of the box
- **Projects Showcase** - Display your projects beautifully
- **RSS Feed** - Auto-generated RSS support
- **Type Safe** - Full TypeScript support

## Quick Start

```bash
# Clone the template
npx degit jiusanzhou/nextjs-starter-zoe-app my-site

# Install dependencies
cd my-site
pnpm install

# Start development
pnpm dev
```

## Configuration

Edit `zoe-site.yaml` to customize your site:

```yaml
title: My Site
description: My awesome site
url: https://example.com

author:
  name: Your Name
  email: you@example.com
  avatar: https://github.com/username.png

navs:
  - title: Home
    href: /
  - title: Blog
    href: /blog
  - title: Projects
    href: /projects

blog:
  title: Blog
  description: My thoughts and ideas
  basePath: /blog
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

## Migration from Gatsby

This template is the Next.js successor of `gatsby-starter-zoe-app`. Key differences:

| Feature | Gatsby | Next.js |
|---------|--------|---------|
| UI Library | Chakra UI | shadcn/ui |
| Data Layer | GraphQL | TypeScript |
| Content | MDX 1 | MDX 3 |
| React | 17 | 19 |
| Styling | Emotion | Tailwind |

## License

MIT © [Zoe](https://zoe.im)
