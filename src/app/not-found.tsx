import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadZoeConfig } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";

export default function NotFound() {
  const config = loadZoeConfig();

  // Build issue link from config if available
  const githubUrl = config.socials?.github
    || (config.author?.github ? `https://github.com/${config.author.github}` : null);
  const issueUrl = githubUrl ? `${githubUrl.replace(/\/$/, '')}/issues` : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* 404 animated number */}
      <div className="relative mb-8">
        <h1 className="text-[10rem] sm:text-[12rem] font-bold text-muted-foreground/20 select-none leading-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl sm:text-7xl animate-bounce">🔍</div>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold mb-4">
        {getLabel(config, 'notFound.title')}
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        {getLabel(config, 'notFound.description')}
        <br />
        {getLabel(config, 'notFound.hint')}
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            {getLabel(config, 'notFound.home')}
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/blog" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            {getLabel(config, 'notFound.blog')}
          </Link>
        </Button>
      </div>

      {issueUrl && (
        <p className="mt-12 text-sm text-muted-foreground">
          {getLabel(config, 'notFound.issueHint')}{" "}
          <Link href={issueUrl} className="text-primary hover:underline">
            {getLabel(config, 'notFound.issueLink')}
          </Link>
          {" "}{getLabel(config, 'notFound.issueEnd')}
        </p>
      )}
    </div>
  );
}
