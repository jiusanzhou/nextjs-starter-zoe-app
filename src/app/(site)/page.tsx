import type { Metadata } from "next";
import { HomePageView } from "@/components/views/home-view";
import { buildAlternates } from "@/lib/zoefile";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: buildAlternates("/"),
  };
}

export default function HomePage() {
  return <HomePageView />;
}
