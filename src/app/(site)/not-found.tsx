import { NotFoundView } from "@/components/views/not-found-view";
import { getDefaultLocale, isI18nEnabled } from "@/lib/zoefile";

/**
 * (site) group not-found — used when a request enters this group but
 * matches no route (e.g. `notFound()` called inside a `(site)/` page).
 *
 * SiteShell is provided by `(site)/layout.tsx`, so no `withShell`.
 */
export default function SiteNotFound() {
  const locale = isI18nEnabled() ? getDefaultLocale() : undefined;
  return <NotFoundView locale={locale} />;
}
