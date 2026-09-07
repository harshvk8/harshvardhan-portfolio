import { cn } from "@/lib/utils";

/** Small pill, used for tech stack and metadata. */
export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "border-border text-muted inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs",
        className,
      )}
      {...props}
    />
  );
}
