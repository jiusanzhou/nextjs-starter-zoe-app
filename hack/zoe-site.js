#!/usr/bin/env node
/**
 * zoe-site.js — Next.js 版站点构建脚本
 * 
 * 在内容仓库（如 jiusanzhou.github.io）下运行：
 *   node /path/to/nextjs-starter-zoe-app/hack/zoe-site.js [dev|build]
 * 
 * 或通过 zoe-site.sh 自动拉取主题后运行：
 *   bash <(curl -sSL https://raw.githubusercontent.com/jiusanzhou/nextjs-starter-zoe-app/main/hack/zoe-site.sh) [dev|build]
 * 
 * 做的事情：
 * 1. 如果不在主题目录下 → clone/pull 主题到 /tmp
 * 2. 将内容仓库的 zoe-site.yaml 复制到主题目录
 * 3. 将内容仓库的 content/ 链接到主题目录
 * 4. npm install + next dev/build
 */

const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const print = console.log;

const defaultTheme = "jiusanzhou/nextjs-starter-zoe-app";
const defaultTmpDir = process.env.ZOE_TEMPDIR || "/tmp";
const defaultConfNames = ["zoe-site.yaml", "zoe-site.yml", "zoe-site.json"];

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
  for (const name of defaultConfNames) {
    const p = path.join(contextDir, name);
    if (fileExists(p)) return p;
  }
  return null;
}

function cloneOrPull(theme, target) {
  if (dirExists(target)) {
    print(`📦 Theme exists, skipping pull to preserve local changes`);
  } else {
    let url = theme;
    if (!url.includes("://")) {
      const parts = url.split("/");
      if (parts.length === 1) url = `https://github.com/jiusanzhou/${url}`;
      else if (parts.length === 2) url = `https://github.com/${url}`;
      else url = `https://${url}`;
    }
    print(`📦 Cloning theme: ${url}`);
    execSync(`git clone ${url} ${target}`, { stdio: "inherit" });
  }
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function symlink(src, dest) {
  // remove existing
  try { fs.rmSync(dest, { recursive: true, force: true }); } catch {}
  // Use copy instead of symlink to avoid Turbopack filesystem root issues
  if (fs.statSync(src).isDirectory()) {
    copyDirRecursive(src, dest);
    print(`📁 Copied: ${src} → ${dest}`);
  } else {
    fs.copyFileSync(src, dest);
    print(`📋 Copied: ${src} → ${dest}`);
  }
}

function main() {
  print("🚀 zoe-site (Next.js)\n");

  const contextDir = process.cwd();
  const gitRoot = getGitRoot();
  const isTheme = inThemeDir(defaultTheme, gitRoot);
  const args = process.argv.slice(2);
  const cmd = args[0] || "build";

  // Determine theme directory
  let themeDir;
  if (isTheme) {
    themeDir = gitRoot;
    print(`📂 In theme directory: ${themeDir}`);
  } else {
    const themeName = defaultTheme.split("/").pop();
    themeDir = path.join(defaultTmpDir, "zoe-site", themeName);
    cloneOrPull(defaultTheme, themeDir);
    print(`📂 Theme directory: ${themeDir}`);
  }

  // Find and copy config
  const confFile = findConfig(contextDir);
  if (confFile) {
    const dest = path.join(themeDir, "zoe-site.yaml");
    fs.copyFileSync(confFile, dest);
    print(`📋 Config: ${confFile} → ${dest}`);
  } else {
    print(`⚠️  No zoe-site.yaml found in ${contextDir}`);
  }

  // Link content directories
  const contentSrc = path.join(contextDir, "content");
  if (dirExists(contentSrc)) {
    const contentDest = path.join(themeDir, "content");
    symlink(contentSrc, contentDest);
  }

  // Link images
  const imagesSrc = path.join(contextDir, "images");
  if (dirExists(imagesSrc)) {
    const imagesDest = path.join(themeDir, "public/images");
    // ensure public/ exists
    if (!dirExists(path.join(themeDir, "public"))) {
      fs.mkdirSync(path.join(themeDir, "public"), { recursive: true });
    }
    symlink(imagesSrc, imagesDest);
  }

  // Link CNAME if exists
  const cnameSrc = path.join(contextDir, "CNAME");
  if (fileExists(cnameSrc)) {
    const cnameDest = path.join(themeDir, "public/CNAME");
    fs.copyFileSync(cnameSrc, cnameDest);
    print(`📋 CNAME: ${cnameSrc} → ${cnameDest}`);
  }

  // Change to theme directory
  process.chdir(themeDir);
  print(`\n📂 Working in: ${themeDir}\n`);

  // Install dependencies
  if (!dirExists(path.join(themeDir, "node_modules"))) {
    print("📦 Installing dependencies...");
    execSync("pnpm install", { stdio: "inherit" });
  }

  // Run command
  switch (cmd) {
    case "dev":
    case "develop": {
      const port = args[1] || "3000";
      const host = args[2] || "0.0.0.0";
      print(`🔧 Starting dev server on ${host}:${port}...`);
      spawnSync("npx", ["next", "dev", "-p", port, "-H", host], {
        stdio: "inherit",
        detached: false,
      });
      break;
    }
    case "build": {
      print("🔨 Building...");
      const res = spawnSync("npx", ["next", "build"], {
        stdio: "inherit",
        detached: false,
      });
      if (res.status !== 0) {
        print("❌ Build failed.");
        process.exit(1);
      }
      print(`\n✅ Build complete! Output in: ${path.join(themeDir, "out")}`);
      
      // Copy output to content repo if requested
      const outDir = path.join(themeDir, "out");
      if (dirExists(outDir)) {
        print(`📁 Static files: ${outDir}`);
      }
      break;
    }
    default:
      print(`❓ Unknown command: ${cmd}`);
      print("Usage: zoe-site.js [dev|build]");
      process.exit(1);
  }
}

main();
