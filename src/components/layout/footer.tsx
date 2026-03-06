"use client";

import Link from "next/link";
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
  wechatScanLabel?: string;
}

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

function getSocialUrl(name: string, value: string): string {
  if (value.startsWith("http") || value.startsWith("/") || value.startsWith("mailto:")) {
    return value;
  }

  const lowerName = name.toLowerCase();
  if (lowerName === "email" || lowerName === "mail") return `mailto:${value}`;
  if (lowerName === "telegram") return `https://t.me/${value}`;
  if (lowerName === "twitter" || lowerName === "x") return `https://twitter.com/${value}`;
  if (lowerName === "github") return `https://github.com/${value}`;
  if (lowerName === "facebook") return `https://facebook.com/${value}`;
  if (lowerName === "linkedin") return `https://linkedin.com/in/${value}`;
  if (lowerName === "instagram") return `https://instagram.com/${value}`;
  if (lowerName === "youtube") return `https://youtube.com/@${value}`;

  return value;
}

export function Footer({
  organization,
  copyright,
  socials,
  links,
  wechatScanLabel = "Scan to add on WeChat",
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const fromYear = copyright?.from || currentYear;
  const yearRange = fromYear === currentYear ? currentYear : `${fromYear}-${currentYear}`;
  const holder = copyright?.holder || organization?.name || "";

  const linksByCategory = (links || []).reduce<Record<string, FooterLink[]>>((acc, link) => {
    const category = link.category || "Links";
    if (!acc[category]) acc[category] = [];
    acc[category].push(link);
    return acc;
  }, {});

  const hasLinks = Object.keys(linksByCategory).length > 0;

  return (
    <footer className="site-footer border-t bg-muted/30 safe-area-pb">
      <div className="container py-12 md:py-16 lg:py-20">
        {/* Main content area */}
        {(hasLinks || organization) && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12">
            {/* Logo & Description & Social */}
            <div className="md:col-span-4 lg:col-span-5">
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
                  <span className="font-semibold text-lg">{organization.name}</span>
                </div>
              )}

              {/* Social icons */}
              {socials && Object.keys(socials).length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {Object.entries(socials).map(([name, value]) => {
                    const Icon = socialIcons[name.toLowerCase()] || Globe;
                    const url = getSocialUrl(name, value);

                    if (name.toLowerCase() === "wechat" && value.startsWith("http")) {
                      return (
                        <div key={name} className="relative group">
                          <span
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                            title={name}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                            <div className="bg-card border rounded-xl shadow-lg p-3 w-48">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={value} alt={wechatScanLabel} width={168} height={168} className="w-full h-auto rounded-lg" />
                              <p className="text-xs text-center text-muted-foreground mt-2">{wechatScanLabel}</p>
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-card border-b border-r rotate-45 shadow-sm" />
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={name}
                        href={url}
                        target={url.startsWith("http") ? "_blank" : undefined}
                        rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        title={name}
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Link groups */}
            <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {Object.entries(linksByCategory).map(([category, categoryLinks]) => (
                <div key={category}>
                  <h4 className="font-semibold text-sm mb-4 text-foreground">{category}</h4>
                  <ul className="space-y-3">
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
          </div>
        )}

        {/* Divider */}
        <div className="border-t mt-12 pt-8">
          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>
              &copy; {yearRange} {holder}
              {copyright?.location && ` · ${copyright.location}`}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
