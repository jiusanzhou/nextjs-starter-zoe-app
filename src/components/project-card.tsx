"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github, Star, GitFork } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProjectMeta } from "@/types";
import type { ProjectFromGitHub } from "@/lib/github-projects";

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// --- Local Project Card ---

interface ProjectCardProps {
  project: ProjectMeta;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="project-card feature-card group p-6 rounded-xl border bg-card hover:-translate-y-1 hover:shadow-lg transition-all">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {project.repo && (
              <Link
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </Link>
            )}
            {project.url && (
              <Link
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {project.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {project.description}
          </p>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- GitHub Project Card (product-grade redesign) ---

interface GitHubProjectCardProps {
  project: ProjectFromGitHub;
}

export function GitHubProjectCard({ project }: GitHubProjectCardProps) {
  return (
    <Link
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card feature-card group block p-6 lg:p-8 rounded-xl border bg-card hover:-translate-y-1 hover:shadow-lg transition-all"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <Github className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
        </div>

        {/* Description */}
        {project.description ? (
          <p className="text-base text-muted-foreground leading-relaxed line-clamp-3">
            {project.description}
          </p>
        ) : (
          <div className="min-h-[1.5rem]" />
        )}

        {/* Footer: language + topics + stats */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            {project.language && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {project.language}
              </span>
            )}
            {project.topics.slice(0, 2).map((topic) => (
              <span
                key={topic}
                className="text-xs px-2 py-0.5 rounded-full border text-muted-foreground"
              >
                {topic}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
            {project.stars > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {formatNumber(project.stars)}
              </span>
            )}
            {project.forks > 0 && (
              <span className="flex items-center gap-1">
                <GitFork className="h-3 w-3" />
                {formatNumber(project.forks)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// --- Language Filter ---

interface LanguageFilterProps {
  languages: string[];
  selected: string;
  onSelect: (lang: string) => void;
}

function LanguageFilter({ languages, selected, onSelect }: LanguageFilterProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-full">
        <button
          onClick={() => onSelect("")}
          className={cn(
            "px-3 py-1 rounded-full text-sm transition-colors",
            selected === ""
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          All
        </button>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => onSelect(lang)}
            className={cn(
              "px-3 py-1 rounded-full text-sm transition-colors",
              selected === lang
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- GitHub Projects List (2-column grid) ---

interface GitHubProjectsListProps {
  projects: ProjectFromGitHub[];
  preview?: boolean;
  limit?: number;
  showMore?: boolean;
  moreHref?: string;
  showFilter?: boolean;
  viewMoreLabel?: string;
  emptyLabel?: string;
}

export function GitHubProjectsList({
  projects,
  preview = false,
  limit = 6,
  showMore = true,
  moreHref = "/projects",
  showFilter = true,
  viewMoreLabel = "View More",
  emptyLabel = "No projects yet",
}: GitHubProjectsListProps) {
  const [selectedLang, setSelectedLang] = useState("");

  const languages = Array.from(
    new Set(projects.map((p) => p.language).filter(Boolean) as string[])
  );

  const filteredProjects = selectedLang
    ? projects.filter((p) => p.language === selectedLang)
    : projects;

  const displayProjects = preview
    ? filteredProjects.slice(0, limit)
    : filteredProjects;

  return (
    <div>
      {!preview && showFilter && languages.length > 1 && (
        <LanguageFilter
          languages={languages}
          selected={selectedLang}
          onSelect={setSelectedLang}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {displayProjects.map((project) => (
          <GitHubProjectCard key={project.id} project={project} />
        ))}
      </div>

      {preview && showMore && projects.length > limit && (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" asChild>
            <Link href={moreHref} className="flex items-center gap-2">
              {viewMoreLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {displayProjects.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">{emptyLabel}</p>
        </div>
      )}
    </div>
  );
}

// --- Local Projects List (2-column grid) ---

interface ProjectsListProps {
  projects: ProjectMeta[];
  preview?: boolean;
  limit?: number;
  showMore?: boolean;
  moreHref?: string;
  viewMoreLabel?: string;
  emptyLabel?: string;
}

export function ProjectsList({
  projects,
  preview = false,
  limit = 6,
  showMore = true,
  moreHref = "/projects",
  viewMoreLabel = "View More",
  emptyLabel = "No projects yet",
}: ProjectsListProps) {
  const displayProjects = preview ? projects.slice(0, limit) : projects;

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2">
        {displayProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {preview && showMore && projects.length > limit && (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" asChild>
            <Link href={moreHref} className="flex items-center gap-2">
              {viewMoreLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {displayProjects.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">{emptyLabel}</p>
        </div>
      )}
    </div>
  );
}
