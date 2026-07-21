import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics, PlausibleAnalytics } from "@/components/analytics";
import { loadZoeConfig, getSiteMetadata } from "@/lib/zoefile";
import type { ZoeSiteConfig } from "@/types";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteMetadata();

  // Favicon 解析优先级：config.logo > author.avatar > 内置兜底文件
  const mimeByExt: Record<string, string> = {
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    ico: "image/x-icon",
    gif: "image/gif",
  };
  const guessMime = (src: string): string | undefined => {
    const m = src.match(/\.([a-z0-9]+)(?:\?.*)?$/i);
    return m ? mimeByExt[m[1].toLowerCase()] : undefined;
  };

  const customIconSrc = site.logo || site.author?.avatar;
  const iconList = customIconSrc
    ? [
        { url: customIconSrc, type: guessMime(customIconSrc) },
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ]
    : [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ];
  const appleIcon = customIconSrc || "/apple-touch-icon.png";

  // Homepage `<title>` = "Title — Slogan" when a slogan is configured;
  // per-page titles still use the `%s | Title` template so we don't
  // leak the slogan onto every blog post.
  const homeTitle = site.slogan
    ? `${site.title} — ${site.slogan}`
    : site.title;

  return {
    title: {
      default: homeTitle,
      template: `%s | ${site.title}`,
    },
    description: site.description,
    metadataBase: site.url ? new URL(site.url) : undefined,
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: site.title,
    },
    formatDetection: { telephone: false },
    icons: {
      icon: iconList,
      shortcut: customIconSrc || "/favicon.ico",
      apple: appleIcon,
    },
    openGraph: {
      title: homeTitle,
      description: site.description,
      url: site.url,
      siteName: site.title,
      locale: site.lang,
      type: "website",
      images: site.image
        ? [{ url: site.image, alt: site.title, width: 1200, height: 630 }]
        : site.author?.avatar
          ? [{ url: site.author.avatar, alt: site.title }]
          : site.logo
            ? [{ url: site.logo, alt: site.title }]
            : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: homeTitle,
      description: site.description,
      creator: site.author?.twitter ? `@${site.author.twitter}` : undefined,
      images: site.image
        ? [site.image]
        : site.author?.avatar
          ? [site.author.avatar]
          : site.logo
            ? [site.logo]
            : undefined,
    },
    // NOTE: 不在 root layout 设 canonical。
    // 原因：Next.js metadata.alternates.canonical 会**继承**到所有子路由，
    // 结果全站 canonical 都指首页 → Google 判定全站为首页的重复内容，拒绝索引。
    // 每个路由自己的 generateMetadata 应该通过 buildAlternates(path, locale) 生成 canonical。
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...buildVerification(site.verification),
  };
}

/**
 * Map zoe-site `verification` config → Next.js Metadata.verification.
 */
function buildVerification(v: ZoeSiteConfig["verification"]) {
  if (!v) return {};

  const nativeKeys = ["google", "yahoo", "yandex"] as const;
  const customMetaName: Record<string, string> = {
    bing: "msvalidate.01",
    baidu: "baidu-site-verification",
    "360": "360-site-verification",
    sogou: "sogou_site_verification",
    shenma: "shenma-site-verification",
    naver: "naver-site-verification",
    pinterest: "p:domain_verify",
    facebook: "facebook-domain-verification",
  };

  const metadataVerification: {
    google?: string | string[];
    yahoo?: string | string[];
    yandex?: string | string[];
    other: Record<string, string | string[]>;
  } = { other: {} };

  for (const k of nativeKeys) {
    const val = v[k];
    if (val !== undefined && val !== null && val !== "") {
      metadataVerification[k] = val;
    }
  }
  for (const [k, metaName] of Object.entries(customMetaName)) {
    const val = (v as Record<string, unknown>)[k];
    if (typeof val === "string" && val) {
      metadataVerification.other[metaName] = val;
    } else if (Array.isArray(val) && val.length) {
      metadataVerification.other[metaName] = val as string[];
    }
  }
  if (v.other) {
    for (const [k, val] of Object.entries(v.other)) {
      if (typeof val === "string" && val) {
        metadataVerification.other[k] = val;
      } else if (Array.isArray(val) && val.length) {
        metadataVerification.other[k] = val;
      }
    }
  }
  if (Object.keys(metadataVerification.other).length === 0) {
    delete (metadataVerification as Partial<typeof metadataVerification>).other;
  }
  return Object.keys(metadataVerification).length
    ? { verification: metadataVerification }
    : {};
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = loadZoeConfig();
  const themeClass = config.theme ? `theme-${config.theme}` : "";

  return (
    <html lang={config.lang || "en"} className={themeClass} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Analytics（全局） */}
          {config.analytics?.googleId && (
            <GoogleAnalytics measurementId={config.analytics.googleId} />
          )}
          {config.analytics?.plausibleDomain && (
            <PlausibleAnalytics domain={config.analytics.plausibleDomain} />
          )}
          {/*
            站点视觉外壳（Header/Footer/JSON-LD/...）由各 route group 的 layout
            提供：默认 locale 走 `(site)/layout.tsx`，非默认 locale 走 `[lang]/layout.tsx`。
          */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
