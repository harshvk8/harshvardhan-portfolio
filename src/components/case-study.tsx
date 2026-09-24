import type { CaseStudy } from "@/content";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-border border-t py-6">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="text-foreground/90 mt-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="marker:text-accent list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Short, server-rendered case study with native, keyboard-accessible details. */
export function CaseStudyBody({ cs }: { cs: CaseStudy }) {
  return (
    <div>
      <Section title="Overview">
        <p>{cs.overview}</p>
      </Section>

      <Section title="What I worked on">
        <Points items={cs.contributions} />
      </Section>

      <Section title="Key decisions">
        <Points items={cs.decisions} />
      </Section>

      <Section title="What I learned">
        <Points items={cs.learned} />
      </Section>

      {cs.architecture ? (
        <details className="border-border bg-surface mt-2 rounded-lg border">
          <summary className="marker:text-accent focus-visible:outline-accent cursor-pointer rounded-lg px-4 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2">
            Architecture details
          </summary>
          <pre className="text-foreground/90 overflow-x-auto px-4 pb-4 font-mono text-xs leading-relaxed">
            {cs.architecture}
          </pre>
        </details>
      ) : null}

      {cs.codeDecisions.length > 0 ? (
        <details className="border-border bg-surface mt-3 rounded-lg border">
          <summary className="marker:text-accent focus-visible:outline-accent cursor-pointer rounded-lg px-4 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2">
            Code examples
          </summary>
          <div className="space-y-5 px-4 pb-4">
            {cs.codeDecisions.map((example) => (
              <div key={example.title}>
                <h3 className="text-sm font-medium">{example.title}</h3>
                <p className="text-muted mt-1 text-xs">Simplified {example.language} example</p>
                <pre className="border-border bg-background mt-3 overflow-x-auto rounded-md border p-3 font-mono text-xs leading-relaxed">
                  <code>{example.snippet}</code>
                </pre>
                <p className="text-muted mt-2 text-sm">{example.why}</p>
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}
