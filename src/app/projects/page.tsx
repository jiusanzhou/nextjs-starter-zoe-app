import type { Metadata } from "next";
import { Suspense } from "react";
import { GitHubProjectsList, ProjectsList } from "@/components/project-card";
import { getProjectsMeta } from "@/lib/content";
import { getGitHubProjects } from "@/lib/github-projects";
import { loadZoeConfig } from "@/lib/zoefile";

export const metadata: Metadata = {
  title: "项目",
  description: "我的开源项目和作品集",
};

export const revalidate = 3600;

async function ProjectsContent() {
  const config = await loadZoeConfig();
  const projectsConfig = config.projects;
  
  // 如果配置了 GitHub 项目源，从 API 获取
  if (projectsConfig?.owners && projectsConfig.owners.length > 0) {
    const githubProjects = await getGitHubProjects(projectsConfig);
    
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">项目</h1>
          <p className="mt-2 text-muted-foreground">
            我的开源项目和作品集
            {projectsConfig.tag && (
              <span className="ml-2 text-sm">
                · 标签: <code className="bg-muted px-1.5 py-0.5 rounded">{projectsConfig.tag}</code>
              </span>
            )}
          </p>
        </div>

        {/* 使用带语言筛选的列表组件 */}
        <GitHubProjectsList projects={githubProjects} showFilter />
      </div>
    );
  }
  
  // 否则从本地 content/projects 目录读取
  const projects = getProjectsMeta();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">项目</h1>
        <p className="mt-2 text-muted-foreground">
          我的开源项目和作品集
        </p>
      </div>

      <ProjectsList projects={projects} />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">项目</h1>
            <p className="mt-2 text-muted-foreground">加载中...</p>
          </div>
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
