/**
 * OG image route mirrored under [lang]/blog/[slug].
 *
 * Reuses the same renderer as the default-locale OG image; only the
 * generateStaticParams / param signature differ.
 */

import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import {
  loadZoeConfig,
  getDefaultLocale,
  getLocales,
  isI18nEnabled,
  isValidLocale,
} from "@/lib/zoefile";
import { format } from "date-fns";

export const alt = "Blog post cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface OgImageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams(): Promise<{ lang: string; slug: string }[]> {
  if (!isI18nEnabled()) {
    return [{ lang: "__placeholder__", slug: "__placeholder__" }];
  }
  const def = getDefaultLocale();
  const nonDef = getLocales().filter((l) => l !== def);
  if (nonDef.length === 0) return [{ lang: "__placeholder__", slug: "__placeholder__" }];

  const out: { lang: string; slug: string }[] = [];
  for (const lang of nonDef) {
    const posts = getAllPosts(false, lang);
    if (posts.length === 0) {
      out.push({ lang, slug: "__placeholder__" });
      continue;
    }
    for (const post of posts) {
      out.push({ lang, slug: post.slug });
    }
  }
  return out;
}

const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";
const SANS = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', system-ui, sans-serif";

export default async function OgImage({ params }: OgImageProps) {
  const { lang, slug } = await params;
  const isPlaceholder = !isValidLocale(lang) || lang === getDefaultLocale();
  const locale = isPlaceholder ? undefined : lang;
  const post = isPlaceholder ? undefined : getPostBySlug(slug, locale);
  const config = loadZoeConfig(locale);

  const title = post?.title ?? config.title ?? "Blog";
  const description = post?.description ?? post?.excerpt ?? config.description ?? "";
  const dateStr = post?.date ? format(new Date(post.date), "yyyy.MM.dd") : "";
  const tagList = (post?.tags ?? [])
    .slice(0, 4)
    .map((t) => (typeof t === "string" ? t : t.name));
  const siteUrl = (config.url ?? "https://zoe.im").replace(/^https?:\/\//, "");
  const authorName = config.author?.name ?? config.title ?? "Zoe";
  const tagline =
    config.author?.minibio ??
    "AI Infra Engineer · LLM Serving · GPU / RDMA · Indie Hacker";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: SANS,
          background: "#0a0a0f",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: 64,
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                display: "flex",
                fontFamily: MONO,
                fontSize: 22,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {dateStr}
              {tagList.length > 0 ? `  ·  ${tagList.join(" · ")}` : ""}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: title.length > 60 ? 60 : 72,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: -1,
              }}
            >
              {title}
            </div>
            {description && (
              <div
                style={{
                  display: "flex",
                  fontSize: 28,
                  color: "rgba(255,255,255,0.7)",
                  maxWidth: 1000,
                  lineHeight: 1.4,
                }}
              >
                {description}
              </div>
            )}
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontFamily: MONO,
                fontSize: 20,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: 1,
              }}
            >
              {authorName} · {siteUrl}
              {locale ? ` · ${locale}` : ""}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {tagline}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
