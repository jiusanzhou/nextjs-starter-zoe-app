import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { PostsList } from "@/components/post-card";
import { GitHubProjectsList } from "@/components/project-card";
import { Section } from "@/components/section";
import { AuthorCard } from "@/components/author-card";
import { TypingText } from "@/components/typing-text";
import { loadZoeConfig } from "@/lib/zoefile";
import { getPostsMeta } from "@/lib/content";
import { getGitHubProjects } from "@/lib/github-projects";
import { getLabel } from "@/lib/i18n";

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

  // Hero config with fallbacks
  const hero = config.hero;
  const greeting = hero?.greeting || `Hey, I'm ${config.author?.name || config.title}`;
  const typingTexts = hero?.typingTexts;
  const description = hero?.description || config.description;
  const ctaButtons = hero?.cta || [
    { text: getLabel(config, 'blog'), href: '/blog' },
  ];

  // GitHub link from config
  const githubUrl = config.socials?.github
    || (config.author?.github ? `https://github.com/${config.author.github}` : null);

  // Add GitHub button if not already in cta and url exists
  const allCta = [...ctaButtons];
  if (githubUrl && !allCta.some(b => b.href.includes('github'))) {
    allCta.push({ text: 'GitHub', href: githubUrl });
  }

  // Sections config
  const sections = config.sections;

  return (
    <div className="space-y-8 md:space-y-16">
      {/* Hero */}
      <Section className="py-16 md:py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {greeting}
          </h1>
          {typingTexts && typingTexts.length > 0 && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-4">
              <TypingText
                texts={typingTexts}
                gradient="linear-gradient(to left, #7928CA, #FF0080)"
                underline
                className="px-2"
              />
            </h2>
          )}
          {description && (
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {allCta.map((btn, i) => (
              <Button
                key={btn.href}
                variant={i === 0 ? "default" : "outline"}
                asChild
                size="lg"
              >
                {btn.href.startsWith('http') ? (
                  <Link href={btn.href} target="_blank" rel="noopener noreferrer">
                    {btn.text}
                  </Link>
                ) : (
                  <Link href={btn.href}>{btn.text}</Link>
                )}
              </Button>
            ))}
          </div>
        </div>
      </Section>

      {/* Custom Sections from config */}
      {sections && sections.length > 0 && sections.map((section, idx) => (
        <Section
          key={idx}
          position="left"
          title={section.title}
          description={section.description}
          wrapperClassName={idx === 0 ? "bg-muted/50" : undefined}
        >
          {section.items && section.items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {section.items.map((item, j) => (
                <div key={j} className="p-6 rounded-lg border bg-background">
                  {item.icon && <div className="text-2xl mb-3">{item.icon}</div>}
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </Section>
      ))}

      {/* Projects */}
      {githubProjects && githubProjects.length > 0 && (
        <Section
          title={getLabel(config, 'home.projects')}
          description={getLabel(config, 'home.projects.description')}
        >
          <GitHubProjectsList
            projects={githubProjects}
            preview
            limit={6}
            showFilter={false}
          />
        </Section>
      )}

      {/* Blog */}
      {posts.length > 0 && (
        <Section
          title={getLabel(config, 'home.latestPosts')}
          description={getLabel(config, 'home.latestPosts.description')}
        >
          <PostsList posts={posts} mode="grid" preview limit={6} />
        </Section>
      )}

      {/* Contact */}
      <Section
        title={getLabel(config, 'contact')}
        description={getLabel(config, 'contact.description')}
      >
        <div className="flex justify-center">
          <AuthorCard author={config.author} className="max-w-lg" />
        </div>
      </Section>
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
