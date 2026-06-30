# Deployment

This theme is **content-agnostic**: your repo only needs `zoe-site.yaml` + `content/`. The theme is pulled at build time, no fork required.

## The One-Liner

```bash
curl -sSL https://git.io/zoe-site | bash -s build
```

Run this in any directory containing `zoe-site.yaml`. The script:

1. Clones the theme into `~/.cache/zoe-site/` (cached on subsequent runs)
2. Auto-detects `zoe-site.yaml` and `content/` (or `src/content/`, `posts/`) in `$PWD`
3. Injects them into the theme via `ZOE_CONFIG_PATH` + `ZOE_CONTENT_DIRS` env vars
4. Runs `next build` with static export
5. Copies output to `$ZOE_OUTPUT_DIR` (default `$PWD/out`)

## Local Workflow

```bash
# 1. Scaffold a new project
curl -sSL https://git.io/zoe-site | bash -s new my-site
cd my-site

# 2. Dev server
curl -sSL https://git.io/zoe-site | bash -s dev

# 3. Build for production
curl -sSL https://git.io/zoe-site | bash -s build
# → out/ contains the static site
```

For convenience, save the script locally and put it on `$PATH`:

```bash
curl -sSL https://git.io/zoe-site -o ~/.local/bin/zoe-site && chmod +x ~/.local/bin/zoe-site

zoe-site dev
zoe-site build
```

## CI Integration

Three ready-to-use GitHub Actions workflows live in [`examples/github-actions/`](../examples/github-actions/):

| Workflow | Use case |
|---|---|
| `deploy-gh-pages.yml` | One-click GitHub Pages |
| `deploy-vercel.yml` | Vercel deploy via `amondnet/vercel-action` |
| `build-only.yml` | PR preview / validation (uploads artifact) |

Copy one to `.github/workflows/deploy.yml` in your content repo and push.

### GitHub Pages — project pages (sub-path)

If your repo is `user/my-site` (deploys to `user.github.io/my-site/`):

```yaml
env:
  ZOE_BASE_PATH: /my-site
```

### GitHub Pages — user pages (root)

If your repo is `user/user.github.io` (deploys to `user.github.io/`):

```yaml
env:
  ZOE_BASE_PATH: ""
```

### Custom theme fork

Point the build at your own fork:

```yaml
env:
  ZOE_THEME_REPO: yourname/your-fork
  ZOE_THEME_BRANCH: production
```

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `ZOE_THEME_REPO`    | `jiusanzhou/nextjs-starter-zoe-app` | Theme repo (`owner/name`) |
| `ZOE_THEME_BRANCH`  | `main`        | Theme branch / tag |
| `ZOE_CACHE_DIR`     | `~/.cache/zoe-site` | Where the theme is cached |
| `ZOE_OUTPUT_DIR`    | `$PWD/out`    | Where the built site is copied |
| `ZOE_BASE_PATH`     | *(empty)*     | URL sub-path (e.g. `/my-site`) |
| `ZOE_CONFIG_PATH`   | *(auto)*      | Absolute path to user's `zoe-site.yaml` |
| `ZOE_CONTENT_DIRS`  | *(auto)*      | Comma-separated absolute paths to content dirs |
| `GITHUB_TOKEN`      | *(optional)*  | Bumps API rate limit for `/releases` page |

## Repo Layout (User Side)

The minimal content-only repo:

```
my-site/
├── zoe-site.yaml
├── content/
│   ├── posts/
│   │   └── hello.md
│   └── pages/
│       └── about.md
├── .github/workflows/deploy.yml  ← copy from examples/github-actions/
└── .gitignore                    (node_modules, out, .next, .cache)
```

Nothing else. No `package.json`, no `node_modules`, no theme code.

## Manual Deploy (No Script)

If you'd rather drive Next.js directly without `zoe-site.sh`:

```bash
git clone https://github.com/jiusanzhou/nextjs-starter-zoe-app.git theme
cd theme
pnpm install

# Point at your content
export ZOE_CONFIG_PATH=/path/to/your/zoe-site.yaml
export ZOE_CONTENT_DIRS=/path/to/your/content

pnpm build
# Output: ./out
```

This is what the script does under the hood — the env-var contract is stable.

## Troubleshooting

**`Build output not found at $THEME_DIR/out`** — Static export is disabled in dev. Make sure `NODE_ENV=production` (default for `pnpm build`) and that `next.config.ts` has `output: "export"`.

**`Configuration file not found`** — No `zoe-site.yaml` in `$PWD`. Either run the script from a directory containing it, or set `ZOE_CONFIG_PATH` explicitly.

**Cached theme is stale** — Bust the cache:

```bash
rm -rf ~/.cache/zoe-site
```

**GitHub API rate limit on `/releases`** — Set `GITHUB_TOKEN` in CI secrets (the workflow already wires `secrets.GITHUB_TOKEN`).
