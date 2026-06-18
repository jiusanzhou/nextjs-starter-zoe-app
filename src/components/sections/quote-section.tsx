import Link from "next/link";
import { Section } from "@/components/section";
import { Quote as QuoteIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuoteSection } from "@/types";

interface QuoteSectionProps {
  config: QuoteSection;
}

export function QuoteSectionComponent({ config }: QuoteSectionProps) {
  const align = config.align || "center";

  return (
    <Section
      title={config.title}
      description={config.description}
      position={align}
    >
      <div
        className={cn(
          "max-w-3xl",
          align === "center" ? "mx-auto text-center" : "mx-0 text-left",
        )}
      >
        <figure className="relative">
          <QuoteIcon
            aria-hidden
            className={cn(
              "absolute -top-6 h-16 w-16 text-primary/10",
              align === "center" ? "left-1/2 -translate-x-1/2" : "-left-2",
            )}
          />
          <blockquote
            className={cn(
              "relative font-serif italic leading-relaxed",
              "text-xl md:text-2xl lg:text-3xl tracking-tight",
              "text-foreground/90",
            )}
          >
            <p className="font-semibold">{config.quote}</p>
          </blockquote>
          {config.cite && (
            <figcaption className="mt-4 text-sm text-muted-foreground">
              — {config.cite}
            </figcaption>
          )}
          {config.link && (
            <div
              className={cn(
                "mt-6 flex",
                align === "center" ? "justify-center" : "justify-start",
              )}
            >
              {config.link.href.startsWith("http") ? (
                <Link
                  href={config.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {config.link.text} →
                </Link>
              ) : (
                <Link
                  href={config.link.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {config.link.text} →
                </Link>
              )}
            </div>
          )}
        </figure>
      </div>
    </Section>
  );
}
