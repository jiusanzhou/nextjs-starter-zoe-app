"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, FolderKanban, User, MoreHorizontal } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface HeaderProps {
  title: string;
  logo?: string;
  version?: string;
  navs?: NavItem[];
  moreLabel?: string;
}

const iconMap: Record<string, React.ElementType> = {
  home: Home,
  blog: FileText,
  projects: FolderKanban,
  about: User,
};

function getIconForNav(href: string): React.ElementType {
  const path = href.replace(/^\//, "").split("/")[0].toLowerCase();
  if (path === "" || path === "home") return Home;
  return iconMap[path] || FileText;
}

export function Header({ title, logo, version, navs = [], moreLabel = "More" }: HeaderProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Header */}
      <header className="site-header sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-shadow">
        <div className="container flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            {logo && (
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-lg ring-1 ring-border/50 transition-shadow group-hover:ring-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.startsWith("http") ? logo : `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${logo}`}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight">{title}</span>
              {version && (
                <span className="hidden sm:inline text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                  {version}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Nav */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-1">
              {navs.map((item) => (
                <NavigationMenuItem key={item.href}>
                  {item.items && item.items.length > 0 ? (
                    <>
                      <NavigationMenuTrigger
                        className={cn(
                          pathname === item.href && "bg-accent text-accent-foreground"
                        )}
                      >
                        {item.href ? (
                          <Link href={item.href}>{item.title}</Link>
                        ) : (
                          item.title
                        )}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.items.map((subItem) => (
                            <li key={subItem.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={subItem.href}
                                  className={cn(
                                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                    pathname === subItem.href && "bg-accent/50"
                                  )}
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {subItem.title}
                                  </div>
                                  {subItem.description && (
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {subItem.description}
                                    </p>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "relative",
                          pathname === item.href && "bg-accent text-accent-foreground"
                        )}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Section */}
          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav navs={navs} pathname={pathname} moreLabel={moreLabel} />
    </>
  );
}

function MobileBottomNav({
  navs,
  pathname,
  moreLabel,
}: {
  navs: NavItem[];
  pathname: string;
  moreLabel: string;
}) {
  const maxVisible = 4;
  const visibleNavs = navs.slice(0, maxVisible);
  const hasMore = navs.length > maxVisible;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {visibleNavs.map((item) => {
          const Icon = getIconForNav(item.href);
          const isActive = pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full px-2 transition-colors relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-105")} />
              <span className="text-[10px] font-medium truncate max-w-[4rem]">
                {item.title}
              </span>
              {isActive && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}

        {hasMore && (
          <MoreMenu navs={navs.slice(maxVisible)} pathname={pathname} moreLabel={moreLabel} />
        )}
      </div>
    </nav>
  );
}

function MoreMenu({
  navs,
  pathname,
  moreLabel,
}: {
  navs: NavItem[];
  pathname: string;
  moreLabel: string;
}) {
  const isActive = navs.some(
    (item) => pathname === item.href || pathname.startsWith(item.href)
  );

  return (
    <div className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full px-2 group">
      <button
        className={cn(
          "flex flex-col items-center justify-center gap-1 transition-colors relative",
          isActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <MoreHorizontal className="h-5 w-5" />
        <span className="text-[10px] font-medium">{moreLabel}</span>
        {isActive && (
          <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />
        )}
      </button>

      {/* Popup menu */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block group-focus-within:block">
        <div className="bg-popover border rounded-xl shadow-lg p-1.5 min-w-[140px]">
          {navs.map((item) => {
            const Icon = getIconForNav(item.href);
            const isItemActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isItemActive
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
