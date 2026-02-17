/**
 * MDX Utilities
 * MDX 工具函数 - 使用 Shiki 进行代码高亮
 */

import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { createHighlighter, type Highlighter } from 'shiki';

// 缓存 highlighter 实例
let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: [
        'javascript',
        'typescript',
        'jsx',
        'tsx',
        'json',
        'yaml',
        'markdown',
        'bash',
        'shell',
        'css',
        'html',
        'python',
        'go',
        'rust',
        'sql',
        'diff',
        'plaintext',
      ],
    });
  }
  return highlighterPromise;
}

/**
 * 使用 Shiki 高亮代码块
 */
async function highlightCode(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter();
  
  // 确保语言被支持，否则回退到 plaintext
  const loadedLangs = highlighter.getLoadedLanguages();
  const finalLang = loadedLangs.includes(lang as never) ? lang : 'plaintext';
  
  try {
    return highlighter.codeToHtml(code, {
      lang: finalLang,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    });
  } catch {
    // 如果高亮失败，返回简单的 pre/code
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 将 Markdown 转换为 HTML（带代码高亮）
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  // 先用 remark 转换为 HTML
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
  
  let html = result.toString();
  
  // 后处理：找到所有 <pre><code> 块并用 shiki 高亮
  const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g;
  const codeBlockRegexNoLang = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
  
  // 收集所有需要高亮的代码块
  const matches: Array<{ full: string; lang: string; code: string }> = [];
  
  let match: RegExpExecArray | null;
  while ((match = codeBlockRegex.exec(html)) !== null) {
    matches.push({
      full: match[0],
      lang: match[1],
      code: decodeHtmlEntities(match[2]),
    });
  }
  
  let matchNoLang: RegExpExecArray | null;
  while ((matchNoLang = codeBlockRegexNoLang.exec(html)) !== null) {
    // 跳过已经被上面正则匹配的
    if (!matches.some(m => m.full === matchNoLang![0])) {
      matches.push({
        full: matchNoLang[0],
        lang: 'plaintext',
        code: decodeHtmlEntities(matchNoLang[1]),
      });
    }
  }
  
  // 并行高亮所有代码块
  const highlighted = await Promise.all(
    matches.map(async ({ full, lang, code }) => ({
      full,
      highlighted: await highlightCode(code, lang),
    }))
  );
  
  // 替换原始代码块
  for (const { full, highlighted: highlightedCode } of highlighted) {
    html = html.replace(full, highlightedCode);
  }
  
  return html;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");
}
