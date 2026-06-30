import { HomePageView } from "@/components/views/home-view";

export const revalidate = 3600;

export default function HomePage() {
  return <HomePageView />;
}
