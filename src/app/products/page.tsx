import type { Metadata } from "next";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { ProductsList } from "@/components/product-card";
import { loadZoeConfig } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: getLabel(config, "products"),
    description: getLabel(config, "products.description"),
  };
}

export const revalidate = 3600;

async function ProductsContent() {
  const config = await loadZoeConfig();
  const products = config.products ?? [];

  return (
    <div className="page-products max-w-6xl mx-auto px-4">
      {/* Hero */}
      <div className="text-center py-10 md:py-16">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {getLabel(config, "products")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {getLabel(config, "products.description")}
        </p>
        {products.length > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            {getLabel(config, "products.count", { count: products.length })}
          </p>
        )}
      </div>

      {products.length > 0 ? (
        <ProductsList products={products} />
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">{getLabel(config, "products.noProducts")}</p>
        </div>
      )}

      <div className="h-16" />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="page-products max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {getLabel(loadZoeConfig(), "products")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {getLabel(loadZoeConfig(), "loading")}
          </p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
