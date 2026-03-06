import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PricingSectionConfig } from "@/types";

interface PricingSectionProps {
  config: PricingSectionConfig;
}

export function PricingSectionComponent({ config }: PricingSectionProps) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 md:py-16 lg:py-20">
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

      <div className={cn(
        "grid gap-6 mx-auto",
        config.plans.length === 1 && "max-w-md",
        config.plans.length === 2 && "md:grid-cols-2 max-w-3xl",
        config.plans.length >= 3 && "md:grid-cols-3"
      )}>
        {config.plans.map((plan, i) => (
          <div
            key={i}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-card p-6 md:p-8 transition-all hover:shadow-md",
              plan.highlighted && "border-primary shadow-lg scale-[1.02] z-10"
            )}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="px-3 py-1">推荐</Badge>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              {plan.description && (
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">/{plan.period}</span>
                )}
              </div>
            </div>

            {plan.cta && (
              <Button
                className="mb-6 w-full"
                variant={plan.highlighted ? "default" : "outline"}
                asChild
              >
                {plan.cta.href.startsWith("http") ? (
                  <Link href={plan.cta.href} target="_blank" rel="noopener noreferrer">
                    {plan.cta.text}
                  </Link>
                ) : (
                  <Link href={plan.cta.href}>{plan.cta.text}</Link>
                )}
              </Button>
            )}

            <ul className="space-y-3 text-sm">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
