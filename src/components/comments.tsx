"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface GiscusCommentsProps {
  repo: string;
  repoId: string;
  category?: string;
  categoryId: string;
  mapping?: string;
  reactionsEnabled?: string;
  emitMetadata?: string;
  inputPosition?: string;
  lang?: string;
}

export function GiscusComments({
  repo,
  repoId,
  category = "Announcements",
  categoryId,
  mapping = "pathname",
  reactionsEnabled = "1",
  emitMetadata = "0",
  inputPosition = "bottom",
  lang = "zh-CN",
}: GiscusCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current || !repo || !repoId || !categoryId) return;

    // 清除旧的评论框
    containerRef.current.innerHTML = "";

    const theme = resolvedTheme === "dark" ? "dark" : "light";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", mapping);
    script.setAttribute("data-reactions-enabled", reactionsEnabled);
    script.setAttribute("data-emit-metadata", emitMetadata);
    script.setAttribute("data-input-position", inputPosition);
    script.setAttribute("data-theme", theme);
    script.setAttribute("data-lang", lang);
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    containerRef.current.appendChild(script);
  }, [
    repo,
    repoId,
    category,
    categoryId,
    mapping,
    reactionsEnabled,
    emitMetadata,
    inputPosition,
    lang,
    resolvedTheme,
  ]);

  if (!repo || !repoId || !categoryId) {
    return null;
  }

  return <div ref={containerRef} className="giscus w-full" />;
}

interface UtterancesCommentsProps {
  repo: string;
  issueTerm?: string;
  label?: string;
}

export function UtterancesComments({
  repo,
  issueTerm = "pathname",
  label = "comments",
}: UtterancesCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current || !repo) return;

    // 清除旧的评论框
    containerRef.current.innerHTML = "";

    const theme = resolvedTheme === "dark" ? "github-dark" : "github-light";

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", repo);
    script.setAttribute("issue-term", issueTerm);
    script.setAttribute("label", label);
    script.setAttribute("theme", theme);
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    containerRef.current.appendChild(script);
  }, [repo, issueTerm, label, resolvedTheme]);

  if (!repo) {
    return null;
  }

  return <div ref={containerRef} className="utterances w-full" />;
}

interface DisqusCommentsProps {
  shortname: string;
  url?: string;
  identifier?: string;
  title?: string;
}

export function DisqusComments({
  shortname,
  url,
  identifier,
  title,
}: DisqusCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !shortname) return;

    // @ts-expect-error Disqus global
    window.disqus_config = function () {
      // @ts-expect-error Disqus config
      this.page.url = url || window.location.href;
      // @ts-expect-error Disqus config
      this.page.identifier = identifier || window.location.pathname;
      // @ts-expect-error Disqus config
      this.page.title = title || document.title;
    };

    const script = document.createElement("script");
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.setAttribute("data-timestamp", String(+new Date()));
    script.async = true;

    containerRef.current.appendChild(script);
  }, [shortname, url, identifier, title]);

  if (!shortname) {
    return null;
  }

  return <div ref={containerRef} id="disqus_thread" className="w-full" />;
}

// 统一的评论组件
interface CommentsProps {
  provider?: "giscus" | "utterances" | "disqus";
  repo?: string;
  repoId?: string;
  category?: string;
  categoryId?: string;
  shortname?: string;
  className?: string;
}

export function Comments({
  provider,
  repo,
  repoId,
  category,
  categoryId,
  shortname,
  className,
}: CommentsProps) {
  if (!provider) return null;

  return (
    <div className={className}>
      {provider === "giscus" && repo && repoId && categoryId && (
        <GiscusComments
          repo={repo}
          repoId={repoId}
          category={category}
          categoryId={categoryId}
        />
      )}
      {provider === "utterances" && repo && (
        <UtterancesComments repo={repo} />
      )}
      {provider === "disqus" && shortname && (
        <DisqusComments shortname={shortname} />
      )}
    </div>
  );
}
