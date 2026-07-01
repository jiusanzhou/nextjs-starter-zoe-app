import { NotFoundView } from "@/components/views/not-found-view";
import { getDefaultLocale, isI18nEnabled } from "@/lib/zoefile";

/**
 * Root not-found handler.
 *
 * Under `output: export` this is what Next.js renders into `out/404.html`
 * (the GitHub Pages fallback for unknown paths). Unlike `(site)/not-found.tsx`,
 * this file does NOT inherit `(site)/layout.tsx`, so it must include the
 * SiteShell (navbar/footer) itself.
 *
 * We default to the site's default locale — non-default locale 404s go
 * through `[lang]/not-found.tsx`, but static export can only ship one 404.html,
 * so this becomes the universal fallback.
 */
export default function RootNotFound() {
  const locale = isI18nEnabled() ? getDefaultLocale() : undefined;
  return <NotFoundView locale={locale} withShell />;
}
