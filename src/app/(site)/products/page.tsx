import type { Metadata } from "next";
import { loadZoeConfig, buildAlternates, getDefaultLocale } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { ProductsView } from "@/components/views/products-view";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: getLabel(config, "products"),
    description: getLabel(config, "products.description"),
    alternates: buildAlternates("/products", getDefaultLocale()),
  };
}

export default function ProductsPage() {
  return <ProductsView />;
}
