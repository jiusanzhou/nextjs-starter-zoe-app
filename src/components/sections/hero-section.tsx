import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TypingText } from "@/components/typing-text";
import { cn } from "@/lib/utils";
import type { HeroSection } from "@/types";

interface HeroSectionProps {
  config: HeroSection;
}

export function HeroSectionComponent({ config }: HeroSectionProps) {
  const isLeft = config.align === "left";

  return (
    <section className="relative overflow-hidden">
      <div className={cn(
        "max-w-5xl mx-auto px-4 py-20 md:py-28 lg:py-36",
        isLeft ? "flex flex-col md:flex-row items-center gap-12" : "text-center"
      )}>
        <div className={cn(isLeft && "flex-1")}>
          {/* Badge */}
          {config.badge && (
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
              {config.badge}
            </Badge>
          )}

          {/* Avatar (personal site mode) */}
          {config.avatar && (
            <div className={cn("mb-6", !isLeft && "flex justify-center")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.avatar}
                alt="Avatar"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-2 ring-border"
              />
            </div>
          )}

          {/* Greeting */}
          {config.greeting && (
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {config.greeting}
            </h1>
          )}

          {/* Typing Texts */}
          {config.typingTexts && config.typingTexts.length > 0 && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-4">
              <TypingText
                texts={config.typingTexts}
                gradient="linear-gradient(to left, #7928CA, #FF0080)"
                underline
                className="px-2"
              />
            </h2>
          )}

          {/* Description */}
          {config.description && (
            <p className={cn(
              "mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed",
              !isLeft && "max-w-2xl mx-auto"
            )}>
              {config.description}
            </p>
          )}

          {/* CTA Buttons */}
          {config.cta && config.cta.length > 0 && (
            <div className={cn(
              "mt-8 flex flex-wrap gap-4",
              !isLeft && "justify-center"
            )}>
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

        {/* Hero Image / Video (right side for left-aligned layout) */}
        {(config.image || config.video) && (
          <div className={cn(
            "relative",
            isLeft ? "flex-1" : "mt-12 max-w-3xl mx-auto"
          )}>
            {config.video ? (
              <video
                src={config.video}
                autoPlay
                loop
                muted
                playsInline
                className="rounded-xl border shadow-2xl w-full"
              />
            ) : config.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.image}
                alt="Hero"
                className="rounded-xl border shadow-2xl w-full"
              />
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
