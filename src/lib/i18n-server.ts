/**
 * i18n server-only helpers
 *
 * 这些 helper 依赖 `zoefile.ts`（含 `fs`/`path`），不能被 client component 引用。
 * Client component 应使用 `i18n.ts` 中的 `getLabel(config, ...)`，并通过
 * server component / props 把 config 传下来。
 */

import { loadZoeConfig } from './zoefile';
import { getLabel } from './i18n';

/**
 * 加载某个 locale 的 config，并解析 label。
 *
 * Server component / route handler 已知 locale 时的便利方法。
 */
export function getLabelForLocale(
  locale: string | undefined,
  key: string,
  vars?: Record<string, string | number>
): string {
  const config = loadZoeConfig(locale);
  return getLabel(config, key, vars);
}
