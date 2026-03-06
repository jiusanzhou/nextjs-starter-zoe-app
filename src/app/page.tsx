import { Suspense } from "react";
import { Section } from "@/components/section";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { loadZoeConfig } from "@/lib/zoefile";
import { getPostsMeta } from "@/lib/content";
import { getGitHubProjects } from "@/lib/github-projects";
import { getLabel } from "@/lib/i18n";
import type { HeroSection, SectionConfigUnion } from "@/types";

export const revalidate = 3600;

async function HomeContent() {
  const config = await loadZoeConfig();
  const posts = getPostsMeta();
  const projectsConfig = config.projects;

  let githubProjects: Awaited<ReturnType<typeof getGitHubProjects>> | null =
    null;
  if (projectsConfig?.owners && projectsConfig.owners.length > 0) {
    githubProjects = await getGitHubProjects(projectsConfig);
  }

  const sections = config.sections || [];

  // Check if sections contain specific types
  const hasHeroSection = sections.some((s) => s.type === "hero");
  const hasPostsSection = sections.some((s) => s.type === "posts");
  const hasProjectsSection = sections.some((s) => s.type === "projects");
  const hasContactSection = sections.some((s) => s.type === "contact");

  // Build hero from legacy config as fallback
  let heroFallback: HeroSection | null = null;
  if (!hasHeroSection && config.hero) {
    heroFallback = {
      type: "hero",
      greeting: config.hero.greeting || `Hey, I'm ${config.author?.name || config.title}`,
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

  // Build full sections list
  const allSections: SectionConfigUnion[] = [];

  if (heroFallback) {
    allSections.push(heroFallback);
  }

  allSections.push(...sections);

  // Auto-append projects if not explicitly configured
  if (!hasProjectsSection && githubProjects && githubProjects.length > 0) {
    allSections.push({
      type: "projects",
      title: getLabel(config, "home.projects"),
      description: getLabel(config, "home.projects.description"),
      limit: 6,
    });
  }

  // Auto-append posts if not explicitly configured
  if (!hasPostsSection && posts.length > 0) {
    allSections.push({
      type: "posts",
      title: getLabel(config, "home.latestPosts"),
      description: getLabel(config, "home.latestPosts.description"),
      limit: 6,
      mode: "grid",
    });
  }

  // Auto-append contact if not explicitly configured
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

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8 md:space-y-16">
          <Section className="py-16 md:py-24 lg:py-32">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Loading...
              </h1>
            </div>
          </Section>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
