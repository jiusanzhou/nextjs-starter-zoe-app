"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { Calendar, Tag, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import type { Changelog } from "@/types";
import type { ZoeSiteConfig } from "@/types";
import { cn } from "@/lib/utils";
import { getLabel } from "@/lib/i18n";

interface ChangelogListProps {
  changelogs: Changelog[];
  showContent?: boolean;
  config?: ZoeSiteConfig;
}

export function ChangelogList({ changelogs, showContent = true, config }: ChangelogListProps) {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(
    new Set(changelogs.slice(0, 3).map(c => c.slug))
  );

  const toggleExpand = (slug: string) => {
    setExpandedVersions(prev => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const groupedByYear = changelogs.reduce((acc, changelog) => {
    const year = new Date(changelog.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(changelog);
    return acc;
  }, {} as Record<string, Changelog[]>);

  const years = Object.keys(groupedByYear).sort((a, b) => Number(b) - Number(a));
  const locale = config?.lang || "en";

  return (
    <div className="space-y-12">
      {years.map(year => (
        <div key={year}>
          <h2 className="text-2xl font-bold mb-6 sticky top-16 bg-background/95 backdrop-blur-sm py-2 z-10 border-b">
            {year}
          </h2>
          <div className="space-y-4 border-l-2 border-muted pl-6 ml-3">
            {groupedByYear[year].map((changelog, index) => {
              const isExpanded = expandedVersions.has(changelog.slug);
              const isLatest = years[0] === year && index === 0;

              return (
                <div
                  key={changelog.slug}
                  className={cn(
                    "relative",
                    "before:absolute before:-left-[1.625rem] before:top-3",
                    "before:w-3 before:h-3 before:rounded-full",
                    isLatest
                      ? "before:bg-primary before:ring-4 before:ring-primary/20"
                      : "before:bg-muted-foreground/30 before:ring-2 before:ring-muted"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-xl border bg-card transition-all",
                      isLatest && "border-primary/30 shadow-sm",
                      !isLatest && "hover:border-border"
                    )}
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleExpand(changelog.slug)}
                      className="w-full flex items-center justify-between p-4 lg:p-5 text-left hover:bg-muted/30 rounded-t-xl transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={cn(
                          "font-mono font-bold text-lg",
                          isLatest && "text-primary"
                        )}>
                          {changelog.version}
                        </span>
                        {isLatest && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full uppercase tracking-wider">
                            {getLabel(config, 'releases.latest')}
                          </span>
                        )}
                        {changelog.breaking && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-destructive/10 text-destructive rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            Breaking
                          </span>
                        )}
                        {changelog.tags?.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-muted rounded-full text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                          {formatDistanceToNow(new Date(changelog.date), {
                            addSuffix: true,
                          })}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Content */}
                    {isExpanded && showContent && (
                      <div className="px-4 lg:px-5 pb-4 lg:pb-5 border-t">
                        <div className="flex items-center gap-4 py-3 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(changelog.date), "PPP", { locale: undefined })}
                          </span>
                          {changelog.title && changelog.title !== `版本 ${changelog.version}` && (
                            <span className="font-medium text-foreground">
                              {changelog.title}
                            </span>
                          )}
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ChangelogContent content={changelog.content} />
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <Link
                            href={`/changelog/${changelog.slug}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {getLabel(config, 'changelog.viewDetails')} &rarr;
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ChangelogDetailProps {
  changelog: Changelog;
}

export function ChangelogDetail({ changelog }: ChangelogDetailProps) {
  return (
    <article className="space-y-6">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl md:text-4xl font-bold font-mono">
            {changelog.version}
          </h1>
          {changelog.breaking && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-destructive/10 text-destructive rounded-full">
              <AlertTriangle className="w-4 h-4" />
              Breaking Changes
            </span>
          )}
        </div>
        {changelog.title && changelog.title !== `版本 ${changelog.version}` && (
          <h2 className="text-xl text-muted-foreground">{changelog.title}</h2>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {format(new Date(changelog.date), "PPP")}
          </span>
          {changelog.tags && changelog.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {changelog.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-muted rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ChangelogContent content={changelog.content} />
      </div>
    </article>
  );
}

function ChangelogContent({ content }: { content: string }) {
  const html = content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .split('\n\n')
    .map(p => {
      if (p.startsWith('<h') || p.startsWith('<ul')) {
        return p;
      }
      return `<p>${p}</p>`;
    })
    .join('\n');

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
