import type { CaseStudy } from "@/content";
import { Reveal } from "@/components/reveal";

/** One labelled block in the case study flow. */
function Block({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="scroll-mt-24">
      <section className="border-border border-t py-8">
        <div className="flex items-baseline gap-3">
          <span className="text-accent font-mono text-xs">{step}</span>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        </div>
        <div className="text-foreground/90 mt-3 text-sm leading-relaxed">{children}</div>
      </section>
    </Reveal>
  );
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((p, i) => (
        <p key={i} className={i > 0 ? "mt-3" : undefined}>
          {p}
        </p>
      ))}
    </>
  );
}

export function CaseStudyBody({ cs }: { cs: CaseStudy }) {
  let n = 0;
  const step = () => `0${++n}`.slice(-2);

  return (
    <div>
      <Block step={step()} title="The problem">
        <Paragraphs text={cs.problem} />
      </Block>

      <Block step={step()} title="Observation">
        <Paragraphs text={cs.observation} />
      </Block>

      <Block step={step()} title="The question">
        <Paragraphs text={cs.question} />
      </Block>

      <Block step={step()} title="User need">
        <Paragraphs text={cs.userNeed} />
      </Block>

      <Block step={step()} title="Constraints">
        <ul className="grid gap-2 sm:grid-cols-2">
          {cs.constraints.map((c) => (
            <li key={c} className="border-border bg-surface rounded-lg border px-3 py-2">
              {c}
            </li>
          ))}
        </ul>
      </Block>

      <Block step={step()} title="Options I considered">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="text-muted">
                <th className="border-border border-b pr-4 pb-2 font-medium">Option</th>
                <th className="border-border border-b pb-2 font-medium">Trade-off</th>
              </tr>
            </thead>
            <tbody>
              {cs.options.map((o) => (
                <tr key={o.option} className="align-top">
                  <td className="border-border/60 border-b py-3 pr-4 font-medium">{o.option}</td>
                  <td className="border-border/60 text-muted border-b py-3">{o.tradeoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>

      <Block step={step()} title="Technical decision">
        <Paragraphs text={cs.decision} />
      </Block>

      <Block step={step()} title="Architecture">
        <pre className="border-border bg-surface text-foreground/90 overflow-x-auto rounded-lg border p-4 font-mono text-xs leading-relaxed">
          {cs.architecture}
        </pre>
      </Block>

      {cs.challenges.length > 0 ? (
        <Block step={step()} title="Things that didn't work immediately">
          <div className="space-y-4">
            {cs.challenges.map((ch) => (
              <div key={ch.challenge} className="border-border bg-surface rounded-lg border p-4">
                <p className="font-medium">{ch.challenge}</p>
                <dl className="mt-3 space-y-2 text-sm">
                  {(
                    [
                      ["Initial approach", ch.initialApproach],
                      ["Problem with it", ch.problem],
                      ["Decision", ch.decision],
                      ["Final solution", ch.finalSolution],
                      ["Result", ch.result],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="grid gap-1 sm:grid-cols-[9rem_1fr]">
                      <dt className="text-muted font-mono text-xs">{label}</dt>
                      <dd className="text-foreground/90">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Block>
      ) : null}

      {cs.codeDecisions.length > 0 ? (
        <Block step={step()} title="Selected code decisions">
          <div className="space-y-5">
            {cs.codeDecisions.map((cd) => (
              <div key={cd.title}>
                <p className="font-medium">{cd.title}</p>
                <pre className="border-border bg-surface mt-2 overflow-x-auto rounded-lg border p-4 font-mono text-xs leading-relaxed">
                  <code>{cd.snippet}</code>
                </pre>
                <p className="text-muted mt-2">{cd.why}</p>
              </div>
            ))}
          </div>
        </Block>
      ) : null}

      {cs.beforeAfter.length > 0 ? (
        <Block step={step()} title="Before vs after">
          <div className="space-y-4">
            {cs.beforeAfter.map((ba) => (
              <div key={ba.aspect} className="border-border bg-surface rounded-lg border p-4">
                <p className="font-medium">{ba.aspect}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-muted font-mono text-xs">Before</p>
                    <p className="text-foreground/90 mt-1">{ba.before}</p>
                  </div>
                  <div>
                    <p className="text-muted font-mono text-xs">After</p>
                    <p className="text-foreground/90 mt-1">{ba.after}</p>
                  </div>
                </div>
                <p className="text-muted mt-3">
                  <span className="font-mono text-xs">Why: </span>
                  {ba.reason}
                </p>
              </div>
            ))}
          </div>
        </Block>
      ) : null}

      <Block step={step()} title="What this project taught me">
        <ul className="marker:text-accent list-disc space-y-2 pl-5">
          {cs.learned.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </Block>
    </div>
  );
}
