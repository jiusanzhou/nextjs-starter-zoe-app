import type { Metadata } from "next";
import { loadZoeConfig, buildAlternates, getDefaultLocale } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";
import { ProjectsView } from "@/components/views/projects-view";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const config = loadZoeConfig();
  return {
    title: getLabel(config, "projects"),
    description: getLabel(config, "projects.description"),
    alternates: buildAlternates("/projects", getDefaultLocale()),
  };
}

export default function ProjectsPage() {
  return <ProjectsView />;
}
