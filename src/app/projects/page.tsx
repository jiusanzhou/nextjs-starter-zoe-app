import type { Metadata } from "next";
import { Suspense } from "react";
import { GitHubProjectsList, ProjectsList } from "@/components/project-card";
import { getProjectsMeta } from "@/lib/content";
import { getGitHubProjects } from "@/lib/github-projects";
import { loadZoeConfig } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { FolderKanban } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: getLabel(config, 'projects'),
    description: getLabel(config, 'projects.description'),
  };
}

export const revalidate = 3600;

async function ProjectsContent() {
  const config = await loadZoeConfig();
  const projectsConfig = config.projects;

  if (projectsConfig?.owners && projectsConfig.owners.length > 0) {
    const githubProjects = await getGitHubProjects(projectsConfig);

    return (
      <div className="page-projects space-y-10">
        {/* Hero */}
        <div className="text-center py-8 md:py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
            <FolderKanban className="h-6 w-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {getLabel(config, 'projects')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {getLabel(config, 'projects.description')}
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="text-sm text-muted-foreground">
              {getLabel(config, 'projects.count', { count: githubProjects.length })}
            </span>
            {projectsConfig.tag && (
              <span className="text-sm text-muted-foreground">
                · {getLabel(config, 'projects.tag')} <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{projectsConfig.tag}</code>
              </span>
            )}
          </div>
        </div>

        <GitHubProjectsList projects={githubProjects} showFilter />
      </div>
    );
  }

  const projects = getProjectsMeta();

  return (
    <div className="page-projects space-y-10">
      {/* Hero */}
      <div className="text-center py-8 md:py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
          <FolderKanban className="h-6 w-6" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {getLabel(config, 'projects')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {getLabel(config, 'projects.description')}
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
        <div className="page-projects space-y-10">
          <div className="text-center py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{getLabel(loadZoeConfig(), 'projects')}</h1>
            <p className="text-lg text-muted-foreground">{getLabel(loadZoeConfig(), 'loading')}</p>
          </div>
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
