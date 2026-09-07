import type { Constellation, SkillConnection } from "@/content";

export const VIEWBOX = { w: 1000, h: 704 };

/**
 * Hand-placed cluster centres, ring radius, and a label position in open
 * space (labels are drawn on a small background pill so they stay readable
 * even when a star drifts near).
 */
const CENTERS: Record<string, { cx: number; cy: number; r: number; lx: number; ly: number }> = {
  "software-engineering": { cx: 300, cy: 300, r: 126, lx: 300, ly: 118 },
  languages: { cx: 780, cy: 198, r: 114, lx: 780, ly: 72 },
  "mobile-fullstack": { cx: 802, cy: 478, r: 116, lx: 802, ly: 620 },
  "tools-systems": { cx: 230, cy: 540, r: 104, lx: 220, ly: 672 },
  "real-world": { cx: 508, cy: 582, r: 76, lx: 520, ly: 678 },
};

const SIZE_R: Record<string, number> = { xl: 13, lg: 9, md: 6.5, sm: 4.5 };

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type StarLayout = {
  id: string;
  name: string;
  size: "xl" | "lg" | "md" | "sm";
  anchor: boolean;
  evidence: string[];
  projects: string[];
  cx: number;
  cy: number;
  r: number;
  constellationId: string;
  constellationName: string;
};

export type Line = { from: { x: number; y: number }; to: { x: number; y: number } };

export function layoutConstellations(
  constellations: Constellation[],
  connections: SkillConnection[],
) {
  const stars: StarLayout[] = [];
  const centre = new Map<string, { x: number; y: number }>();
  const posOf = new Map<string, { x: number; y: number }>();

  for (const c of constellations) {
    const cfg = CENTERS[c.id] ?? { cx: 500, cy: 370, r: 120, lx: 500, ly: 120 };
    centre.set(c.id, { x: cfg.cx, y: cfg.cy });
    const rand = mulberry32(c.id.length * 131 + 7);

    const place = (s: Constellation["skills"][number], x: number, y: number) => {
      const star: StarLayout = {
        ...s,
        cx: x,
        cy: y,
        r: SIZE_R[s.size] * c.scale,
        constellationId: c.id,
        constellationName: c.name,
      };
      stars.push(star);
      posOf.set(s.id, { x, y });
    };

    const anchors = c.skills.filter((s) => s.anchor);
    const members = c.skills.filter((s) => !s.anchor);

    if (anchors[0]) place(anchors[0], cfg.cx, cfg.cy);
    const restAnchors = anchors.slice(1);
    restAnchors.forEach((s, i) => {
      const a = (i / restAnchors.length) * Math.PI * 2 - Math.PI / 3;
      const rr = cfg.r * 0.46;
      place(s, cfg.cx + Math.cos(a) * rr, cfg.cy + Math.sin(a) * rr);
    });

    members.forEach((s, i) => {
      const a =
        (i / Math.max(members.length, 1)) * Math.PI * 2 - Math.PI / 2 + (rand() - 0.5) * 0.22;
      const rr = cfg.r * (0.84 + rand() * 0.28);
      place(s, cfg.cx + Math.cos(a) * rr, cfg.cy + Math.sin(a) * rr);
    });
  }

  const clusterLines: (Line & { constellationId: string })[] = stars
    .filter((s) => {
      const c = centre.get(s.constellationId)!;
      return !(s.cx === c.x && s.cy === c.y);
    })
    .map((s) => ({
      from: { x: s.cx, y: s.cy },
      to: centre.get(s.constellationId)!,
      constellationId: s.constellationId,
    }));

  const crossLines: (Line & { a: string; b: string })[] = connections
    .map(([a, b]) => {
      const pa = posOf.get(a);
      const pb = posOf.get(b);
      return pa && pb ? { from: pa, to: pb, a, b } : null;
    })
    .filter((l): l is Line & { a: string; b: string } => l != null);

  const centers = constellations.map((c) => {
    const cfg = CENTERS[c.id];
    return {
      id: c.id,
      name: c.name,
      primary: c.primary,
      x: cfg.cx,
      y: cfg.cy,
      lx: cfg.lx,
      ly: cfg.ly,
    };
  });

  return { stars, clusterLines, crossLines, centers };
}
