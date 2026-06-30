/**
 * Shared HomePage content renderer (locale-aware).
 *
 * 默认 locale 的 `(site)/page.tsx` 和非默认 locale 的 `[lang]/page.tsx`
 * 都通过这个函数构造首页 sections，避免逻辑重复。
 */

import { Suspense } from "react";
import { Section } from "@/components/section";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { loadZoeConfig } from "@/lib/zoefile";
import { getPostsMeta } from "@/lib/content";
import { getGitHubProjects } from "@/lib/github-projects";
import { getLabel } from "@/lib/i18n";
import type { HeroSection, SectionConfigUnion } from "@/types";

interface HomeContentProps {
  /** 可选 locale；不传 → 默认 locale 行为（向后兼容） */
  locale?: string;
}

async function HomeContent({ locale }: HomeContentProps) {
  const config = loadZoeConfig(locale);
  const posts = getPostsMeta(locale);
  const projectsConfig = config.projects;

  let githubProjects: Awaited<ReturnType<typeof getGitHubProjects>> | null = null;
  if (projectsConfig?.owners && projectsConfig.owners.length > 0) {
    githubProjects = await getGitHubProjects(projectsConfig);
  }

  const sections = config.sections || [];

  const hasHeroSection = sections.some((s) => s.type === "hero");
  const hasPostsSection = sections.some((s) => s.type === "posts");
  const hasProjectsSection = sections.some((s) => s.type === "projects");
  const hasProductsSection = sections.some((s) => s.type === "products");
  const hasContactSection = sections.some((s) => s.type === "contact");

  // Build hero from legacy config as fallback
  let heroFallback: HeroSection | null = null;
  if (!hasHeroSection && config.hero) {
    heroFallback = {
      type: "hero",
      greeting:
        config.hero.greeting || `Hey, I'm ${config.author?.name || config.title}`,
      typingTexts: config.hero.typingTexts,
      description: config.hero.description || config.description,
      cta: config.hero.cta,
      align: config.hero.align || "center",
      avatar: config.hero.avatar,
      image: config.hero.image,
      video: config.hero.video,
      badge: config.hero.badge,
    };
  }

  const allSections: SectionConfigUnion[] = [];

  if (heroFallback) {
    allSections.push(heroFallback);
  }
  allSections.push(...sections);

  if (!hasProductsSection && config.products && config.products.length > 0) {
    allSections.push({
      type: "products",
      title: getLabel(config, "home.products"),
      description: getLabel(config, "home.products.description"),
      limit: 6,
    });
  }

  if (!hasProjectsSection && githubProjects && githubProjects.length > 0) {
    allSections.push({
      type: "projects",
      title: getLabel(config, "home.projects"),
      description: getLabel(config, "home.projects.description"),
      limit: 6,
    });
  }

  if (!hasPostsSection && posts.length > 0) {
    allSections.push({
      type: "posts",
      title: getLabel(config, "home.latestPosts"),
      description: getLabel(config, "home.latestPosts.description"),
      limit: 6,
      mode: "grid",
    });
  }

  if (!hasContactSection) {
    allSections.push({
      type: "contact",
      title: getLabel(config, "contact"),
      description: getLabel(config, "contact.description"),
    });
  }

  return (
    <div className="space-y-0">
      <SectionRenderer
        sections={allSections}
        posts={posts}
        githubProjects={githubProjects || undefined}
        author={config.author}
        siteConfig={config}
      />
    </div>
  );
}

export function HomePageView({ locale }: HomeContentProps = {}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-8 md:space-y-16" aria-busy="true" aria-label="Loading">
          <Section className="py-16 md:py-24 lg:py-32">
            <div className="text-center">
              <div
                className="h-12 w-48 mx-auto bg-muted/40 rounded animate-pulse"
                role="status"
                aria-label="Loading"
              />
            </div>
          </Section>
        </div>
      }
    >
      <HomeContent locale={locale} />
    </Suspense>
  );
}
