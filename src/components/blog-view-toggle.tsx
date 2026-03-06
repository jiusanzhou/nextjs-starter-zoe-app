"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { PostsList } from "@/components/post-card";
import type { PostMeta } from "@/types";

interface BlogViewToggleProps {
  posts: PostMeta[];
  dateFormat: string;
  minReadLabel: string;
  allPostsLabel: string;
  emptyLabel: string;
  gridLabel: string;
  listLabel: string;
}

export function BlogViewToggle({
  posts,
  dateFormat,
  minReadLabel,
  allPostsLabel,
  emptyLabel,
  gridLabel,
  listLabel,
}: BlogViewToggleProps) {
  const [mode, setMode] = useState<"grid" | "tile">("grid");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold tracking-tight">{allPostsLabel}</h2>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <button
            onClick={() => setMode("grid")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
              mode === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={gridLabel}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">{gridLabel}</span>
          </button>
          <button
            onClick={() => setMode("tile")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
              mode === "tile"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={listLabel}
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">{listLabel}</span>
          </button>
        </div>
      </div>
      <PostsList
        posts={posts}
        mode={mode}
        dateFormat={dateFormat}
        minReadLabel={minReadLabel}
        emptyLabel={emptyLabel}
      />
    </div>
  );
}
