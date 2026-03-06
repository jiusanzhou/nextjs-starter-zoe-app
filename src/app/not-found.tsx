import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadZoeConfig } from "@/lib/zoefile";
import { getLabel } from "@/lib/i18n";

export default function NotFound() {
  const config = loadZoeConfig();

  const githubUrl = config.socials?.github
    || (config.author?.github ? `https://github.com/${config.author.github}` : null);
  const issueUrl = githubUrl ? `${githubUrl.replace(/\/$/, '')}/issues` : null;

  return (
    <div className="page-not-found flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* 404 animated number */}
      <div className="relative mb-8">
        <h1 className="text-[8rem] sm:text-[10rem] font-bold text-muted-foreground/10 select-none leading-none tracking-tighter">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground animate-pulse" />
          </div>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold mb-3">
        {getLabel(config, 'notFound.title')}
      </h2>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        {getLabel(config, 'notFound.description')}
      </p>

      <div className="flex flex-wrap justify-center gap-3">
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
