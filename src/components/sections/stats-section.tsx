import { cn } from "@/lib/utils";
import type { StatsSection } from "@/types";

interface StatsSectionProps {
  config: StatsSection;
}

export function StatsSectionComponent({ config }: StatsSectionProps) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 md:py-16 lg:py-20">
      {config.title && (
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            {config.title}
          </h2>
        </div>
      )}

      <div className={cn(
        "grid gap-8 text-center",
        config.items.length <= 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4"
      )}>
        {config.items.map((item, i) => (
          <div key={i} className="space-y-2">
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary">
              {item.value}
            </div>
            <div className="text-sm font-medium text-foreground">
              {item.label}
            </div>
            {item.description && (
              <div className="text-xs text-muted-foreground">
                {item.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
