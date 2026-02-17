---
title: 使用 Next.js 构建现代化博客
description: 本文介绍如何使用 nextjs-starter-zoe-app 快速搭建个人博客
date: 2026-02-15
tags:
  - Next.js
  - React
  - 教程
published: true
---

# 使用 Next.js 构建现代化博客

在这篇文章中，我将分享如何使用 **nextjs-starter-zoe-app** 快速搭建一个功能完善的个人博客。

## 为什么选择 Next.js？

Next.js 是目前最流行的 React 框架之一，它提供了：

1. **服务端渲染 (SSR)** - 更好的 SEO
2. **静态生成 (SSG)** - 极致的性能
3. **增量静态再生 (ISR)** - 兼顾动态和性能
4. **App Router** - 更直观的路由系统

## 快速开始

```bash
# 克隆模板
npx degit jiusanzhou/nextjs-starter-zoe-app my-blog

# 安装依赖
cd my-blog
pnpm install

# 启动开发服务器
pnpm dev
```

## 配置站点

编辑 `zoe-site.yaml` 文件：

```yaml
title: 我的博客
description: 分享技术与生活

author:
  name: 你的名字
  email: you@example.com
```

## 添加文章

在 `content/posts/` 目录下创建 Markdown 文件即可。

---

祝你搭建顺利！🎉
