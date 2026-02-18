"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github, Star, GitFork } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProjectMeta } from "@/types";
import type { ProjectFromGitHub } from "@/lib/github-projects";

interface ProjectCardProps {
  project: ProjectMeta;
}

// 本地项目卡片
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
            {project.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {project.repo && (
              <Link
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </Link>
            )}
            {project.url && (
              <Link
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
        {project.description && (
          <CardDescription className="line-clamp-2">
            {project.description}
          </CardDescription>
        )}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
    </Card>
  );
}

// GitHub 项目卡片（带 star/fork 统计）
interface GitHubProjectCardProps {
  project: ProjectFromGitHub;
}

export function GitHubProjectCard({ project }: GitHubProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-1 text-base">
              <Link
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {project.name}
              </Link>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {project.owner}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              {project.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="h-3.5 w-3.5" />
              {project.forks}
            </span>
          </div>
        </div>
        
        {project.description && (
          <CardDescription className="line-clamp-2 text-sm">
            {project.description}
          </CardDescription>
        )}
        
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-wrap gap-1.5">
            {project.language && (
              <Badge variant="secondary" className="text-xs">
                {project.language}
              </Badge>
            )}
            {project.topics.slice(0, 2).map((topic) => (
              <Badge key={topic} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            {project.homepage && (
              <Link
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
            <Link
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

// 语言筛选器组件
interface LanguageFilterProps {
  languages: string[];
  selected: string;
  onSelect: (lang: string) => void;
}

function LanguageFilter({ languages, selected, onSelect }: LanguageFilterProps) {
  return (
    <div className="flex justify-center mb-6">
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

// 项目列表组件（GitHub 项目，带语言筛选）
interface GitHubProjectsListProps {
  projects: ProjectFromGitHub[];
  preview?: boolean;
  limit?: number;
  showMore?: boolean;
  moreHref?: string;
  showFilter?: boolean;
}

export function GitHubProjectsList({
  projects,
  preview = false,
  limit = 3,
  showMore = true,
  moreHref = "/projects",
  showFilter = true,
}: GitHubProjectsListProps) {
  const [selectedLang, setSelectedLang] = useState("");
  
  // 提取所有语言
  const languages = Array.from(
    new Set(projects.map((p) => p.language).filter(Boolean) as string[])
  );
  
  // 筛选项目
  let filteredProjects = selectedLang
    ? projects.filter((p) => p.language === selectedLang)
    : projects;
  
  // 预览模式只显示前 N 个
  const displayProjects = preview ? filteredProjects.slice(0, limit) : filteredProjects;
  
  return (
    <div>
      {/* 语言筛选器（非预览模式显示） */}
      {!preview && showFilter && languages.length > 1 && (
        <LanguageFilter
          languages={languages}
          selected={selectedLang}
          onSelect={setSelectedLang}
        />
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayProjects.map((project) => (
          <GitHubProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      {preview && showMore && projects.length > limit && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" asChild>
            <Link href={moreHref} className="flex items-center gap-1">
              查看更多 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
      
      {displayProjects.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          暂无项目
        </div>
      )}
    </div>
  );
}

// 本地项目列表组件
interface ProjectsListProps {
  projects: ProjectMeta[];
  preview?: boolean;
  limit?: number;
  showMore?: boolean;
  moreHref?: string;
}

export function ProjectsList({
  projects,
  preview = false,
  limit = 3,
  showMore = true,
  moreHref = "/projects",
}: ProjectsListProps) {
  const displayProjects = preview ? projects.slice(0, limit) : projects;
  
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      
      {preview && showMore && projects.length > limit && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" asChild>
            <Link href={moreHref} className="flex items-center gap-1">
              查看更多 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
      
      {displayProjects.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          暂无项目
        </div>
      )}
    </div>
  );
}
