import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LogosSection } from "@/types";

interface LogosSectionProps {
  config: LogosSection;
}

function LogoItem({ item }: { item: LogosSection['items'][number] }) {
  const logo = (
    <div className="flex items-center justify-center px-6 py-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.logo}
        alt={item.name}
        className="h-8 md:h-10 w-auto object-contain"
      />
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} target="_blank" rel="noopener noreferrer">
        {logo}
      </Link>
    );
  }

  return logo;
}

export function LogosSectionComponent({ config }: LogosSectionProps) {
  const isScroll = config.style === "scroll";

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
      {config.title && (
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider font-medium">
          {config.title}
        </p>
      )}

      {isScroll ? (
        <div className="relative overflow-hidden">
          <div className="flex animate-[scroll_30s_linear_infinite] gap-12">
            {/* Duplicate for infinite scroll effect */}
            {[...config.items, ...config.items].map((item, i) => (
              <LogoItem key={i} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className={cn(
          "flex flex-wrap items-center justify-center gap-8 md:gap-12"
        )}>
          {config.items.map((item, i) => (
            <LogoItem key={i} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
