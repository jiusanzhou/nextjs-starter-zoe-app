#!/usr/bin/env node
/**
 * zoe-site CLI
 * 
 * 在内容仓库下运行，自动 clone 主题、链接内容、启动 dev/build。
 * 
 * 用法：
 *   npx zoe-site dev [port]
 *   npx zoe-site build
 *   npx zoe-site --help
 */

const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const print = console.log;

const DEFAULT_THEME = "jiusanzhou/nextjs-starter-zoe-app";
const DEFAULT_TMP_DIR = process.env.ZOE_TEMPDIR || "/tmp";
const CONF_NAMES = ["zoe-site.yaml", "zoe-site.yml", "zoe-site.toml", "zoe-site.json"];

function dirExists(p) {
  try { return fs.existsSync(p) && fs.statSync(p).isDirectory(); } catch { return false; }
}

function fileExists(p) {
  try { return fs.existsSync(p) && fs.statSync(p).isFile(); } catch { return false; }
}

function getGitRoot() {
  let c = process.cwd();
  while (c !== "/" && !dirExists(path.join(c, ".git"))) {
    c = path.dirname(c);
  }
  return c === "/" ? null : c;
}

function inThemeDir(theme, gitRoot) {
  if (!gitRoot) return false;
  try {
    const config = fs.readFileSync(path.join(gitRoot, ".git/config"), "utf8");
    return config.includes(theme) || config.includes(theme.split("/").pop());
  } catch { return false; }
}

function findConfig(contextDir) {
  for (const name of CONF_NAMES) {
    const p = path.join(contextDir, name);
    if (fileExists(p)) return p;
  }
  return null;
}

function cloneOrPull(theme, target) {
  if (dirExists(target)) {
    print("📦 Updating theme...");
    try {
      execSync(`cd "${target}" && git pull --autostash`, { stdio: "pipe" });
    } catch (e) {
      print("⚠️  git pull failed, using existing version");
    }
  } else {
    let url = theme;
    if (!url.includes("://")) {
      const parts = url.split("/");
      if (parts.length === 1) url = `https://github.com/jiusanzhou/${url}`;
      else if (parts.length === 2) url = `https://github.com/${url}`;
      else url = `https://${url}`;
    }
    print(`📦 Cloning theme: ${url}`);
    execSync(`git clone "${url}" "${target}"`, { stdio: "inherit" });
  }
}

function copyDir(src, dest) {
  try { fs.rmSync(dest, { recursive: true, force: true }); } catch {}
  fs.cpSync(src, dest, { recursive: true });
}

function showHelp() {
  print(`
zoe-site — 用 nextjs-starter-zoe-app 构建个人站点

用法：
  zoe-site dev [port]     启动开发服务器（默认端口 3000）
  zoe-site build          构建静态站点
  zoe-site --help         显示帮助

在包含 zoe-site.yaml 和 content/ 目录的仓库下运行。
主题会自动 clone 到 /tmp/zoe-site/ 下。

环境变量：
  ZOE_THEME     主题仓库（默认 ${DEFAULT_THEME}）
  ZOE_TEMPDIR   临时目录（默认 /tmp）
`);
}

function main() {
  const args = process.argv.slice(2);
  const cmd = args[0] || "dev";

  if (cmd === "--help" || cmd === "-h" || cmd === "help") {
    showHelp();
    return;
  }

  print("🚀 zoe-site\n");

  const contextDir = process.cwd();
  const gitRoot = getGitRoot();
  const theme = process.env.ZOE_THEME || DEFAULT_THEME;
  const isTheme = inThemeDir(theme, gitRoot);

  // 确定主题目录
  let themeDir;
  if (isTheme) {
    themeDir = gitRoot;
    print(`📂 Already in theme directory`);
  } else {
    const themeName = theme.split("/").pop();
    themeDir = path.join(DEFAULT_TMP_DIR, "zoe-site", themeName);
    cloneOrPull(theme, themeDir);
  }

  // 复制配置
  const confFile = findConfig(contextDir);
  if (confFile) {
    const dest = path.join(themeDir, "zoe-site.yaml");
    fs.copyFileSync(confFile, dest);
    print(`📋 Config: ${path.basename(confFile)}`);
  } else {
    print("⚠️  No zoe-site.yaml found");
  }

  // 链接内容
  const contentSrc = path.join(contextDir, "content");
  if (dirExists(contentSrc)) {
    copyDir(contentSrc, path.join(themeDir, "content"));
    print("📂 Copied: content/");
  }

  // 链接图片
  const imagesSrc = path.join(contextDir, "images");
  if (dirExists(imagesSrc)) {
    const publicDir = path.join(themeDir, "public");
    if (!dirExists(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    copyDir(imagesSrc, path.join(publicDir, "images"));
    print("📂 Copied: images/");
  }

  // 复制 CNAME
  const cnameSrc = path.join(contextDir, "CNAME");
  if (fileExists(cnameSrc)) {
    const publicDir = path.join(themeDir, "public");
    if (!dirExists(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    fs.copyFileSync(cnameSrc, path.join(publicDir, "CNAME"));
    print("📋 CNAME");
  }

  // 切换到主题目录
  process.chdir(themeDir);
  print(`\n📂 Theme: ${themeDir}\n`);

  // 安装依赖
  if (!dirExists(path.join(themeDir, "node_modules"))) {
    print("📦 Installing dependencies...");
    execSync("pnpm install", { stdio: "inherit" });
  }

  // 执行命令
  switch (cmd) {
    case "dev":
    case "develop": {
      const port = args[1] || "3000";
      const host = "0.0.0.0";
      print(`🔧 Dev server → http://localhost:${port}\n`);
      spawnSync("npx", ["next", "dev", "-p", port, "-H", host], {
        stdio: "inherit",
        detached: false,
      });
      break;
    }
    case "build": {
      print("🔨 Building...\n");
      const res = spawnSync("npx", ["next", "build"], {
        stdio: "inherit",
        detached: false,
      });
      if (res.status !== 0) {
        print("\n❌ Build failed.");
        process.exit(1);
      }
      print(`\n✅ Build complete → ${path.join(themeDir, "out")}`);
      break;
    }
    default:
      print(`❓ Unknown command: ${cmd}`);
      showHelp();
      process.exit(1);
  }
}

main();
