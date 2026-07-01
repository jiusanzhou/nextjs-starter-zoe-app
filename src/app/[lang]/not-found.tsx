import { NotFoundView } from "@/components/views/not-found-view";
import { getDefaultLocale, isI18nEnabled } from "@/lib/zoefile";

/**
 * [lang] group not-found — triggered when `notFound()` fires inside a
 * `[lang]/**` page. SiteShell is already provided by `[lang]/layout.tsx`.
 *
 * We can't read `params.lang` in a server-side not-found (Next.js doesn't
 * pass params to `not-found.tsx`), so we default to the site's default
 * locale copy. Static export only ships one `404.html` anyway, so this is
 * consistent with root behavior.
 */
export default function LangNotFound() {
  const locale = isI18nEnabled() ? getDefaultLocale() : undefined;
  return <NotFoundView locale={locale} />;
}
