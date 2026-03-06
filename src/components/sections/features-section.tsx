import Link from "next/link";
import { cn } from "@/lib/utils";
import type { FeaturesSection } from "@/types";

interface FeaturesSectionProps {
  config: FeaturesSection;
}

function FeatureCard({ item, style }: { item: FeaturesSection['items'][number]; style?: string }) {
  const content = (
    <div className={cn(
      "group relative p-6 rounded-xl border bg-card transition-all hover:shadow-md hover:border-primary/20",
      style === "bento" && "p-8"
    )}>
      {item.icon && (
        <div className="text-3xl mb-4">{item.icon}</div>
      )}
      {item.image && (
        <div className="mb-4 rounded-lg overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
        </div>
      )}
      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
        {item.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {item.description}
      </p>
    </div>
  );

  if (item.href) {
    return item.href.startsWith("http") ? (
      <Link href={item.href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </Link>
    ) : (
      <Link href={item.href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

function FeatureIcon({ item }: { item: FeaturesSection['items'][number] }) {
  const content = (
    <div className="group flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-muted/50">
      {item.icon && (
        <div className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</div>
      )}
      <div>
        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );

  if (item.href) {
    return item.href.startsWith("http") ? (
      <Link href={item.href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </Link>
    ) : (
      <Link href={item.href} className="block">{content}</Link>
    );
  }

  return content;
}

export function FeaturesSectionComponent({ config }: FeaturesSectionProps) {
  const columns = config.columns || 3;
  const style = config.style || "cards";

  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  const bentoGridClass = config.items.length === 3
    ? "md:grid-cols-2 lg:grid-cols-3"
    : config.items.length === 4
    ? "md:grid-cols-2"
    : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 md:py-16 lg:py-20">
      {/* Header */}
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

      {/* Grid */}
      <div className={cn(
        "grid gap-6",
        style === "bento" ? bentoGridClass : gridCols[columns]
      )}>
        {config.items.map((item, i) => (
          style === "icons" ? (
            <FeatureIcon key={i} item={item} />
          ) : (
            <FeatureCard key={i} item={item} style={style} />
          )
        ))}
      </div>
    </section>
  );
}
