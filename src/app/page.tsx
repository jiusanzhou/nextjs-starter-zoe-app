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

  return (
    <div className="space-y-8 md:space-y-16">
      {/* Hero */}
      <Section className="py-16 md:py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            👋 Hey，我是 Zoe
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-4">
            <TypingText
              texts={[
                "造 AI 工具",
                "写开源项目",
                "搭被动收入系统",
                "全程公开记录",
              ]}
              gradient="linear-gradient(to left, #7928CA, #FF0080)"
              underline
              className="px-2"
            />
          </h2>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            全栈开发 · Go / Flutter / Rust · 用代码和 AI 搭建可持续的收入系统
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/blog">读博客</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link
                href="https://github.com/jiusanzhou"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* What I'm Doing */}
      <Section
        position="left"
        title="在做什么"
        description="当前聚焦的方向"
        wrapperClassName="bg-muted/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border bg-background">
            <div className="text-2xl mb-3">🛠</div>
            <h3 className="font-semibold text-lg mb-2">AI 开发工具</h3>
            <p className="text-muted-foreground text-sm">
              多 Agent 系统、内容分发 CLI、手机端 AI
              Agent。解决自己的问题，然后开源。
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-background">
            <div className="text-2xl mb-3">✍️</div>
            <h3 className="font-semibold text-lg mb-2">技术写作</h3>
            <p className="text-muted-foreground text-sm">
              AI + 开发者工具方向。中文写原稿，工具自动分发到各平台。
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-background">
            <div className="text-2xl mb-3">💰</div>
            <h3 className="font-semibold text-lg mb-2">被动收入实验</h3>
            <p className="text-muted-foreground text-sm">
              从零开始搭建被动收入系统，每月公开数据报告。
            </p>
          </div>
        </div>
      </Section>

      {/* Projects */}
      {githubProjects && githubProjects.length > 0 && (
        <Section title="开源项目" description="造轮子是最好的学习方式">
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
        <Section title="最新文章" description="写代码、造工具、记录过程">
          <PostsList posts={posts} mode="grid" preview limit={6} />
        </Section>
      )}

      {/* Contact */}
      <Section
        title="联系我"
        description="任何一种方式都可以 👇"
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
