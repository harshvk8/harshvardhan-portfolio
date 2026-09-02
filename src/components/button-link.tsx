import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";

const styles = {
  primary: "bg-accent text-accent-foreground hover:brightness-110 border border-transparent",
  secondary: "border border-border text-foreground hover:bg-surface hover:border-border/80",
  ghost: "text-muted hover:text-foreground",
} as const;

type Variant = keyof typeof styles;

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors";

/** Internal link styled as a button. */
export function ButtonLink({
  href,
  variant = "primary",
  className,
  ...props
}: { href: Route; variant?: Variant } & Omit<React.ComponentProps<typeof Link>, "href">) {
  return <Link href={href} className={cn(base, styles[variant], className)} {...props} />;
}

/** External link styled as a button. Always opens in a new tab. */
export function ButtonAnchor({
  variant = "primary",
  className,
  ...props
}: { variant?: Variant } & React.ComponentProps<"a">) {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      className={cn(base, styles[variant], className)}
      {...props}
    />
  );
}
