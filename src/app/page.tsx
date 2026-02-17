import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { ProjectCard } from "@/components/project-card";
import { Section } from "@/components/section";
import { AuthorCard } from "@/components/author-card";
import { TypingText } from "@/components/typing-text";
import { loadZoeConfig } from "@/lib/zoefile";
import { getPostsMeta, getProjectsMeta } from "@/lib/content";

export default function HomePage() {
  const config = loadZoeConfig();
  const posts = getPostsMeta().slice(0, 3);
  const projects = getProjectsMeta().slice(0, 3);

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
      {projects.length > 0 && (
        <Section
          title="实验项目"
          description="每一个创意和想法都需要去实践"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/projects" className="flex items-center gap-1">
                查看更多 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Section>
      )}

      {/* Blog Posts Section */}
      {posts.length > 0 && (
        <Section
          title="博客文章"
          description="写作是一种自我学习的方式"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/blog" className="flex items-center gap-1">
                查看更多 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Section>
      )}

      {/* Contact Section */}
      <Section
        title="沟通"
        description="你可以通过下面任意一种方式与我取得联系 👇️"
      >
        <div className="flex justify-center">
          <AuthorCard className="max-w-sm" />
        </div>
      </Section>
    </div>
  );
}
