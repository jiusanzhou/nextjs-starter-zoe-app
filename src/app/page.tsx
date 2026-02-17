import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { ProjectCard } from "@/components/project-card";
import { loadZoeConfig } from "@/lib/zoefile";
import { getPostsMeta, getProjectsMeta } from "@/lib/content";

export default function HomePage() {
  const config = loadZoeConfig();
  const posts = getPostsMeta().slice(0, 3);
  const projects = getProjectsMeta().slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {config.title}
        </h1>
        {config.description && (
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            {config.description}
          </p>
        )}
        {config.author?.minibio && (
          <p className="mt-6 text-lg text-muted-foreground italic">
            {config.author.minibio}
          </p>
        )}
      </section>

      {/* Recent Posts */}
      {posts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">最新文章</h2>
            <Button variant="ghost" asChild>
              <Link href="/blog" className="flex items-center gap-1">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">项目</h2>
            <Button variant="ghost" asChild>
              <Link href="/projects" className="flex items-center gap-1">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
