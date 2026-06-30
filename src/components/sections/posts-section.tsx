import { PostsList } from "@/components/post-card";
import { getLabel } from "@/lib/i18n";
import { getLocalePrefix } from "@/lib/zoefile";
import type { PostsSection, ZoeSiteConfig } from "@/types";
import type { PostMeta } from "@/types";

interface PostsSectionProps {
  config: PostsSection;
  posts: PostMeta[];
  siteConfig?: ZoeSiteConfig;
}

export function PostsSectionComponent({
  config,
  posts,
  siteConfig,
}: PostsSectionProps) {
  if (posts.length === 0) return null;

  // i18n: 非默认 locale 下，post 卡片链接需要带 locale 前缀
  const prefix = getLocalePrefix(siteConfig?.lang);
  const basePath = `${prefix}/blog`;
  const moreHref = `${prefix}/blog`;

  return (
    <section className="section-base max-w-5xl mx-auto px-4 py-12 md:py-16 lg:py-20">
      {(config.title || config.description) && (
        <div className="text-center mb-12">
          {config.title && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              {config.title}
            </h2>
          )}
          {config.description && (
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              {config.description}
            </p>
          )}
        </div>
      )}

      <PostsList
        posts={posts}
        mode={config.mode || "grid"}
        preview
        limit={config.limit || 6}
        basePath={basePath}
        moreHref={moreHref}
        viewMoreLabel={getLabel(siteConfig, "blog.viewMore")}
        emptyLabel={getLabel(siteConfig, "blog.noPosts")}
        dateFormat={getLabel(siteConfig, "blog.dateFormat")}
        minReadLabel={getLabel(siteConfig, "blog.minRead")}
      />
    </section>
  );
}
