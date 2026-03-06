"use client";

import { useState } from "react";
import { AuthorCard } from "@/components/author-card";
import {
  Mail,
  MessageSquare,
  Github,
  Globe,
  Phone,
  Send,
  Linkedin,
  Twitter,
  CheckCircle,
} from "lucide-react";
import { getLabel } from "@/lib/i18n";
import type { ContactSection, Author, ZoeSiteConfig } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  mail: Mail,
  message: MessageSquare,
  github: Github,
  globe: Globe,
  phone: Phone,
  linkedin: Linkedin,
  twitter: Twitter,
  send: Send,
};

interface ContactSectionProps {
  config: ContactSection;
  author?: Author;
  siteConfig?: ZoeSiteConfig;
}

export function ContactSectionComponent({
  config,
  author,
  siteConfig,
}: ContactSectionProps) {
  const style = config.style || "card";

  return (
    <section className="section-base contact-section max-w-5xl mx-auto px-4 py-12 md:py-16 lg:py-20">
      {/* Header for card and simple modes */}
      {style !== "form" && (config.title || config.description) && (
        <div className="text-center mb-12">
          {config.title && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              {config.title}
            </h2>
          )}
          {config.description && (
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              {config.description}
            </p>
          )}
        </div>
      )}

      {style === "card" && <CardMode author={author} />}
      {style === "form" && (
        <FormMode config={config} siteConfig={siteConfig} />
      )}
      {style === "simple" && <SimpleMode config={config} />}
    </section>
  );
}

// --- Card mode (AuthorCard, preserved for personal sites) ---

function CardMode({ author }: { author?: Author }) {
  return (
    <div className="flex justify-center">
      <AuthorCard author={author} className="max-w-lg" />
    </div>
  );
}

// --- Form mode (product contact page) ---

function FormMode({
  config,
  siteConfig,
}: {
  config: ContactSection;
  siteConfig?: ZoeSiteConfig;
}) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="grid md:grid-cols-5 gap-12 lg:gap-16 items-start">
      {/* Left: Info */}
      <div className="md:col-span-2 space-y-6">
        {config.title && (
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {config.title}
          </h2>
        )}
        {config.description && (
          <p className="text-muted-foreground leading-relaxed">
            {config.description}
          </p>
        )}
        {config.email && (
          <a
            href={`mailto:${config.email}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4" />
            {config.email}
          </a>
        )}
        {config.links && config.links.length > 0 && (
          <div className="space-y-3 pt-2">
            {config.links.map((link, i) => {
              const Icon = link.icon ? iconMap[link.icon] || Globe : Globe;
              return (
                <a
                  key={i}
                  href={link.href}
                  target={
                    link.href.startsWith("mailto:") || link.href === "#"
                      ? undefined
                      : "_blank"
                  }
                  rel="noopener noreferrer"
                  className="contact-link flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                >
                  <Icon className="h-5 w-5 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <div>
                    <div className="font-medium text-sm">{link.title}</div>
                    {link.description && (
                      <div className="text-xs text-muted-foreground">
                        {link.description}
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Form */}
      <div className="md:col-span-3">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-primary" />
            </div>
            <p className="text-muted-foreground text-lg">
              {getLabel(siteConfig, "contact.form.sent")}
            </p>
          </div>
        ) : (
          <form
            className="contact-form space-y-5 p-6 lg:p-8 rounded-xl border bg-card"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {getLabel(siteConfig, "contact.form.name")}
                </label>
                <input
                  type="text"
                  placeholder={getLabel(
                    siteConfig,
                    "contact.form.namePlaceholder"
                  )}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {getLabel(siteConfig, "contact.form.email")}
                </label>
                <input
                  type="email"
                  placeholder={getLabel(
                    siteConfig,
                    "contact.form.emailPlaceholder"
                  )}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                {getLabel(siteConfig, "contact.form.message")}
              </label>
              <textarea
                rows={5}
                placeholder={getLabel(
                  siteConfig,
                  "contact.form.messagePlaceholder"
                )}
                className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              {getLabel(siteConfig, "contact.form.submit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// --- Simple mode (centered with contact link cards) ---

function SimpleMode({ config }: { config: ContactSection }) {
  return (
    <>
      {config.email && (
        <div className="text-center mb-8">
          <a
            href={`mailto:${config.email}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4" />
            {config.email}
          </a>
        </div>
      )}
      {config.links && config.links.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {config.links.map((link, i) => {
            const Icon = link.icon ? iconMap[link.icon] || Globe : Globe;
            return (
              <a
                key={i}
                href={link.href}
                target={
                  link.href.startsWith("mailto:") || link.href === "#"
                    ? undefined
                    : "_blank"
                }
                rel="noopener noreferrer"
                className="contact-link feature-card p-6 rounded-xl border bg-card text-center hover:-translate-y-1 hover:shadow-lg transition-all group"
              >
                <Icon className="h-8 w-8 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="font-medium">{link.title}</div>
                {link.description && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {link.description}
                  </div>
                )}
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
