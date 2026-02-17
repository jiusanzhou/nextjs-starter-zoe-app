import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { getProjectsMeta } from "@/lib/content";

export const metadata: Metadata = {
  title: "项目",
  description: "我的开源项目和作品集",
};

export default function ProjectsPage() {
  const projects = getProjectsMeta();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">项目</h1>
        <p className="mt-2 text-muted-foreground">
          我的开源项目和作品集
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          暂无项目
        </div>
      )}
    </div>
  );
}
