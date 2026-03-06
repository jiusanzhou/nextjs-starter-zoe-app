import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CTASection } from "@/types";

interface CTASectionProps {
  config: CTASection;
}

export function CTASectionComponent({ config }: CTASectionProps) {
  const style = config.style || "simple";

  return (
    <section className="section-base max-w-5xl mx-auto px-4 py-12 md:py-16 lg:py-20">
      <div className={cn(
        "cta-section rounded-2xl px-8 py-12 md:px-16 md:py-16 text-center",
        style === "gradient" && "cta-gradient bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border",
        style === "card" && "border bg-card shadow-sm",
        style === "simple" && "bg-muted/50"
      )}>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
          {config.title}
        </h2>
        {config.description && (
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            {config.description}
          </p>
        )}
        {config.cta && config.cta.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {config.cta.map((btn, i) => (
              <Button
                key={btn.href}
                variant={btn.variant || (i === 0 ? "default" : "outline")}
                asChild
                size="lg"
              >
                {btn.href.startsWith("http") ? (
                  <Link href={btn.href} target="_blank" rel="noopener noreferrer">
                    {btn.text}
                  </Link>
                ) : (
                  <Link href={btn.href}>{btn.text}</Link>
                )}
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
