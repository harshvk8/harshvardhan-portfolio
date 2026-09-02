import { cn } from "@/lib/utils";

export const THINKING_STEPS = [
  "Observe",
  "Question",
  "Design",
  "Build",
  "Test",
  "Improve",
] as const;

/** The recurring "How I think" chain. */
export function ThinkingFlow({ className }: { className?: string }) {
  return (
    <ol className={cn("flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-sm", className)}>
      {THINKING_STEPS.map((step, i) => (
        <li key={step} className="flex items-center gap-2">
          <span className="border-border rounded-md border px-2 py-1">{step}</span>
          {i < THINKING_STEPS.length - 1 ? (
            <span aria-hidden="true" className="text-muted">
              &rarr;
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
