"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HelpHeaderProps {
  title?: string;
  description?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export function HelpHeader({
  title = "Hi, how can we help?",
  description,
  showSearch = true,
  onSearch,
  searchPlaceholder = "Search help content...",
}: HelpHeaderProps) {
  return (
    <div className="help-header relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border">
      <div className="relative flex flex-col items-center justify-center py-12 md:py-16 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-center">{title}</h1>
        {description && (
          <p className="text-base text-muted-foreground mb-6 text-center max-w-lg">{description}</p>
        )}
        {showSearch && (
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10 h-11 bg-background/80 backdrop-blur-sm border-border/50"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
