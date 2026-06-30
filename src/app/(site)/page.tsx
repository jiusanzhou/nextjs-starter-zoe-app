import type { Metadata } from "next";
import { HomePageView } from "@/components/views/home-view";
import { buildAlternates, getDefaultLocale } from "@/lib/zoefile";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: buildAlternates("/"),
  };
}

export default function HomePage() {
  // i18n: default route must explicitly request default locale,
  // otherwise getPostsMeta() returns posts from all locales (cross-locale leak).
  return <HomePageView locale={getDefaultLocale()} />;
}
