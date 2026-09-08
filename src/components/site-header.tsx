"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Sparkles, X, Zap } from "lucide-react";
import { useMode, type Mode } from "@/components/mode/mode-provider";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function ModeToggle() {
  const { mode, setMode, ready } = useMode();
  const router = useRouter();
  const pathname = usePathname();

  // reserve the space so the header doesn't jump when it mounts
  if (!ready) return <div aria-hidden className="h-8 w-[10.5rem]" />;

  // Switching mode is the gateway to the two home experiences (the 3D
  // universe vs. the plain recruiter layout), so send the visitor home
  // from any inner page — otherwise the toggle looks like it did nothing.
  function choose(next: Mode) {
    setMode(next);
    if (pathname !== "/") router.push("/");
  }

  return (
    <div
      role="group"
      aria-label="View mode"
      className="border-border flex items-center rounded-md border p-0.5 text-xs"
    >
      <button
        type="button"
        onClick={() => choose("explore")}
        aria-pressed={mode === "explore"}
        className={cn(
          "inline-flex items-center gap-1 rounded px-2 py-1 transition-colors",
          mode === "explore" ? "bg-surface text-foreground" : "text-muted hover:text-foreground",
        )}
      >
        <Sparkles className="h-3.5 w-3.5" /> Explore
      </button>
      <button
        type="button"
        onClick={() => choose("recruiter")}
        aria-pressed={mode === "recruiter"}
        className={cn(
          "inline-flex items-center gap-1 rounded px-2 py-1 transition-colors",
          mode === "recruiter" ? "bg-surface text-foreground" : "text-muted hover:text-foreground",
        )}
      >
        <Zap className="h-3.5 w-3.5" /> Recruiter
      </button>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight"
          aria-label={`${siteConfig.name} — home`}
        >
          {siteConfig.shortName}
          <span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {siteConfig.nav
              .filter((item) => item.href !== "/")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className={cn(
                    "text-muted hover:text-foreground rounded-md px-2.5 py-1.5 text-sm transition-colors",
                    isActive(pathname, item.href) && "text-foreground",
                  )}
                >
                  {item.title}
                </Link>
              ))}
          </nav>

          <ModeToggle />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="text-muted hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav aria-label="Primary" className="border-border/60 bg-background border-t lg:hidden">
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
