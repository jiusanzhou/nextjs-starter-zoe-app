/**
 * Theme decoration components
 * Controlled via CSS classes — shown/hidden based on active theme
 */

/** Linear: Hero radial gradient glow */
export function HeroGlow() {
  return (
    <div
      className="theme-decoration theme-decoration-linear absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    >
      <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] max-md:w-[500px] max-md:h-[500px] max-md:top-[-30%] bg-[radial-gradient(circle,oklch(0.55_0.25_280/0.18),transparent_70%)] opacity-0 dark:opacity-100" />
      <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] max-md:w-[500px] max-md:h-[500px] max-md:top-[-30%] bg-[radial-gradient(circle,oklch(0.55_0.20_280/0.08),transparent_70%)] dark:opacity-0" />
    </div>
  );
}

/** Linear: Grid background pattern (dark mode only) */
export function GridPattern() {
  return (
    <div
      className="theme-decoration theme-decoration-linear absolute inset-0 pointer-events-none z-0 hidden dark:block"
      aria-hidden="true"
      style={{
        backgroundImage: `
          linear-gradient(oklch(0.30 0.04 275 / 0.3) 1px, transparent 1px),
          linear-gradient(90deg, oklch(0.30 0.04 275 / 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)',
      }}
    />
  );
}

/** Stripe: Gradient blob — top-right */
export function GradientBlob() {
  return (
    <div
      className="theme-decoration theme-decoration-stripe absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Top-right blob */}
      <div className="absolute top-[-20%] right-[-15%] w-[600px] h-[600px] max-md:w-[400px] max-md:h-[400px] max-md:right-[-20%] max-md:top-[-15%] bg-[radial-gradient(ellipse_at_center,oklch(0.65_0.20_270/0.10),oklch(0.60_0.18_230/0.05)_50%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,oklch(0.50_0.18_270/0.15),oklch(0.45_0.15_230/0.08)_50%,transparent_70%)]" />
      {/* Bottom-left blob */}
      <div className="absolute bottom-[-30%] left-[-10%] w-[500px] h-[500px] max-md:w-[300px] max-md:h-[300px] bg-[radial-gradient(circle,oklch(0.55_0.18_300/0.06),transparent_70%)] dark:bg-[radial-gradient(circle,oklch(0.45_0.15_300/0.10),transparent_70%)]" />
    </div>
  );
}
