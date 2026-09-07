"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight"
          aria-label={`${siteConfig.name} — home`}
        >
          {siteConfig.shortName}
          <span className="text-accent">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {siteConfig.nav
            .filter((item) => item.href !== "/")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "text-muted hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive(pathname, item.href) && "text-foreground",
                )}
              >
                {item.title}
              </Link>
            ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="text-muted hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <nav aria-label="Primary" className="border-border/60 bg-background border-t md:hidden">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "text-muted hover:bg-surface hover:text-foreground block px-4 py-3 text-sm",
                isActive(pathname, item.href) && "text-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
