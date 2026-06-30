# GitHub Actions Workflow Templates

Drop-in workflows for repositories that only contain `zoe-site.yaml` + `content/`.
The theme is fetched on-the-fly during build — you don't need to fork or vendor it.

## `deploy-gh-pages.yml`

One-click GitHub Pages deployment. Copy to `.github/workflows/deploy.yml` in your content repo, then:

1. Settings → Pages → Source: **GitHub Actions**
2. Push to `main`

If your repo is `username/my-site`, set `ZOE_BASE_PATH: /my-site` (project pages need a sub-path). For `username.github.io` (user pages), leave it empty.

## `deploy-vercel.yml`

Vercel deployment via the official action. Requires repo secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## `build-only.yml`

CI-only build (no deployment) — useful for PR previews or pre-deploy validation. Uploads the `out/` directory as a workflow artifact.

---

All workflows invoke `scripts/zoe-site.sh build` from the theme repo, which:

1. Clones theme into `~/.cache/zoe-site/` (cached between runs)
2. Auto-detects your `zoe-site.yaml` + `content/` via `ZOE_CONFIG_PATH` / `ZOE_CONTENT_DIRS`
3. Builds with Next.js static export
4. Copies result to `$ZOE_OUTPUT_DIR` (default `./out`)

Override theme via env:

```yaml
env:
  ZOE_THEME_REPO: yourname/your-fork
  ZOE_THEME_BRANCH: main
```
