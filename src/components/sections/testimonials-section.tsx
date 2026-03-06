import { cn } from "@/lib/utils";
import type { TestimonialsSection } from "@/types";

interface TestimonialsSectionProps {
  config: TestimonialsSection;
}

export function TestimonialsSectionComponent({ config }: TestimonialsSectionProps) {
  const columns = config.items.length <= 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="section-base max-w-5xl mx-auto px-4 py-12 md:py-16 lg:py-20">
      {(config.title || config.description) && (
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

      <div className={cn("grid gap-6", columns)}>
        {config.items.map((item, i) => (
          <div
            key={i}
            className="testimonial-card relative p-6 rounded-xl border bg-card"
          >
            {/* Quote */}
            <blockquote className="text-sm leading-relaxed text-foreground/90 mb-6">
              &ldquo;{item.content}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3">
              {item.avatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
         <div className="font-medium text-sm">{item.author}</div>
                {(item.role || item.company) && (
                  <div className="text-xs text-muted-foreground">
                    {[item.role, item.company].filter(Boolean).join(" · ")}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
