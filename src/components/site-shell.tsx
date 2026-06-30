/**
 * <SiteShell />
 * 站点视觉外壳：Header / 主区 / Footer / JSON-LD / GoTop / ThemeSwitcher
 *
 * 不渲染 <html><body>，那是根 layout 的事。
 *
 * 接受 `locale`：在该 locale 下加载 config 并渲染所有 i18n-aware 部件。
 * 默认 locale 路径走 `(site)/layout.tsx`，非默认 locale 走 `[lang]/layout.tsx`。
 */

import { Header, Footer } from "@/components/layout";
import { GoTop } from "@/components/go-top";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { DemoBanner } from "@/components/demo-banner";
import { LanguageSwitcher } from "@/components/language-switcher";
import { loadZoeConfig, isI18nEnabled, getLocales, getDefaultLocale } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";

interface SiteShellProps {
  locale?: string;
  children: React.ReactNode;
}

export function SiteShell({ locale, children }: SiteShellProps) {
  const config = loadZoeConfig(locale);

  // Demo 模式（_example 内容）
  const isDemoMode = process.env.USE_EXAMPLE_CONTENT === "true";

  // 语言切换器仅在 i18n 启用且 locales 多于 1 个时显示
  const showLanguageSwitcher = isI18nEnabled() && getLocales().length > 1;
  const i18nLocales = showLanguageSwitcher ? getLocales() : [];
  const i18nDefaultLocale = showLanguageSwitcher ? getDefaultLocale() : undefined;
  const i18nLocaleNames = showLanguageSwitcher ? config.i18n?.localeNames : undefined;
  const currentLocale = locale || i18nDefaultLocale;

  // Build Person/WebSite JSON-LD
  const author = config.author;
  const sameAs: string[] = [];
  if (author?.github) sameAs.push(`https://github.com/${author.github}`);
  if (author?.twitter) sameAs.push(`https://twitter.com/${author.twitter}`);
  if (author?.linkedin) sameAs.push(`https://www.linkedin.com/in/${author.linkedin}`);
  if (config.socials) {
    for (const [, v] of Object.entries(config.socials)) {
      if (typeof v === "string" && v.startsWith("http") && !sameAs.includes(v)) {
        sameAs.push(v);
      }
    }
  }

  const jsonLdGraph: Record<string, unknown>[] = [];
  if (author?.name) {
    jsonLdGraph.push({
      "@type": "Person",
      "@id": `${config.url || ""}#person`,
      name: author.name,
      url: author.homepage || config.url,
      image: author.avatar,
      email: author.email ? `mailto:${author.email}` : undefined,
      jobTitle: author.minibio,
      sameAs: sameAs.length ? sameAs : undefined,
    });
  }
  if (config.url) {
    jsonLdGraph.push({
      "@type": "WebSite",
      "@id": `${config.url}#website`,
      url: config.url,
      name: config.title,
      description: config.description,
      inLanguage: config.lang,
      author: author?.name ? { "@id": `${config.url}#person` } : undefined,
    });
  }
  const jsonLd =
    jsonLdGraph.length > 0
      ? { "@context": "https://schema.org", "@graph": jsonLdGraph }
      : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd, (_k, v) => (v === undefined ? undefined : v)),
          }}
        />
      )}
      {/*
        Static export 下根 layout 无法感知 locale，所以 <html lang> 由 root layout
        写死为默认 locale。这里用一段轻量脚本在客户端修正 documentElement.lang，
        并同步 <meta http-equiv="content-language">（爬虫和无 JS 客户端的兜底）。
      */}
      {currentLocale && (
        <>
          <meta httpEquiv="content-language" content={currentLocale} />
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `document.documentElement.lang=${JSON.stringify(currentLocale)};`,
            }}
          />
        </>
      )}
      {isDemoMode && <DemoBanner />}
      <Header
        title={config.title}
        logo={config.logo}
        version={config.version}
        navs={config.navs}
        moreLabel={getLabel(config, "header.more")}
        rightSlot={
          showLanguageSwitcher && currentLocale ? (
            <LanguageSwitcher
              currentLocale={currentLocale}
              locales={i18nLocales}
              defaultLocale={i18nDefaultLocale!}
              localeNames={i18nLocaleNames}
            />
          ) : undefined
        }
      />
      <main className="flex-1 container py-6 md:py-8 lg:py-10">{children}</main>
      <Footer
        organization={{
          name: config.title || "",
          ...config.organization,
          logo: config.logo || config.organization?.logo,
        }}
        copyright={config.copyright}
        socials={{
          ...config.socials,
          ...(config.author?.email ? { email: config.author.email } : {}),
          ...(config.author?.wechat ? { wechat: config.author.wechat } : {}),
        }}
        links={config.links}
        wechatScanLabel={getLabel(config, "footer.wechatScan")}
      />
      <GoTop />
      {isDemoMode && <ThemeSwitcher />}
    </>
  );
}
