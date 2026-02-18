"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import {
  Github,
  Twitter,
  Mail,
  Facebook,
  Linkedin,
  Youtube,
  Instagram,
  MessageCircle,
  Rss,
  Globe,
  Send,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AuthorCard } from "@/components/author-card";
import type { Author, Copyright, Organization } from "@/types";

interface FooterLink {
  title: string;
  href: string;
  category?: string;
}

interface FooterProps {
  organization?: Organization;
  copyright?: Copyright;
  socials?: Record<string, string>;
  author?: Author;
  links?: FooterLink[];
}

// 社交图标映射
const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  twitter: Twitter,
  x: Twitter,
  email: Mail,
  mail: Mail,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  instagram: Instagram,
  discord: MessageCircle,
  telegram: Send,
  rss: Rss,
  website: Globe,
  homepage: Globe,
};

// 社交链接 URL 前缀处理
function getSocialUrl(name: string, value: string): string {
  if (value.startsWith("http") || value.startsWith("/") || value.startsWith("mailto:")) {
    return value;
  }
  
  const lowerName = name.toLowerCase();
  if (lowerName === "email" || lowerName === "mail") {
    return `mailto:${value}`;
  }
  if (lowerName === "telegram") {
    return `https://t.me/${value}`;
  }
  if (lowerName === "twitter" || lowerName === "x") {
    return `https://twitter.com/${value}`;
  }
  if (lowerName === "github") {
    return `https://github.com/${value}`;
  }
  if (lowerName === "facebook") {
    return `https://facebook.com/${value}`;
  }
  if (lowerName === "linkedin") {
    return `https://linkedin.com/in/${value}`;
  }
  if (lowerName === "instagram") {
    return `https://instagram.com/${value}`;
  }
  if (lowerName === "youtube") {
    return `https://youtube.com/@${value}`;
  }
  
  return value;
}

export function Footer({ organization, copyright, socials, author, links }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const fromYear = copyright?.from || currentYear;
  const yearRange = fromYear === currentYear ? currentYear : `${fromYear}-${currentYear}`;
  const holder = copyright?.holder || organization?.name || author?.name || "";

  // 按 category 分组链接
  const linksByCategory = (links || []).reduce<Record<string, FooterLink[]>>((acc, link) => {
    const category = link.category || "Links";
    if (!acc[category]) acc[category] = [];
    acc[category].push(link);
    return acc;
  }, {});

  const hasLinks = Object.keys(linksByCategory).length > 0;

  return (
    <footer className="border-t py-8 md:py-12 safe-area-pb">
      <div className="container">
        {/* 主要内容区域 */}
        {(hasLinks || organization) && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
            {/* Logo & 社交链接 */}
            <div className="col-span-2 md:col-span-1 lg:col-span-2">
              {organization && (
                <div className="flex items-center gap-3 mb-4">
                  {organization.logo && (
                    <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={organization.logo.startsWith("http") ? organization.logo : `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${organization.logo}`} 
                        alt={organization.name} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  )}
                  <span className="font-semibold">{organization.name}</span>
                </div>
              )}
              
              {/* 社交图标 */}
              {socials && Object.keys(socials).length > 0 && (
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  {Object.entries(socials).map(([name, value]) => {
                    const Icon = socialIcons[name.toLowerCase()] || Globe;
                    const url = getSocialUrl(name, value);
                    
                    return (
                      <Link
                        key={name}
                        href={url}
                        target={url.startsWith("http") ? "_blank" : undefined}
                        rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title={name}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 链接分组 */}
            {Object.entries(linksByCategory).map(([category, categoryLinks]) => (
              <div key={category}>
                <h4 className="font-semibold text-sm mb-3">{category}</h4>
                <ul className="space-y-2">
                  {categoryLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* 底部版权 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 pt-4 border-t text-sm text-muted-foreground">
          <span>
            © {yearRange} {holder}
            {copyright?.location && ` · ${copyright.location}`}
          </span>
          
          {author && (
            <span className="flex items-center gap-1">
              · Made with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> by{" "}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-primary hover:underline cursor-pointer">
                    {author.name}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="center">
                  <AuthorCard author={author} className="border-0 shadow-none" />
                </PopoverContent>
              </Popover>
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
