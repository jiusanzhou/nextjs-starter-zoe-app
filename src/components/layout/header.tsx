"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeStyleToggle } from "@/components/theme-style-toggle";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface HeaderProps {
  title: string;
  logo?: string;
  version?: string;
  navs?: NavItem[];
}

export function Header({ title, logo, version, navs = [] }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
          {logo && (
            <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-lg">
              {logo.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt={title} className="h-full w-full object-cover" />
              ) : (
                <Image src={logo} alt={title} fill className="object-cover" />
              )}
            </div>
          )}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-base sm:text-lg">{title}</span>
            {version && (
              <span className="hidden sm:inline text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {version}
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navs.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-1">
          {/* Theme Style Toggle - hidden on mobile */}
          <div className="hidden sm:block">
            <ThemeStyleToggle />
          </div>
          
          {/* Dark/Light Toggle */}
          <ThemeToggle />
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">菜单</span>
          </Button>
        </div>
      </div>

      {/* Mobile Nav - Full Screen Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-14 z-50 bg-background md:hidden animate-in slide-in-from-top-2">
          <nav className="container py-6">
            <div className="flex flex-col space-y-1">
              {navs.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 text-lg font-medium rounded-lg transition-colors",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
            
            {/* Mobile Theme Style Toggle */}
            <div className="mt-6 pt-6 border-t">
              <div className="px-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">主题风格</span>
                <ThemeStyleToggle />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
