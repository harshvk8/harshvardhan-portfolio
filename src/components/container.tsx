import { cn } from "@/lib/utils";

/** Page-width wrapper. `width="prose"` narrows to a comfortable reading measure. */
export function Container({
  className,
  width = "default",
  ...props
}: React.ComponentProps<"div"> & { width?: "default" | "prose" }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6",
        width === "prose" ? "max-w-3xl" : "max-w-5xl",
        className,
      )}
      {...props}
    />
  );
}
