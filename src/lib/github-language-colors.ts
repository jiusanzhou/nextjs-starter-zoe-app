/**
 * GitHub language colors (subset, matches GitHub.com).
 * Source: https://github.com/github-linguist/linguist/blob/master/lib/linguist/languages.yml
 */
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Go: "#00ADD8",
  Rust: "#dea584",
  Python: "#3572A5",
  Dart: "#00B4AB",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Lua: "#000080",
  Zig: "#ec915c",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Scala: "#c22d40",
  R: "#198CE7",
  MDX: "#fcb32c",
  Solidity: "#AA6746",
};

export function getLanguageColor(language?: string | null): string {
  if (!language) return "#94a3b8"; // slate-400
  return LANGUAGE_COLORS[language] || "#94a3b8";
}
