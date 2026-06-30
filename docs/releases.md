# Releases Landing Page

A built-in `/releases` landing page that aggregates app downloads and release notes from one or more GitHub / Gitee repositories. Zero code, fully themed, automatic markdown rendering.

## Quick Start

Add `releaseRepo` to your `zoe-site.yaml`:

```yaml
# Single repo (shorthand)
releaseRepo: "owner/repo"
```

Visit `/releases` — that's it. Latest version + all release history + multi-platform download buttons + markdown-rendered release notes.

## Configuration

### Single repository

```yaml
releaseRepo: "siyuan-note/siyuan"
```

This expands to `provider: github` automatically.

### Multiple repositories (with Gitee mirror)

```yaml
releaseRepo:
  - provider: github
    repo: jiusanzhou/myapp
  - provider: gitee
    repo: jiusanzhou/myapp
```

Releases from all sources are merged and sorted by `published_at` descending. The latest release across all repos becomes the featured version in the hero.

### Custom asset matching

By default, assets are matched against a sensible pattern set:

| Platform | Default regex (case-insensitive)            |
|----------|---------------------------------------------|
| android  | `\.apk$`                                    |
| ios      | `\.ipa$`                                    |
| macos    | `(darwin\|macos\|osx\|\.dmg$\|\.pkg$)`      |
| windows  | `(windows\|win32\|win64\|win-\|\.exe$\|\.msi$)` |
| linux    | `(linux\|\.AppImage$\|\.deb$\|\.rpm$)`      |

Override per-repo when your release artifacts use non-standard names:

```yaml
releaseRepo:
  - provider: github
    repo: owner/repo
    assetRegexPatterns:
      android: "myapp-android-.*\\.apk$"
      macos: "myapp-mac-(arm64|x64)\\.dmg$"
      windows: "myapp-win-x64-setup\\.exe$"
```

Keys become the labels in the download button group (`android`, `macos`, `windows`, `linux`, `ios`, or any custom key like `apk` / `dmg` / `exe`).

## Embedded `<AppRelease />` (MDX)

Use the `AppRelease` component inside any MDX post/page to embed a compact download button group:

```mdx
<AppRelease repo="owner/repo" />

<AppRelease
  repo="owner/repo"
  platforms={["android", "ios"]}
  hideUnsupported
/>

<!-- Or fully manual URLs (no API call) -->
<AppRelease
  urls={{
    android: "https://example.com/app.apk",
    ios: "https://apps.apple.com/...",
  }}
/>
```

This is **client-side** (fetches on render) and is separate from the `/releases` landing page (server-side, ISR-cached).

## Meta override (advanced)

You can override version metadata directly inside a GitHub release body using a YAML code block. Useful when your release has a tag like `v3.7.0-rc.1` but you want the page to show `3.7 RC`:

````markdown
## v3.7.0 release notes

Awesome changes here...

```yaml version
version: "3.7 RC"
assets:
  android: https://cdn.example.com/myapp-3.7-rc.apk
  macos: https://cdn.example.com/myapp-3.7-rc.dmg
urls:
  Homebrew: https://brew.sh/myapp
  AppStore: https://apps.apple.com/...
```
````

Fields supported in the meta block:

- `version` — Display version, overrides `tag_name`
- `assets` — Map of platform → download URL (merged with auto-matched assets)
- `urls` — Map of label → URL, rendered as ghost buttons (e.g., Homebrew / AppStore links)

The meta block is automatically stripped from the rendered release notes.

## GitHub API rate limit

Unauthenticated requests are capped at **60 req/h** per IP. For production builds (especially with multiple repos or frequent rebuilds), set:

```bash
GITHUB_TOKEN=ghp_xxx
```

The token is sent as `Authorization: Bearer ${token}` and bumps the limit to **5000 req/h**. A read-only fine-grained token is sufficient.

## Caching

All release fetches use Next.js ISR with `revalidate: 3600` (1 hour). Static export users will get a snapshot at build time; SSR/ISR users get hourly refresh automatically.

## i18n

All UI labels are i18n-aware via `getLabel()`:

- `releases` — Page title (default: `Downloads`)
- `releases.description` — Page subtitle
- `releases.latest` — Badge on the latest version card
- `releases.prerelease` — Badge on prerelease versions
- `releases.notes` — Toggle button for release notes
- `releases.showAll` — Pagination CTA (supports `{count}` variable)
- `releases.unitVersion` / `unitRepo` / `unitDownload` — Stats line units

Override any label in `zoe-site.yaml`:

```yaml
labels:
  releases: "下载"
  releases.description: "下载最新版本"
  releases.latest: "最新"
  releases.notes: "更新日志"
  releases.unitVersion: "个版本"
```

## Architecture

```
src/
├── app/releases/page.tsx         # /releases page (Server Component + ISR)
├── components/
│   ├── release-card.tsx          # Card + List (used by /releases)
│   └── app-release.tsx           # MDX component (client-side)
├── lib/release.ts                # GitHub/Gitee fetchers + markdown renderer
└── types/release.ts              # Release / ReleaseConfig types
```

- **Server-rendered**: `/releases` markdown notes are pre-rendered with `remark + remark-gfm` at build/ISR time, no client-side markdown parsing
- **Code highlighting**: Inherits the project's shiki-based highlighter via `markdownToHtml()`
- **No JS for downloads**: Plain `<a href>` links, works without hydration
