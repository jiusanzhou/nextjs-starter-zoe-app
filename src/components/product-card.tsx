"use client";

import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const STATUS_LABELS: Record<NonNullable<Product["status"]>, string> = {
  idea: "Idea",
  building: "Building",
  live: "Live",
  paused: "Paused",
  sunset: "Sunset",
};

const STATUS_STYLES: Record<NonNullable<Product["status"]>, string> = {
  idea: "bg-muted text-muted-foreground",
  building: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  live: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  paused: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  sunset: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

function StatusBadge({ status }: { status: NonNullable<Product["status"]> }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full",
        STATUS_STYLES[status],
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const href = product.url || (product.slug ? `/products/${product.slug}` : "#");
  const isExternal = product.url?.startsWith("http");

  const Wrapper = ({ children, className }: { children: React.ReactNode; className?: string }) =>
    href === "#" ? (
      <div className={className}>{children}</div>
    ) : (
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={className}
      >
        {children}
      </Link>
    );

  return (
    <Wrapper className="product-card group flex flex-col h-full overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-xl">
      {/* Cover — fixed 1200x630 ratio (matches OG images). Falls back to a soft gradient when no image. */}
      <div className="relative w-full aspect-[1200/630] overflow-hidden bg-muted">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={`${product.name} cover`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/10 via-muted to-primary/5 flex items-center justify-center">
            <span className="text-3xl font-bold tracking-tight text-muted-foreground/50">
              {product.name}
            </span>
          </div>
        )}
      </div>

      {/* Body — same height treatment, footer pinned via mt-auto */}
      <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {product.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.logo}
                alt={`${product.name} logo`}
                className="h-7 w-7 rounded-md object-cover flex-shrink-0"
              />
            )}
            <h3 className="text-lg font-semibold tracking-tight truncate group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>
          {href !== "#" && (
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground flex-shrink-0 mt-1 transition-colors" />
          )}
        </div>

        {product.tagline && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {product.tagline}
          </p>
        )}

        {/* Meta row pinned to bottom */}
        <div className="flex flex-wrap items-center gap-2 pt-1 mt-auto">
          {product.status && <StatusBadge status={product.status} />}
          {product.category && (
            <span className="text-[11px] px-2 py-0.5 rounded-full border text-muted-foreground">
              {product.category}
            </span>
          )}
          {product.launchedAt && (
            <span className="text-[11px] text-muted-foreground">{product.launchedAt}</span>
          )}
          {product.repo && (
            <Link
              href={product.repo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`${product.name} source on GitHub`}
            >
              <Github className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

interface ProductsListProps {
  products: Product[];
  /** When true, sort `featured` products to the front (size stays the same). */
  showFeatured?: boolean;
  /** Limit total displayed (after sorting). 0/undefined = no limit */
  limit?: number;
}

export function ProductsList({ products, showFeatured = true, limit }: ProductsListProps) {
  if (!products || products.length === 0) return null;

  // Stable sort: featured first (preserve original order within each group)
  const ordered = showFeatured
    ? [...products].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
    : products;

  const display = limit && limit > 0 ? ordered.slice(0, limit) : ordered;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
      {display.map((p, i) => (
        <ProductCard key={p.slug || p.name + i} product={p} />
      ))}
    </div>
  );
}
