/**
 * i18n lib 行为快速验证脚本（手动跑）
 *
 * 步骤：
 *   1. 临时往 _example/zoe-site.yaml 注入 i18n 配置
 *   2. 临时往 _example/content/posts 加一个 lang: en 的小文件
 *   3. require lib，断言行为
 *   4. 还原现场
 *
 * 用法：
 *   USE_EXAMPLE_CONTENT=true npx tsx scripts/i18n-smoke.ts
 */
/* eslint-disable @typescript-eslint/no-require-imports */

import fs from 'fs';
import path from 'path';

const root = path.resolve(__dirname, '..');
const exampleConfigPath = path.join(root, '_example/zoe-site.yaml');
const exampleConfigBackup = exampleConfigPath + '.bak.smoke';
const examplePostsDir = path.join(root, '_example/content/posts');
const tempPostZh = path.join(examplePostsDir, '__smoke-i18n.md');
const tempPostEn = path.join(examplePostsDir, '__smoke-i18n.en.md');

function fail(msg: string): never {
  console.error('❌ ' + msg);
  process.exit(1);
}

function ok(msg: string) {
  console.log('✅ ' + msg);
}

async function run() {
  // 1. backup + 注入 i18n 配置
  const originalConfig = fs.readFileSync(exampleConfigPath, 'utf-8');
  fs.writeFileSync(exampleConfigBackup, originalConfig);

  const patchedConfig = originalConfig + `

# --- smoke test i18n injection ---
i18n:
  enabled: true
  locales:
    - zh
    - en
  defaultLocale: zh
  routing: prefix-except-default
  localeNames:
    zh: 中文
    en: English
  overrides:
    en:
      title: "Smoke EN Title"
      description: "Smoke EN description"
      labels:
        blog: "Blog (EN smoke)"
`;
  fs.writeFileSync(exampleConfigPath, patchedConfig);

  // 2. 加两篇配对文章
  fs.writeFileSync(
    tempPostZh,
    `---
title: 烟雾测试·中文
slug: smoke-i18n-pair
lang: zh
published: true
date: 2026-06-30
---

中文正文。
`
  );
  fs.writeFileSync(
    tempPostEn,
    `---
title: Smoke i18n · EN
slug: smoke-i18n-pair-en
lang: en
translationOf: smoke-i18n-pair
published: true
date: 2026-06-30
---

English body.
`
  );

  process.env.USE_EXAMPLE_CONTENT = 'true';

  // 重新清缓存（zoefile cache + content cache）
  const zoefile = require('../src/lib/zoefile') as typeof import('../src/lib/zoefile');
  zoefile.__resetZoeConfigCache?.();

  // 3. 断言
  const i18nEnabled = zoefile.isI18nEnabled();
  if (!i18nEnabled) fail('isI18nEnabled should be true');
  ok('isI18nEnabled === true');

  const locales = zoefile.getLocales();
  if (locales.join(',') !== 'zh,en') fail(`locales expected [zh,en], got ${locales.join(',')}`);
  ok(`locales = ${JSON.stringify(locales)}`);

  const def = zoefile.getDefaultLocale();
  if (def !== 'zh') fail(`defaultLocale expected zh, got ${def}`);
  ok(`defaultLocale = ${def}`);

  const cfgZh = zoefile.loadZoeConfig('zh');
  const cfgEn = zoefile.loadZoeConfig('en');

  if (cfgEn.title !== 'Smoke EN Title') fail(`cfgEn.title expected override, got ${cfgEn.title}`);
  if (cfgZh.title === 'Smoke EN Title') fail(`cfgZh.title should NOT be EN override, got ${cfgZh.title}`);
  ok(`cfgEn.title overridden, cfgZh.title preserved`);

  if (cfgEn.lang !== 'en') fail(`cfgEn.lang should be 'en', got ${cfgEn.lang}`);
  if (cfgZh.lang !== 'zh') fail(`cfgZh.lang should be 'zh', got ${cfgZh.lang}`);
  ok(`config.lang set correctly per locale`);

  const i18nLib = require('../src/lib/i18n') as typeof import('../src/lib/i18n');
  const labelEn = i18nLib.getLabel(cfgEn, 'blog');
  const labelZh = i18nLib.getLabel(cfgZh, 'blog');
  if (labelEn !== 'Blog (EN smoke)') fail(`getLabel(en,blog) expected 'Blog (EN smoke)', got '${labelEn}'`);
  if (labelZh !== 'Blog') fail(`getLabel(zh,blog) expected default 'Blog', got '${labelZh}'`);
  ok(`getLabel respects per-locale labels`);

  // localePrefix
  const prefixZh = zoefile.getLocalePrefix('zh');
  const prefixEn = zoefile.getLocalePrefix('en');
  if (prefixZh !== '') fail(`getLocalePrefix('zh') expected '' (prefix-except-default), got '${prefixZh}'`);
  if (prefixEn !== '/en') fail(`getLocalePrefix('en') expected '/en', got '${prefixEn}'`);
  ok(`getLocalePrefix: zh='', en='/en'`);

  // content 层
  const content = require('../src/lib/content') as typeof import('../src/lib/content');

  const allPosts = content.getAllPosts(false); // 不过滤
  const zhPosts = content.getAllPosts(false, 'zh');
  const enPosts = content.getAllPosts(false, 'en');

  const smokeZh = zhPosts.find((p) => p.slug === 'smoke-i18n-pair');
  const smokeEn = enPosts.find((p) => p.slug === 'smoke-i18n-pair-en');
  if (!smokeZh) fail('zh-filtered should include smoke-i18n-pair');
  if (!smokeEn) fail('en-filtered should include smoke-i18n-pair-en');
  if (zhPosts.find((p) => p.slug === 'smoke-i18n-pair-en')) fail('zh-filtered should NOT include EN post');
  if (enPosts.find((p) => p.slug === 'smoke-i18n-pair')) fail('en-filtered should NOT include ZH post');
  ok(`content getAllPosts(locale) filters correctly`);

  if (smokeZh.lang !== 'zh') fail(`zh post lang missing, got ${smokeZh.lang}`);
  if (smokeEn.lang !== 'en') fail(`en post lang missing, got ${smokeEn.lang}`);
  if (smokeEn.translationOf !== 'smoke-i18n-pair')
    fail(`translationOf missing on en post, got ${smokeEn.translationOf}`);
  ok(`post lang + translationOf set`);

  const translations = content.getPostTranslations(smokeZh);
  if (translations.size !== 2) fail(`expected 2 translations, got ${translations.size}`);
  if (!translations.get('zh') || !translations.get('en')) fail('translations missing zh or en');
  ok(`getPostTranslations returns Map with zh+en`);

  // 未传 locale 时应保留旧行为：返回所有内容（含 zh + en）
  if (allPosts.length < zhPosts.length + enPosts.length - allPosts.length /* 容差 */) {
    // pass: 不严格断言，但至少包含两篇 smoke
  }
  const hasBothInAll =
    allPosts.find((p) => p.slug === 'smoke-i18n-pair') &&
    allPosts.find((p) => p.slug === 'smoke-i18n-pair-en');
  if (!hasBothInAll) fail('getAllPosts() (no locale) should return all language posts');
  ok(`getAllPosts() without locale returns all langs (backward compat)`);

  console.log('\n🎉 All i18n foundation smoke checks passed.');
}

run()
  .catch((e) => {
    console.error('Smoke run failed:', e);
    process.exitCode = 1;
  })
  .finally(() => {
    // 还原现场
    if (fs.existsSync(exampleConfigBackup)) {
      fs.copyFileSync(exampleConfigBackup, exampleConfigPath);
      fs.unlinkSync(exampleConfigBackup);
    }
    if (fs.existsSync(tempPostZh)) fs.unlinkSync(tempPostZh);
    if (fs.existsSync(tempPostEn)) fs.unlinkSync(tempPostEn);
  });
