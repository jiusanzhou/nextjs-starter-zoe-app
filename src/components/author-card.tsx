import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { loadZoeConfig } from "@/lib/zoefile";
import {
  Github,
  Twitter,
  Mail,
  Globe,
  Linkedin,
  MessageCircle,
} from "lucide-react";

interface AuthorCardProps {
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
};

export function AuthorCard({ simple = false, className }: AuthorCardProps) {
  const config = loadZoeConfig();
  const author = config.author;

  if (!author) return null;

  const { avatar, name, minibio, homepage } = author;

  // Collect social links from author object
  const socials: { key: string; url: string }[] = [];
  if (author.github) socials.push({ key: "github", url: `https://github.com/${author.github}` });
  if (author.twitter) socials.push({ key: "twitter", url: `https://twitter.com/${author.twitter}` });
  if (author.email) socials.push({ key: "email", url: `mailto:${author.email}` });
  if (author.linkedin) socials.push({ key: "linkedin", url: `https://linkedin.com/in/${author.linkedin}` });
  if (homepage) socials.push({ key: "homepage", url: homepage });

  if (simple) {
    return (
      <Link
        href={homepage || "#"}
        className={cn("flex items-center gap-2 hover:opacity-80 transition-opacity", className)}
      >
        {avatar && (
          <Image
            src={avatar}
            alt={name || "Author"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-sm font-medium">{name}</span>
      </Link>
    );
  }

  return (
    <div className={cn("p-6 rounded-xl border bg-card", className)}>
      <div className="flex items-start gap-4">
        {avatar && (
          <Image
            src={avatar}
            alt={name || "Author"}
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <div className="flex-1">
          <h3 className="font-bold text-lg">{name}</h3>
          {socials.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {socials.map(({ key, url }) => {
                const Icon = socialIcons[key];
                if (!Icon) return null;
                return (
                  <Link
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {minibio && (
        <p className="mt-4 text-sm text-muted-foreground">{minibio}</p>
      )}
    </div>
  );
}
