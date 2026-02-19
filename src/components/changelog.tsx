"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Calendar, Tag, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import type { Changelog, ChangelogMeta } from "@/types";
import { cn } from "@/lib/utils";

interface ChangelogListProps {
  changelogs: Changelog[];
  showContent?: boolean;
}

export function ChangelogList({ changelogs, showContent = true }: ChangelogListProps) {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(
    // 默认展开最新的 3 个版本
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

  // 按年份分组
  const groupedByYear = changelogs.reduce((acc, changelog) => {
    const year = new Date(changelog.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(changelog);
    return acc;
  }, {} as Record<string, Changelog[]>);

  const years = Object.keys(groupedByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-12">
      {years.map(year => (
        <div key={year}>
          <h2 className="text-2xl font-bold mb-6 sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
            {year}
          </h2>
          <div className="space-y-4 border-l-2 border-muted pl-6 ml-2">
            {groupedByYear[year].map((changelog, index) => {
              const isExpanded = expandedVersions.has(changelog.slug);
              const isLatest = years[0] === year && index === 0;

              return (
                <div
                  key={changelog.slug}
                  className={cn(
                    "relative",
                    "before:absolute before:-left-[1.625rem] before:top-2",
                    "before:w-3 before:h-3 before:rounded-full",
                    isLatest
                      ? "before:bg-primary before:ring-4 before:ring-primary/20"
                      : "before:bg-muted-foreground/50"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg border bg-card transition-colors",
                      isLatest && "border-primary/50"
                    )}
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleExpand(changelog.slug)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 rounded-t-lg transiticolors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "font-mono font-bold text-lg",
                          isLatest && "text-primary"
                        )}>
                          {changelog.version}
                        </span>
                        {changelog.breaking && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-destructive/10 text-destructive rounded">
                            <AlertTriangle className="w-3 h-3" />
                            Breaking
                          </span>
                        )}
                        {changelog.tags?.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-muted rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(changelog.date), {
                            addSuffix: true,
                            locale: zhCN,
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
                      <div className="px-4 pb-4 border-t">
                        <div className="flex items-center gap-4 py-3 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(changelog.date), "yyyy年M月d日", { locale: zhCN })}
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
                            查看详情 →
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
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {format(new Date(changelog.date), "yyyy年M月d日", { locale: zhCN })}
          </span>
          {changelog.tags && changelog.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {changelog.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-muted rounded text-xs">
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

/**
 * 渲染 Changelog 内容
 * 支持简单的 Markdown 转换
 */
function ChangelogContent({ content }: { content: string }) {
  // 简单的 Markdown 转 HTML
  const html = content
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Paragraphs
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
