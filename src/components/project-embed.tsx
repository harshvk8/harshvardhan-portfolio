"use client";

import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";

/**
 * Click-to-load embed of a project's live app. Nothing is requested from the
 * third-party origin until the visitor asks — keeps the case study fast and
 * avoids framing an external site by default.
 */
export function ProjectEmbed({ src, title, blurb }: { src: string; title: string; blurb: string }) {
  const [live, setLive] = useState(false);
  const host = (() => {
    try {
      return new URL(src).host;
    } catch {
      return src;
    }
  })();

  return (
    <section className="border-border bg-surface mt-10 overflow-hidden rounded-lg border">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="text-sm font-medium">Try it live</h2>
          <p className="text-muted mt-1 text-sm">{blurb}</p>
        </div>
        <div className="flex gap-2">
          {!live ? (
            <button
              type="button"
              onClick={() => setLive(true)}
              className="bg-accent text-accent-foreground inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-[filter] hover:brightness-110"
            >
              <Play className="h-4 w-4" /> Launch app
            </button>
          ) : null}
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="border-border hover:bg-background inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
          >
            <ExternalLink className="h-4 w-4" /> Open in new tab
          </a>
        </div>
      </div>

      {live ? (
        <div className="border-border/60 border-t">
          <iframe
            src={src}
            title={title}
            loading="lazy"
            className="h-[70vh] max-h-[720px] min-h-[420px] w-full bg-white"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <p className="text-muted px-5 py-2 text-[11px]">
            Embedded from {host}. Runs entirely on the project&apos;s own deployment.
          </p>
        </div>
      ) : null}
    </section>
  );
}
