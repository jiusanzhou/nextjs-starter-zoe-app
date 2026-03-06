import type { Metadata } from "next";
import { loadZoeConfig } from "@/lib/zoefile";
import { PricingTable } from "@/components/pricing";
import { notFound } from "next/navigation";
import { getLabel } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: config.pricing?.title || getLabel(config, 'pricing'),
    description: config.pricing?.description || getLabel(config, 'pricing.description'),
  };
}

export default function PricingPage() {
  const config = loadZoeConfig();
  const pricingConfig = config.pricing;

  if (!pricingConfig?.enabled || !pricingConfig.plans?.length) {
    notFound();
  }

  return (
    <div className="page-pricing">
      {/* Hero */}
      <div className="text-center py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {pricingConfig.title || getLabel(config, 'pricing')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {pricingConfig.description || getLabel(config, 'pricing.description')}
        </p>
      </div>

      <PricingTable
        plans={pricingConfig.plans}
        featureDefinitions={pricingConfig.featureDefinitions}
        yearlyDiscount={pricingConfig.yearlyDiscount}
        showToggle={pricingConfig.showToggle}
      />
    </div>
  );
}
