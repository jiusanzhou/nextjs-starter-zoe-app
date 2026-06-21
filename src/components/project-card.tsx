"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ExternalLink, Github, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getLanguageColor } from "@/lib/github-language-colors";
import type { ProjectMeta } from "@/types";
import type { ProjectFromGitHub } from "@/lib/github-projects";

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/**
 * GitHub auto-generates a 1200x640 social/og card for every public repo at:
 *   https://opengraph.githubassets.com/{hash}/{owner}/{repo}
 * The hash is arbitrary (used by GitHub for cache busting); any value works.
 */
function getRepoSocialImage(repoUrl: string): string | null {
  try {
    const u = new URL(repoUrl);
    const [owner, repo] = u.pathname.replace(/^\//, "").split("/");
    if (!owner || !repo) return null;
    return `https://opengraph.githubassets.com/1/${owner}/${repo}`;
  } catch {
    return null;
  }
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

// --- GitHub Project Card (cover + language strip, matches ProductCard) ---

interface GitHubProjectCardProps {
  project: ProjectFromGitHub;
}

export function GitHubProjectCard({ project }: GitHubProjectCardProps) {
  const cover = getRepoSocialImage(project.url);
  const langColor = getLanguageColor(project.language);

  return (
    <Link
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card group flex flex-col h-full overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Cover — GitHub repo social card (1200x640). Fallback: gradient with repo name. */}
      <div className="relative w-full aspect-[1200/630] overflow-hidden bg-muted">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={`${project.name} repository preview`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/10 via-muted to-primary/5 flex items-center justify-center p-6">
            <span className="text-2xl md:text-3xl font-bold tracking-tight text-muted-foreground/60 text-center break-all">
              {project.name}
            </span>
          </div>
        )}
        {/* Language strip — thin colored bar at bottom of cover */}
        {project.language && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: langColor }}
          />
        )}
      </div>

      {/* Body */}
      <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight truncate group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground flex-shrink-0 mt-1 transition-colors" />
        </div>

        {project.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Meta row pinned to bottom */}
        <div className="flex flex-wrap items-center gap-2 pt-1 mt-auto">
          {project.language && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-foreground/80">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: langColor }}
              />
              {project.language}
            </span>
          )}
          {project.stars > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Star className="h-3 w-3" />
              {formatNumber(project.stars)}
            </span>
          )}
          {project.topics
            .filter((t) => t !== "zoe-lab")
            .slice(0, 1)
            .map((topic) => (
              <span
                key={topic}
                className="text-[11px] px-2 py-0.5 rounded-full border text-muted-foreground"
              >
                {topic}
              </span>
            ))}
          <span className="ml-auto inline-flex items-center text-muted-foreground/70">
            <Github className="h-3.5 w-3.5" />
          </span>
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
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
