"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HelpHeaderProps {
  title?: string;
  description?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export function HelpHeader({
  title = "嗨，有什么可以帮你？",
  description,
  showSearch = true,
  onSearch,
}: HelpHeaderProps) {
  return (
    <div
      className="hidden md:flex flex-col items-center justify-center min-h-60 bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://a.slack-edge.com/94c06/helpcenter/img/cat-hero-banner-image-2x.png')",
      }}
    >
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      {description && (
        <p className="text-lg opacity-90 mb-6">{description}</p>
      )}
      {showSearch && (
        <div className="relative w-full max-w-md px-4">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="搜索帮助内容..."
            className="pl-12 bg-white text-foreground"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
