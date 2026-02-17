/**
 * Theme System
 * 主题系统 - 支持多种预设主题
 */

export interface ThemeColors {
  // 基础色
  background: string;
  foreground: string;
  
  // 卡片
  card: string;
  cardForeground: string;
  
  // 弹出层
  popover: string;
  popoverForeground: string;
  
  // 主色
  primary: string;
  primaryForeground: string;
  
  // 次要色
  secondary: string;
  secondaryForeground: string;
  
  // 静音色
  muted: string;
  mutedForeground: string;
  
  // 强调色
  accent: string;
  accentForeground: string;
  
  // 危险色
  destructive: string;
  
  // 边框
  border: string;
  input: string;
  ring: string;
}

export interface ThemeConfig {
  name: string;
  label: string;
  description?: string;
  light: ThemeColors;
  dark: ThemeColors;
  // 字体
  fontSans?: string;
  fontMono?: string;
  // 圆角
  radius?: string;
}

// 默认主题 - 优化后的 Zoe 主题
export const defaultTheme: ThemeConfig = {
  name: 'default',
  label: '默认',
  description: '简洁优雅的默认主题',
  radius: '0.5rem',
  fontSans: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontMono: '"JetBrains Mono", "Fira Code", monospace',
  light: {
    background: 'oklch(0.99 0.002 240)',
    foreground: 'oklch(0.20 0.02 240)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.20 0.02 240)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.20 0.02 240)',
    primary: 'oklch(0.55 0.25 280)',
    primaryForeground: 'oklch(0.98 0 0)',
    secondary: 'oklch(0.96 0.01 240)',
    secondaryForeground: 'oklch(0.25 0.02 240)',
    muted: 'oklch(0.96 0.01 240)',
    mutedForeground: 'oklch(0.50 0.02 240)',
    accent: 'oklch(0.96 0.01 240)',
    accentForeground: 'oklch(0.25 0.02 240)',
    destructive: 'oklch(0.55 0.22 25)',
    border: 'oklch(0.92 0.01 240)',
    input: 'oklch(0.92 0.01 240)',
    ring: 'oklch(0.55 0.25 280)',
  },
  dark: {
    background: 'oklch(0.12 0.02 260)',
    foreground: 'oklch(0.95 0.01 240)',
    card: 'oklch(0.16 0.02 260)',
    cardForeground: 'oklch(0.95 0.01 240)',
    popover: 'oklch(0.16 0.02 260)',
    popoverForeground: 'oklch(0.95 0.01 240)',
    primary: 'oklch(0.70 0.20 280)',
    primaryForeground: 'oklch(0.15 0.02 260)',
    secondary: 'oklch(0.22 0.02 260)',
    secondaryForeground: 'oklch(0.95 0.01 240)',
    muted: 'oklch(0.22 0.02 260)',
    mutedForeground: 'oklch(0.65 0.02 240)',
    accent: 'oklch(0.22 0.02 260)',
    accentForeground: 'oklch(0.95 0.01 240)',
    destructive: 'oklch(0.65 0.22 25)',
    border: 'oklch(0.25 0.02 260)',
    input: 'oklch(0.25 0.02 260)',
    ring: 'oklch(0.70 0.20 280)',
  },
};

// 科技感主题 - Cyber
export const cyberTheme: ThemeConfig = {
  name: 'cyber',
  label: '科技',
  description: '未来科技感主题',
  radius: '0.25rem',
  fontSans: '"Space Grotesk", "Roboto Mono", monospace',
  fontMono: '"Fira Code", monospace',
  light: {
    background: 'oklch(0.98 0.01 200)',
    foreground: 'oklch(0.15 0.05 230)',
    card: 'oklch(0.99 0.005 200)',
    cardForeground: 'oklch(0.15 0.05 230)',
    popover: 'oklch(0.99 0.005 200)',
    popoverForeground: 'oklch(0.15 0.05 230)',
    primary: 'oklch(0.60 0.25 195)',
    primaryForeground: 'oklch(0.98 0 0)',
    secondary: 'oklch(0.95 0.02 200)',
    secondaryForeground: 'oklch(0.20 0.05 230)',
    muted: 'oklch(0.95 0.02 200)',
    mutedForeground: 'oklch(0.45 0.03 230)',
    accent: 'oklch(0.65 0.25 160)',
    accentForeground: 'oklch(0.98 0 0)',
    destructive: 'oklch(0.55 0.25 25)',
    border: 'oklch(0.88 0.03 200)',
    input: 'oklch(0.92 0.02 200)',
    ring: 'oklch(0.60 0.25 195)',
  },
  dark: {
    background: 'oklch(0.10 0.03 240)',
    foreground: 'oklch(0.90 0.02 195)',
    card: 'oklch(0.13 0.04 240)',
    cardForeground: 'oklch(0.90 0.02 195)',
    popover: 'oklch(0.13 0.04 240)',
    popoverForeground: 'oklch(0.90 0.02 195)',
    primary: 'oklch(0.75 0.25 195)',
    primaryForeground: 'oklch(0.10 0.03 240)',
    secondary: 'oklch(0.18 0.04 240)',
    secondaryForeground: 'oklch(0.90 0.02 195)',
    muted: 'oklch(0.18 0.04 240)',
    mutedForeground: 'oklch(0.60 0.03 195)',
    accent: 'oklch(0.70 0.25 160)',
    accentForeground: 'oklch(0.10 0.03 240)',
    destructive: 'oklch(0.60 0.25 25)',
    border: 'oklch(0.25 0.05 240)',
    input: 'oklch(0.20 0.04 240)',
    ring: 'oklch(0.75 0.25 195)',
  },
};

// 极简主题 - Minimal
export const minimalTheme: ThemeConfig = {
  name: 'minimal',
  label: '极简',
  description: '黑白极简主义',
  radius: '0',
  fontSans: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  fontMono: '"SF Mono", monospace',
  light: {
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.10 0 0)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.10 0 0)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.10 0 0)',
    primary: 'oklch(0.10 0 0)',
    primaryForeground: 'oklch(1 0 0)',
    secondary: 'oklch(0.96 0 0)',
    secondaryForeground: 'oklch(0.10 0 0)',
    muted: 'oklch(0.96 0 0)',
    mutedForeground: 'oklch(0.45 0 0)',
    accent: 'oklch(0.96 0 0)',
    accentForeground: 'oklch(0.10 0 0)',
    destructive: 'oklch(0.50 0.20 25)',
    border: 'oklch(0.90 0 0)',
    input: 'oklch(0.90 0 0)',
    ring: 'oklch(0.10 0 0)',
  },
  dark: {
    background: 'oklch(0.10 0 0)',
    foreground: 'oklch(0.95 0 0)',
    card: 'oklch(0.13 0 0)',
    cardForeground: 'oklch(0.95 0 0)',
    popover: 'oklch(0.13 0 0)',
    popoverForeground: 'oklch(0.95 0 0)',
    primary: 'oklch(0.95 0 0)',
    primaryForeground: 'oklch(0.10 0 0)',
    secondary: 'oklch(0.20 0 0)',
    secondaryForeground: 'oklch(0.95 0 0)',
    muted: 'oklch(0.20 0 0)',
    mutedForeground: 'oklch(0.60 0 0)',
    accent: 'oklch(0.20 0 0)',
    accentForeground: 'oklch(0.95 0 0)',
    destructive: 'oklch(0.60 0.20 25)',
    border: 'oklch(0.25 0 0)',
    input: 'oklch(0.25 0 0)',
    ring: 'oklch(0.95 0 0)',
  },
};

// Apple 风格
export const appleTheme: ThemeConfig = {
  name: 'apple',
  label: 'Apple',
  description: 'Apple 设计风格',
  radius: '0.75rem',
  fontSans: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
  fontMono: '"SF Mono", monospace',
  light: {
    background: 'oklch(0.99 0 0)',
    foreground: 'oklch(0.15 0 0)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.15 0 0)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.15 0 0)',
    primary: 'oklch(0.55 0.25 250)',
    primaryForeground: 'oklch(1 0 0)',
    secondary: 'oklch(0.96 0.005 250)',
    secondaryForeground: 'oklch(0.25 0 0)',
    muted: 'oklch(0.96 0.005 250)',
    mutedForeground: 'oklch(0.50 0.01 250)',
    accent: 'oklch(0.96 0.005 250)',
    accentForeground: 'oklch(0.25 0 0)',
    destructive: 'oklch(0.55 0.25 25)',
    border: 'oklch(0.92 0.005 250)',
    input: 'oklch(0.92 0.005 250)',
    ring: 'oklch(0.55 0.25 250)',
  },
  dark: {
    background: 'oklch(0.10 0 0)',
    foreground: 'oklch(0.98 0 0)',
    card: 'oklch(0.15 0.005 250)',
    cardForeground: 'oklch(0.98 0 0)',
    popover: 'oklch(0.15 0.005 250)',
    popoverForeground: 'oklch(0.98 0 0)',
    primary: 'oklch(0.65 0.25 250)',
    primaryForeground: 'oklch(1 0 0)',
    secondary: 'oklch(0.22 0.01 250)',
    secondaryForeground: 'oklch(0.98 0 0)',
    muted: 'oklch(0.22 0.01 250)',
    mutedForeground: 'oklch(0.60 0.01 250)',
    accent: 'oklch(0.22 0.01 250)',
    accentForeground: 'oklch(0.98 0 0)',
    destructive: 'oklch(0.60 0.25 25)',
    border: 'oklch(0.28 0.01 250)',
    input: 'oklch(0.28 0.01 250)',
    ring: 'oklch(0.65 0.25 250)',
  },
};

// GitHub 风格
export const githubTheme: ThemeConfig = {
  name: 'github',
  label: 'GitHub',
  description: 'GitHub 设计风格',
  radius: '0.375rem',
  fontSans: '"-apple-system", BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
  fontMono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  light: {
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.14 0.02 250)',
    card: 'oklch(0.99 0.002 250)',
    cardForeground: 'oklch(0.14 0.02 250)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.14 0.02 250)',
    primary: 'oklch(0.55 0.18 145)',
    primaryForeground: 'oklch(1 0 0)',
    secondary: 'oklch(0.96 0.005 250)',
    secondaryForeground: 'oklch(0.25 0.02 250)',
    muted: 'oklch(0.96 0.005 250)',
    mutedForeground: 'oklch(0.45 0.02 250)',
    accent: 'oklch(0.96 0.005 250)',
    accentForeground: 'oklch(0.25 0.02 250)',
    destructive: 'oklch(0.55 0.22 25)',
    border: 'oklch(0.90 0.01 250)',
    input: 'oklch(0.90 0.01 250)',
    ring: 'oklch(0.55 0.18 145)',
  },
  dark: {
    background: 'oklch(0.13 0.02 250)',
    foreground: 'oklch(0.90 0.01 250)',
    card: 'oklch(0.16 0.02 250)',
    cardForeground: 'oklch(0.90 0.01 250)',
    popover: 'oklch(0.16 0.02 250)',
    popoverForeground: 'oklch(0.90 0.01 250)',
    primary: 'oklch(0.65 0.18 145)',
    primaryForeground: 'oklch(1 0 0)',
    secondary: 'oklch(0.20 0.02 250)',
    secondaryForeground: 'oklch(0.90 0.01 250)',
    muted: 'oklch(0.20 0.02 250)',
    mutedForeground: 'oklch(0.55 0.02 250)',
    accent: 'oklch(0.20 0.02 250)',
    accentForeground: 'oklch(0.90 0.01 250)',
    destructive: 'oklch(0.60 0.22 25)',
    border: 'oklch(0.28 0.02 250)',
    input: 'oklch(0.28 0.02 250)',
    ring: 'oklch(0.65 0.18 145)',
  },
};

// Vercel/Next.js 风格
export const vercelTheme: ThemeConfig = {
  name: 'vercel',
  label: 'Vercel',
  description: 'Vercel/Next.js 设计风格',
  radius: '0.5rem',
  fontSans: '"Geist", -apple-system, BlinkMacSystemFont, sans-serif',
  fontMono: '"Geist Mono", monospace',
  light: {
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0 0 0)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0 0 0)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0 0 0)',
    primary: 'oklch(0 0 0)',
    primaryForeground: 'oklch(1 0 0)',
    secondary: 'oklch(0.97 0 0)',
    secondaryForeground: 'oklch(0.15 0 0)',
    muted: 'oklch(0.97 0 0)',
    mutedForeground: 'oklch(0.45 0 0)',
    accent: 'oklch(0.97 0 0)',
    accentForeground: 'oklch(0.15 0 0)',
    destructive: 'oklch(0.55 0.25 25)',
    border: 'oklch(0.92 0 0)',
    input: 'oklch(0.92 0 0)',
    ring: 'oklch(0 0 0)',
  },
  dark: {
    background: 'oklch(0 0 0)',
    foreground: 'oklch(1 0 0)',
    card: 'oklch(0.08 0 0)',
    cardForeground: 'oklch(1 0 0)',
    popover: 'oklch(0.08 0 0)',
    popoverForeground: 'oklch(1 0 0)',
    primary: 'oklch(1 0 0)',
    primaryForeground: 'oklch(0 0 0)',
    secondary: 'oklch(0.15 0 0)',
    secondaryForeground: 'oklch(0.95 0 0)',
    muted: 'oklch(0.15 0 0)',
    mutedForeground: 'oklch(0.55 0 0)',
    accent: 'oklch(0.15 0 0)',
    accentForeground: 'oklch(0.95 0 0)',
    destructive: 'oklch(0.60 0.25 25)',
    border: 'oklch(0.20 0 0)',
    input: 'oklch(0.20 0 0)',
    ring: 'oklch(1 0 0)',
  },
};

// Stripe 风格
export const stripeTheme: ThemeConfig = {
  name: 'stripe',
  label: 'Stripe',
  description: 'Stripe 设计风格',
  radius: '0.5rem',
  fontSans: '"-apple-system", BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontMono: '"Source Code Pro", monospace',
  light: {
    background: 'oklch(0.99 0.005 270)',
    foreground: 'oklch(0.25 0.03 270)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.25 0.03 270)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.25 0.03 270)',
    primary: 'oklch(0.55 0.25 270)',
    primaryForeground: 'oklch(1 0 0)',
    secondary: 'oklch(0.96 0.01 270)',
    secondaryForeground: 'oklch(0.30 0.03 270)',
    muted: 'oklch(0.96 0.01 270)',
    mutedForeground: 'oklch(0.50 0.02 270)',
    accent: 'oklch(0.60 0.20 195)',
    accentForeground: 'oklch(1 0 0)',
    destructive: 'oklch(0.55 0.25 25)',
    border: 'oklch(0.92 0.01 270)',
    input: 'oklch(0.92 0.01 270)',
    ring: 'oklch(0.55 0.25 270)',
  },
  dark: {
    background: 'oklch(0.12 0.02 270)',
    foreground: 'oklch(0.95 0.01 270)',
    card: 'oklch(0.16 0.02 270)',
    cardForeground: 'oklch(0.95 0.01 270)',
    popover: 'oklch(0.16 0.02 270)',
    popoverForeground: 'oklch(0.95 0.01 270)',
    primary: 'oklch(0.65 0.20 270)',
    primaryForeground: 'oklch(1 0 0)',
    secondary: 'oklch(0.22 0.02 270)',
    secondaryForeground: 'oklch(0.95 0.01 270)',
    muted: 'oklch(0.22 0.02 270)',
    mutedForeground: 'oklch(0.60 0.02 270)',
    accent: 'oklch(0.65 0.18 195)',
    accentForeground: 'oklch(1 0 0)',
    destructive: 'oklch(0.60 0.25 25)',
    border: 'oklch(0.28 0.02 270)',
    input: 'oklch(0.28 0.02 270)',
    ring: 'oklch(0.65 0.20 270)',
  },
};

// 所有可用主题
export const themes: ThemeConfig[] = [
  defaultTheme,
  cyberTheme,
  minimalTheme,
  appleTheme,
  githubTheme,
  vercelTheme,
  stripeTheme,
];

// 获取主题
export function getTheme(name: string): ThemeConfig {
  return themes.find(t => t.name === name) || defaultTheme;
}

// 生成 CSS 变量
export function generateThemeCSS(theme: ThemeConfig): string {
  const generateVars = (colors: ThemeColors) => `
    --background: ${colors.background};
    --foreground: ${colors.foreground};
    --card: ${colors.card};
    --card-foreground: ${colors.cardForeground};
    --popover: ${colors.popover};
    --popover-foreground: ${colors.popoverForeground};
    --primary: ${colors.primary};
    --primary-foreground: ${colors.primaryForeground};
    --secondary: ${colors.secondary};
    --secondary-foreground: ${colors.secondaryForeground};
    --muted: ${colors.muted};
    --muted-foreground: ${colors.mutedForeground};
    --accent: ${colors.accent};
    --accent-foreground: ${colors.accentForeground};
    --destructive: ${colors.destructive};
    --border: ${colors.border};
    --input: ${colors.input};
    --ring: ${colors.ring};
    --radius: ${theme.radius || '0.5rem'};
  `;

  return `
    :root {
      ${generateVars(theme.light)}
    }
    
    .dark {
      ${generateVars(theme.dark)}
    }
  `;
}
