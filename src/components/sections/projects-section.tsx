import { GitHubProjectsList } from "@/components/project-card";
import type { ProjectsSection } from "@/types";
import type { ProjectFromGitHub } from "@/lib/github-projects";

interface ProjectsSectionProps {
  config: ProjectsSection;
  projects: ProjectFromGitHub[];
}

export function ProjectsSectionComponent({ config, projects }: ProjectsSectionProps) {
  if (projects.length === 0) return null;

  return (
    <section className="section-base max-w-5xl mx-auto px-4 py-12 md:py-16 lg:py-20">
      {(config.title || config.description) && (
        <div className="text-center mb-12">
          {config.title && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              {config.title}
            </h2>
          )}
          {config.description && (
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              {config.description}
            </p>
          )}
        </div>
      )}

      <GitHubProjectsList
        projects={projects}
        preview
        limit={config.limit || 6}
        showFilter={false}
      />
    </section>
  );
}
