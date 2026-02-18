import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { PostsList } from "@/components/post-card";
import { ProjectsList, GitHubProjectsList } from "@/components/project-card";
import { Section } from "@/components/section";
import { AuthorCard } from "@/components/author-card";
import { TypingText } from "@/components/typing-text";
import { loadZoeConfig } from "@/lib/zoefile";
import { getPostsMeta, getProjectsMeta } from "@/lib/content";
import { getGitHubProjects } from "@/lib/github-projects";

export const revalidate = 3600;

async function HomeContent() {
  const config = await loadZoeConfig();
  const posts = getPostsMeta();
  const projectsConfig = config.projects;
  
  // 根据配置获取项目（GitHub API 或本地）
  let githubProjects: Awaited<ReturnType<typeof getGitHubProjects>> | null = null;
  let localProjects: ReturnType<typeof getProjectsMeta> | null = null;
  
  if (projectsConfig?.owners && projectsConfig.owners.length > 0) {
    githubProjects = await getGitHubProjects(projectsConfig);
  } else {
    localProjects = getProjectsMeta();
  }

  return (
    <div className="space-y-8 md:space-y-16">
      {/* Hero Section with Typing Animation */}
      <Section className="py-16 md:py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            从零开始，构建一个
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-2">
            <TypingText
              texts={["用起来不太复杂", "看起来还不错", "符合现代Web规范"]}
              gradient="linear-gradient(to left, #7928CA, #FF0080)"
              underline
              className="px-2"
            />
          </h2>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-2">
            的网站
          </h2>
          {config.description && (
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {config.description}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/blog">开始阅读</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link
                href="https://github.com/jiusanzhou/nextjs-starter-zoe-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Philosophy Section */}
      <Section
        position="left"
        title="理念"
        description="始终相信并致力于推动"
        wrapperClassName="bg-muted/50"
      >
        <blockquote className="text-lg md:text-xl italic border-l-4 border-primary pl-6 py-2">
          <strong>任何业务逻辑都应向「无码平台」演进。</strong>
        </blockquote>
      </Section>

      {/* Projects Section */}
      {(githubProjects && githubProjects.length > 0) && (
        <Section
          title="实验项目"
          description="每一个创意和想法都需要去实践"
        >
          <GitHubProjectsList 
            projects={githubProjects} 
            preview 
            limit={3}
            showFilter={false}
          />
        </Section>
      )}
      
      {(localProjects && localProjects.length > 0) && (
        <Section
          title="实验项目"
          description="每一个创意和想法都需要去实践"
        >
          <ProjectsList 
            projects={localProjects} 
            preview 
            limit={3}
          />
        </Section>
      )}

      {/* Blog Posts Section */}
      {posts.length > 0 && (
        <Section
          title="博客文章"
          description="写作是一种自我学习的方式"
        >
          <PostsList 
            posts={posts} 
            mode="grid" 
            preview 
            limit={3}
          />
        </Section>
      )}

      {/* Contact Section */}
      <Section
        title="沟通"
        description="你可以通过下面任意一种方式与我取得联系 👇️"
      >
        <div className="flex justify-center">
          <AuthorCard author={config.author} className="max-w-sm" />
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
                加载中...
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
