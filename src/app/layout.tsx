import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics, PlausibleAnalytics } from "@/components/analytics";
import { GoTop } from "@/components/go-top";
import { loadZoeConfig, getSiteMetadata } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
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
  // 支持的扩展名 → MIME type 映射
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
        // 用户自定义头像/logo 作为主 icon
        { url: customIconSrc, type: guessMime(customIconSrc) },
        // 兜底：保留内置 favicon，用于不支持外链的浏览器
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ]
    : [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ];
  const appleIcon = customIconSrc || "/apple-touch-icon.png";

  return {
    title: {
      default: site.title,
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
    formatDetection: {
      telephone: false,
    },
    icons: {
      icon: iconList,
      shortcut: customIconSrc || "/favicon.ico",
      apple: appleIcon,
    },
    openGraph: {
      title: site.title,
      description: site.description,
      url: site.url,
      siteName: site.title,
      locale: site.lang,
      type: "website",
      images: site.image
        ? [{ url: site.image, alt: site.title, width: 1200, height: 630 }]
        : site.author?.avatar
          ? [
              {
                url: site.author.avatar,
                alt: site.title,
              },
            ]
          : site.logo
            ? [{ url: site.logo, alt: site.title }]
            : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
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
    alternates: site.url
      ? {
          canonical: site.url,
        }
      : undefined,
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
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = loadZoeConfig();
  const themeClass = config.theme ? `theme-${config.theme}` : '';

  // Build Person/WebSite JSON-LD
  const author = config.author;
  const sameAs: string[] = [];
  if (author?.github) sameAs.push(`https://github.com/${author.github}`);
  if (author?.twitter) sameAs.push(`https://twitter.com/${author.twitter}`);
  if (author?.linkedin) sameAs.push(`https://www.linkedin.com/in/${author.linkedin}`);
  if (config.socials) {
    for (const [k, v] of Object.entries(config.socials)) {
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
      ? {
          "@context": "https://schema.org",
          "@graph": jsonLdGraph,
        }
      : null;

  return (
    <html lang={config.lang || "en"} className={themeClass} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd, (_k, v) => (v === undefined ? undefined : v)),
            }}
          />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Analytics */}
          {config.analytics?.googleId && (
            <GoogleAnalytics measurementId={config.analytics.googleId} />
          )}
          {config.analytics?.plausibleDomain && (
            <PlausibleAnalytics domain={config.analytics.plausibleDomain} />
          )}
          <Header
            title={config.title}
            logo={config.logo}
            version={config.version}
            navs={config.navs}
            moreLabel={getLabel(config, 'header.more')}
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
            wechatScanLabel={getLabel(config, 'footer.wechatScan')}
          />
          <GoTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
