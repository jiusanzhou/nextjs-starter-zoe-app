import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Author } from "@/types";
import {
  Github,
  Twitter,
  Mail,
  Globe,
  Linkedin,
  MessageCircle,
  Send,
} from "lucide-react";

interface AuthorCardProps {
  author?: Author;
  simple?: boolean;
  className?: string;
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  twitter: Twitter,
  email: Mail,
  homepage: Globe,
  linkedin: Linkedin,
  wechat: MessageCircle,
  telegram: Send,
};

export function AuthorCard({ author, simple = false, className }: AuthorCardProps) {
  if (!author) return null;

  const { avatar, name, minibio, homepage } = author;

  // Collect social links from author object
  const socials: { key: string; url: string }[] = [];
  if (author.github) socials.push({ key: "github", url: `https://github.com/${author.github}` });
  if (author.twitter) socials.push({ key: "twitter", url: `https://twitter.com/${author.twitter}` });
  if (author.email) socials.push({ key: "email", url: `mailto:${author.email}` });
  if (author.linkedin) socials.push({ key: "linkedin", url: `https://linkedin.com/in/${author.linkedin}` });
  if (author.telegram) socials.push({ key: "telegram", url: `https://t.me/${author.telegram}` });
  if (homepage) socials.push({ key: "homepage", url: homepage });

  if (simple) {
    return (
      <Link
        href={homepage || "#"}
        className={cn("flex items-center gap-2 hover:opacity-80 transition-opacity", className)}
      >
        {avatar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt={name || "Author"}
            width={32}
            height={32}
            className="rounded-full w-8 h-8 object-cover"
          />
        )}
        <span className="text-sm font-medium">{name}</span>
      </Link>
    );
  }

  return (
    <div className={cn("p-6 rounded-xl border bg-card shadow-sm", className)}>
      {/* 居中布局 */}
      <div className="flex flex-col items-center text-center">
        {/* 头像 */}
        {avatar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt={name || "Author"}
            width={80}
            height={80}
            className="rounded-full w-20 h-20 object-cover mb-4"
          />
        )}
        
        {/* 名字 */}
        <h3 className="font-bold text-lg">{name}</h3>
        
        {/* 简介 */}
        {minibio && (
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">{minibio}</p>
        )}
        
        {/* 社交链接 */}
        {socials.length > 0 && (
          <div className="flex items-center justify-center gap-3 mt-4">
            {socials.map(({ key, url }) => {
              const Icon = socialIcons[key];
              if (!Icon) return null;
              return (
                <Link
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
