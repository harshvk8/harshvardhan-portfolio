import { cn } from "@/lib/utils";

/** Consistent page wrapper: constrained width, title, optional intro. */
export function PageShell({
  title,
  intro,
  children,
  className,
}: {
  title: string;
  intro?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-4 py-16 sm:px-6", className)}>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {intro ? <p className="text-muted mt-3 max-w-2xl">{intro}</p> : null}
      {children ? <div className="mt-10">{children}</div> : null}
    </div>
  );
}
