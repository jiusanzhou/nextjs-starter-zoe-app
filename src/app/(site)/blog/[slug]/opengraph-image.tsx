import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { loadZoeConfig, getLocales, isI18nEnabled } from "@/lib/zoefile";
import { format } from "date-fns";

export const alt = "Blog post cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  // 包含所有 locale 的 posts，让任一 slug 都能命中
  if (isI18nEnabled()) {
    const seen = new Set<string>();
    const out: { slug: string }[] = [];
    for (const loc of getLocales()) {
      for (const p of getAllPosts(false, loc)) {
        if (!seen.has(p.slug)) {
          seen.add(p.slug);
          out.push({ slug: p.slug });
        }
      }
    }
    return out;
  }
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

/**
 * 在所有 locale 中查找该 slug，返回首个匹配的 post 和它的 lang
 */
function findPostAcrossLocales(slug: string) {
  if (!isI18nEnabled()) {
    const p = getPostBySlug(slug);
    return { post: p, locale: undefined as string | undefined };
  }
  for (const loc of getLocales()) {
    const p = getPostBySlug(slug, loc);
    if (p) return { post: p, locale: loc };
  }
  return { post: undefined, locale: undefined };
}

const MONO =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";
const SANS =
  "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', system-ui, sans-serif";

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;
  const { post, locale } = findPostAcrossLocales(slug);
  const config = loadZoeConfig(locale);

  const title = post?.title ?? config.title ?? "Blog";
  const description =
    post?.description ?? post?.excerpt ?? config.description ?? "";
  const dateStr = post?.date ? format(new Date(post.date), "yyyy.MM.dd") : "";
  const tagList = (post?.tags ?? []).slice(0, 4).map((t) =>
    typeof t === "string" ? t : t.name,
  );
  const siteUrl = (config.url ?? "https://zoe.im").replace(/^https?:\/\//, "");
  const authorName = config.author?.name ?? config.title ?? "Zoe";
  const avatarUrl = config.author?.avatar;
  const avatarInitial = (authorName || "Z").trim().charAt(0).toUpperCase();
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
        }}
      >
        {/* === HEADER: identity strip (matches main OG) === */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            height: 168,
            padding: "0 64px",
            background:
              "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)",
            borderBottom: "1px solid rgba(15,23,42,0.08)",
            position: "relative",
          }}
        >
          {/* avatar */}
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #ec4899 100%)",
              padding: 3,
              display: "flex",
              flexShrink: 0,
              boxShadow:
                "0 0 0 5px white, 0 0 0 6px rgba(15,23,42,0.08), 0 12px 32px rgba(15,23,42,0.18)",
            }}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={authorName}
                width={104}
                height={104}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #ec4899 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 56,
                  fontWeight: 800,
                  letterSpacing: -2,
                }}
              >
                {avatarInitial}
              </div>
            )}
          </div>

          {/* identity block */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: -2,
                  lineHeight: 1,
                }}
              >
                {authorName}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 18,
                  color: "#94a3b8",
                  fontWeight: 500,
                }}
              >
                {siteUrl}
              </div>
            </div>
            <div
              style={{
                fontSize: 19,
                color: "#475569",
                fontWeight: 500,
                letterSpacing: "-0.2px",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {tagline}
            </div>
          </div>

          {/* SHIPPING badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 999,
              fontFamily: MONO,
              fontSize: 13,
              color: "#047857",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 0 3px rgba(16,185,129,0.2)",
              }}
            />
            <span>SHIPPING</span>
          </div>
        </div>

        {/* === BODY: dark "night side" with post content === */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "44px 64px 40px 64px",
            backgroundColor: "#0a0a0f",
            backgroundImage:
              "radial-gradient(circle at 80% 30%, rgba(236,72,153,0.16), transparent 55%), radial-gradient(circle at 20% 80%, rgba(99,102,241,0.16), transparent 55%)",
            color: "#f8fafc",
            position: "relative",
          }}
        >
          {/* side tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#ec4899",
              marginBottom: 18,
            }}
          >
            <span
              style={{
                display: "flex",
                width: 20,
                height: 1,
                background: "currentColor",
              }}
            />
            <span>BLOG · POST</span>
          </div>

          {/* title */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -2,
              color: "#f8fafc",
              marginBottom: 22,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </div>

          {/* description */}
          {description ? (
            <div
              style={{
                fontSize: 22,
                lineHeight: 1.5,
                color: "#cbd5e1",
                fontFamily: MONO,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                marginBottom: "auto",
              }}
            >
              {description}
            </div>
          ) : (
            <div style={{ flex: 1 }} />
          )}

          {/* footer meta row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: MONO,
              fontSize: 14,
              color: "#94a3b8",
              marginTop: 28,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {dateStr ? (
                <span style={{ color: "#cbd5e1" }}>{dateStr}</span>
              ) : null}
              {tagList.length > 0 ? (
                <>
                  {dateStr ? (
                    <span style={{ color: "#475569" }}>·</span>
                  ) : null}
                  <div style={{ display: "flex", gap: 8 }}>
                    {tagList.map((t) => (
                      <span
                        key={t}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 999,
                          border: "1px solid rgba(248,250,252,0.12)",
                          background: "rgba(248,250,252,0.04)",
                          fontSize: 13,
                          color: "#cbd5e1",
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#64748b" }}>{`// `}</span>
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                  fontWeight: 700,
                }}
              >
                {siteUrl}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
