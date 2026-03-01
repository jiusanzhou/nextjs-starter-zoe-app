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
  const socials: { key: string; url: string; label: string }[] = [];
  if (author.email) socials.push({ key: "email", url: `mailto:${author.email}`, label: author.email });
  if (author.github) socials.push({ key: "github", url: `https://github.com/${author.github}`, label: author.github });
  if (author.twitter) socials.push({ key: "twitter", url: `https://twitter.com/${author.twitter}`, label: author.twitter });
  if (author.telegram) socials.push({ key: "telegram", url: `https://t.me/${author.telegram}`, label: author.telegram });
  if (author.linkedin) socials.push({ key: "linkedin", url: `https://linkedin.com/in/${author.linkedin}`, label: author.linkedin });
  if (author.wechat) socials.push({ key: "wechat", url: author.wechat, label: "微信" });

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
    <div className={cn("p-6 sm:p-8 rounded-xl border bg-card shadow-sm", className)}>
      <div className="flex flex-col sm:flex-row gap-6">
        {/* 头像 */}
        {avatar && (
          <div className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar}
              alt={name || "Author"}
              width={112}
              height={112}
              className="rounded-full w-24 h-24 sm:w-28 sm:h-28 object-cover ring-2 ring-border"
            />
          </div>
        )}
        
        {/* 信息 */}
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <h3 className="text-xl font-bold tracking-tight">{name}</h3>
            {minibio && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{minibio}</p>
            )}
          </div>
          
          {/* 社交链接 - pill 标签风格 */}
          {socials.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {socials.map(({ key, url, label }) => {
                const Icon = socialIcons[key];
                if (!Icon) return null;
                
                // 微信特殊处理：hover 显示二维码
                if (key === "wechat") {
                  return (
                    <div key={key} className="relative group">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border bg-background hover:bg-accent transition-colors cursor-pointer"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{label}</span>
                      </span>
                      {/* 二维码弹出层 */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                        <div className="bg-card border rounded-xl shadow-lg p-3 w-48">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt="微信二维码"
                            width={168}
                            height={168}
                            className="w-full h-auto rounded-lg"
                          />
                          <p className="text-xs text-center text-muted-foreground mt-2">扫码添加微信</p>
                        </div>
                        {/* 小三角 */}
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-card border-b border-r rotate-45 shadow-sm" />
                      </div>
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border bg-background hover:bg-accent transition-colors"
                    title={label}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          )}
          
          {/* 个人主页 */}
          {homepage && (
            <Link href={homepage} target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-primary hover:underline">
              {homepage}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
