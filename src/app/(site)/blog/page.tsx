import type { Metadata } from "next";
import { loadZoeConfig, buildAlternates } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { BlogIndexView } from "@/components/views/blog-index-view";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: config.blog?.title || getLabel(config, "blog"),
    description: config.blog?.description,
    alternates: buildAlternates("/blog"),
  };
}

export default function BlogPage() {
  return <BlogIndexView />;
}
