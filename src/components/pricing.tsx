"use client";

import React from "react";
import { Check, X, Sparkles, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FeatureDefinition {
  id: string;
  name: string;
  tooltip?: string;
}

export interface PlanFeatureValue {
  [featureId: string]: boolean | string | number;
}

export interface LegacyPricingFeature {
  name: string;
  included: boolean | string;
  tooltip?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  priceUnit?: string;
  originalPrice?: number;
  currency?: string;
  features?: PlanFeatureValue | LegacyPricingFeature[];
  cta?: string;
  ctaLink?: string;
  popular?: boolean;
  badge?: string;
}

interface PricingTableProps {
  featureDefinitions?: FeatureDefinition[];
  plans: PricingPlan[];
  title?: string;
  description?: string;
  yearlyDiscount?: number;
  showToggle?: boolean;
  className?: string;
  monthlyLabel?: string;
  yearlyLabel?: string;
  yearlySaveLabel?: string;
  ctaLabel?: string;
  badgeLabel?: string;
}

function renderFeatureValue(value: boolean | string | number | undefined) {
  if (value === true) {
    return <Check className="h-5 w-5 text-green-500" />;
  }
  if (value === false) {
    return <X className="h-5 w-5 text-muted-foreground/50" />;
  }
  if (value === undefined || value === null || value === "") {
    return <Minus className="h-5 w-5 text-muted-foreground/30" />;
  }
  return <span className="text-sm font-medium">{value}</span>;
}

export function PricingCard({
  plan,
  featureDefinitions,
  yearly = false,
  yearlyDiscount = 0,
  ctaLabel = "Get Started",
  badgeLabel = "Recommended",
}: {
  plan: PricingPlan;
  featureDefinitions?: FeatureDefinition[];
  yearly?: boolean;
  yearlyDiscount?: number;
  ctaLabel?: string;
  badgeLabel?: string;
}) {
  const currency = plan.currency || "$";
  const priceUnit = plan.priceUnit || "/mo";

  let displayPrice = plan.price;
  let displayUnit = priceUnit;

  if (yearly && typeof plan.price === "number" && yearlyDiscount > 0) {
    const yearlyPrice = plan.price * 12 * (1 - yearlyDiscount / 100);
    displayPrice = Math.round(yearlyPrice);
    displayUnit = "/yr";
  }

  const isLegacyFormat = Array.isArray(plan.features);
  const legacyFeatures = isLegacyFormat ? (plan.features as LegacyPricingFeature[]) : [];
  const featureMap = !isLegacyFormat ? (plan.features as PlanFeatureValue || {}) : {};

  return (
    <div
      className={cn(
        "pricing-card relative flex flex-col rounded-2xl border bg-card p-6 lg:p-8 shadow-sm transition-all hover:shadow-md",
        plan.popular && "highlighted border-primary shadow-lg scale-[1.02] z-10"
      )}
    >
      {/* Badge */}
      {(plan.popular || plan.badge) && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-sm">
            {plan.popular && <Sparkles className="h-3 w-3" />}
            {plan.badge || badgeLabel}
          </span>
        </div>
      )}

      {/* Plan name */}
      <div className="mb-6">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        {plan.description && (
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{plan.description}</p>
        )}
      </div>

      {/* Price */}
      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-lg text-muted-foreground">{currency}</span>
          <span className="text-5xl font-bold tracking-tight">
            {typeof displayPrice === "number" ? displayPrice : displayPrice}
          </span>
          <span className="text-muted-foreground ml-1">{displayUnit}</span>
        </div>
        {plan.originalPrice && (
          <div className="mt-1.5 text-sm text-muted-foreground line-through">
            {currency}{plan.originalPrice}{priceUnit}
          </div>
        )}
      </div>

      {/* CTA */}
      <Button
        className="mb-8 w-full h-11"
        variant={plan.popular ? "default" : "outline"}
        asChild={!!plan.ctaLink}
      >
        {plan.ctaLink ? (
          <a href={plan.ctaLink}>{plan.cta || ctaLabel}</a>
        ) : (
          <span>{plan.cta || ctaLabel}</span>
        )}
      </Button>

      {/* Divider */}
      <div className="border-t mb-6" />

      {/* Features */}
      <ul className="space-y-3.5 text-sm flex-1">
        {featureDefinitions && featureDefinitions.length > 0 && !isLegacyFormat && (
          featureDefinitions.map((feature) => {
            const value = featureMap[feature.id];
            const isIncluded = value !== false && value !== undefined && value !== null && value !== "";

            return (
              <li key={feature.id} className="flex items-center justify-between gap-3">
                <span className={cn(!isIncluded && "text-muted-foreground/50")}>
                  {feature.name}
                </span>
                {renderFeatureValue(value)}
              </li>
            );
          })
        )}

        {isLegacyFormat && legacyFeatures.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            {feature.included === true ? (
              <Check className="h-5 w-5 shrink-0 text-green-500" />
            ) : feature.included === false ? (
              <X className="h-5 w-5 shrink-0 text-muted-foreground/50" />
            ) : (
              <Check className="h-5 w-5 shrink-0 text-green-500" />
            )}
            <span className={cn(feature.included === false && "text-muted-foreground/50")}>
              {feature.name}
              {typeof feature.included === "string" && (
                <span className="ml-1 text-muted-foreground">({feature.included})</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PricingTable({
  featureDefinitions,
  plans,
  title,
  description,
  yearlyDiscount = 20,
  showToggle = true,
  className,
  monthlyLabel = "Monthly",
  yearlyLabel = "Yearly",
  yearlySaveLabel,
  ctaLabel = "Get Started",
  badgeLabel = "Recommended",
}: PricingTableProps) {
  const [yearly, setYearly] = React.useState(false);
  const saveLabel = yearlySaveLabel || `Save ${yearlyDiscount}%`;

  return (
    <div className={cn("py-4", className)}>
      {/* Title (for backward compat when used standalone) */}
      {(title || description) && (
        <div className="mb-10 text-center">
          {title && <h2 className="text-3xl font-bold tracking-tight">{title}</h2>}
          {description && (
            <p className="mt-3 text-lg text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Monthly/Yearly toggle */}
      {showToggle && yearlyDiscount > 0 && (
        <div className="mb-10 flex items-center justify-center gap-4">
          <span className={cn("text-sm transition-colors", !yearly ? "font-medium text-foreground" : "text-muted-foreground")}>{monthlyLabel}</span>
          <button
            onClick={() => setYearly(!yearly)}
            className={cn(
              "relative h-7 w-12 rounded-full transition-colors",
              yearly ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
                yearly && "translate-x-5"
              )}
            />
          </button>
          <span className={cn("text-sm transition-colors", yearly ? "font-medium text-foreground" : "text-muted-foreground")}>
            {yearlyLabel}
            <span className="ml-1.5 text-xs text-green-600 dark:text-green-400 font-medium">{saveLabel}</span>
          </span>
        </div>
      )}

      {/* Pricing cards */}
      <div
        className={cn(
          "grid gap-6 lg:gap-8 mx-auto max-w-5xl",
          plans.length === 1 && "max-w-md",
          plans.length === 2 && "md:grid-cols-2 max-w-3xl",
          plans.length >= 3 && "md:grid-cols-3"
        )}
      >
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            featureDefinitions={featureDefinitions}
            yearly={yearly}
            yearlyDiscount={yearlyDiscount}
            ctaLabel={ctaLabel}
            badgeLabel={badgeLabel}
          />
        ))}
      </div>
    </div>
  );
}
