import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics, PlausibleAnalytics } from "@/components/analytics";
import { GoTop } from "@/components/go-top";
import { loadZoeConfig, getSiteMetadata } from "@/lib/zoefile";
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
    openGraph: {
      title: site.title,
      description: site.description,
      url: site.url,
      siteName: site.title,
      locale: site.lang,
      type: "website",
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
          />
          <main className="flex-1 container py-6 md:py-8 lg:py-10">{children}</main>
          <Footer
            organization={config.organization}
            copyright={config.copyright}
            socials={config.socials}
            author={config.author}
            links={config.links}
          />
          <GoTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
