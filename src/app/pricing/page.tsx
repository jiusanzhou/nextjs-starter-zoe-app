import type { Metadata } from "next";
import { loadZoeConfig } from "@/lib/zoefile";
import { PricingTable } from "@/components/pricing";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: config.pricing?.title || "价格",
    description: config.pricing?.description || "选择适合您的方案",
  };
}

export default function PricingPage() {
  const config = loadZoeConfig();
  const pricingConfig = config.pricing;

  // 如果没有配置 pricing，返回 404
  if (!pricingConfig?.enabled || !pricingConfig.plans?.length) {
    notFound();
  }

  return (
    <div className="container py-8">
      <PricingTable
        plans={pricingConfig.plans}
        title={pricingConfig.title}
        description={pricingConfig.description}
        yearlyDiscount={pricingConfig.yearlyDiscount}
        showToggle={pricingConfig.showToggle}
      />
    </div>
  );
}
