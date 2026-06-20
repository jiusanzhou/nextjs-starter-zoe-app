import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsList } from "@/components/product-card";
import { getLabel } from "@/lib/i18n";
import type { ProductsSection, ZoeSiteConfig } from "@/types";

interface ProductsSectionProps {
  config: ProductsSection;
  siteConfig?: ZoeSiteConfig;
}

export function ProductsSectionComponent({ config, siteConfig }: ProductsSectionProps) {
  const products = config.items ?? siteConfig?.products ?? [];
  if (products.length === 0) return null;

  const limit = config.limit ?? 6;
  const showMore = config.showMore ?? products.length > limit;
  const moreHref = config.moreHref ?? "/products";

  return (
    <section className="section-base max-w-6xl mx-auto px-4 py-12 md:py-16 lg:py-20">
      {(config.title || config.description) && (
        <div className="text-center mb-10 md:mb-12">
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

      <ProductsList products={products} limit={limit} />

      {showMore && (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" asChild>
            <Link href={moreHref} className="flex items-center gap-2">
              {getLabel(siteConfig, "products.viewMore")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
