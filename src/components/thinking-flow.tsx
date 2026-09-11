import { cn } from "@/lib/utils";

export const THINKING_STEPS = [
  "Observe",
  "Question",
  "Design",
  "Build",
  "Test",
  "Improve",
] as const;

/** The recurring "How I think" chain — Improve loops back to Observe. */
export function ThinkingFlow({ className }: { className?: string }) {
  return (
    <ol className={cn("flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-sm", className)}>
      {THINKING_STEPS.map((step) => (
        <li key={step} className="flex items-center gap-2">
          <span className="border-border rounded-md border px-2 py-1">{step}</span>
          <span aria-hidden="true" className="text-muted">
            &rarr;
          </span>
        </li>
      ))}
      <li className="flex items-center gap-1">
        <span aria-hidden="true" className="text-muted">
          &#8635;
        </span>
        <span className="sr-only">then loops back to Observe</span>
      </li>
    </ol>
  );
}
