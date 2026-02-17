import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";
import type { Author, Copyright, Organization } from "@/types";

interface FooterProps {
  organization?: Organization;
  copyright?: Copyright;
  socials?: Record<string, string>;
  author?: Author;
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  twitter: Twitter,
  email: Mail,
};

export function Footer({ organization, copyright, socials, author }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const fromYear = copyright?.from || currentYear;
  const yearRange = fromYear === currentYear ? currentYear : `${fromYear}-${currentYear}`;
  const holder = copyright?.holder || organization?.name || author?.name || "";

  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground md:text-left">
          {copyright?.content || (
            <>
              © {yearRange} {holder}
              {copyright?.location && ` · ${copyright.location}`}
            </>
          )}
        </div>

        {/* Social Links */}
        {socials && Object.keys(socials).length > 0 && (
          <div className="flex items-center space-x-4">
            {Object.entries(socials).map(([name, url]) => {
              const Icon = socialIcons[name.toLowerCase()];
              return (
                <Link
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {Icon ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm capitalize">{name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </footer>
  );
}
