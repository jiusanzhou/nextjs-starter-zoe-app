---
title: 帮助中心
slug: help-center
layout: default
description: 帮助中心 - 常见问题解答
---

# 帮助中心

欢迎来到帮助中心！

这里汇集了常见问题的解答，帮助你更好地使用我们的产品和服务。

## 如何使用帮助中心

1. 浏览下方的分类找到你需要的帮助主题
2. 使用搜索功能快速定位问题
3. 如果找不到答案，可以通过 GitHub Issues 提交问题

## 配置帮助中心

在 `zoe-site.yaml` 中添加以下配置：

```yaml
helpqa:
  repo: owner/repo
  labelPrefix: help
```

然后在 GitHub 仓库中：

1. 创建以 `help:` 为前缀的 Labels（如 `help:常见问题`、`help:使用入门`）
2. 创建 Issues 并打上对应的 Label
3. 将 Issue assign 给某人即可标记为"热门问题"

---

*访问 [/help](/help) 查看完整的帮助中心*
