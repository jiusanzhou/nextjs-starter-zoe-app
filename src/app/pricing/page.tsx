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
    <div className="container py-8">
      <PricingTable
        plans={pricingConfig.plans}
        featureDefinitions={pricingConfig.featureDefinitions}
        title={pricingConfig.title}
        description={pricingConfig.description}
        yearlyDiscount={pricingConfig.yearlyDiscount}
        showToggle={pricingConfig.showToggle}
      />
    </div>
  );
}
