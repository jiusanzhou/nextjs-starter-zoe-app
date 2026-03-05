import type { Metadata } from "next";
import { Suspense } from "react";
import { GitHubProjectsList, ProjectsList } from "@/components/project-card";
import { getProjectsMeta } from "@/lib/content";
import { getGitHubProjects } from "@/lib/github-projects";
import { loadZoeConfig } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";

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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{getLabel(config, 'projects')}</h1>
          <p className="mt-2 text-muted-foreground">
            {getLabel(config, 'projects.description')}
            {projectsConfig.tag && (
              <span className="ml-2 text-sm">
                · {getLabel(config, 'projects.tag')} <code className="bg-muted px-1.5 py-0.5 rounded">{projectsConfig.tag}</code>
              </span>
            )}
          </p>
        </div>

        <GitHubProjectsList projects={githubProjects} showFilter />
      </div>
    );
  }

  const projects = getProjectsMeta();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{getLabel(config, 'projects')}</h1>
        <p className="mt-2 text-muted-foreground">
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
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{getLabel(loadZoeConfig(), 'projects')}</h1>
            <p className="mt-2 text-muted-foreground">{getLabel(loadZoeConfig(), 'loading')}</p>
          </div>
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
