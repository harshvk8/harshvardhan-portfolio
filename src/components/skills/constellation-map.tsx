"use client";

import { useMemo, useState } from "react";
import { VIEWBOX, layoutConstellations, type StarLayout } from "@/lib/constellations";
import { constellations, skillConnections } from "@/content";

const HUE: Record<string, string> = {
  "software-engineering": "#8b7cff",
  languages: "#22d3ee",
  "mobile-fullstack": "#4ade80",
  "tools-systems": "#facc15",
  "real-world": "#94a3b8",
};

function backgroundStars(seed: number, n: number) {
  let s = seed;
  const rnd = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: n }, () => ({
    x: rnd() * VIEWBOX.w,
    y: rnd() * VIEWBOX.h,
    r: 0.5 + rnd() * 1.1,
    o: 0.15 + rnd() * 0.4,
  }));
}

export function ConstellationMap({
  activeSkillId,
  onSelect,
  reducedMotion,
}: {
  activeSkillId: string | null;
  onSelect: (id: string) => void;
  reducedMotion: boolean;
}) {
  const { stars, clusterLines, crossLines, centers } = useMemo(
    () => layoutConstellations(constellations, skillConnections),
    [],
  );
  const bg = useMemo(() => backgroundStars(9271, 60), []);
  const [hoverC, setHoverC] = useState<string | null>(null);
  const [hoverStar, setHoverStar] = useState<string | null>(null);

  const constellationById = useMemo(
    () => new Map(stars.map((s) => [s.id, s.constellationId])),
    [stars],
  );

  const showLabel = (s: StarLayout) =>
    s.size === "xl" ||
    s.size === "lg" ||
    hoverStar === s.id ||
    activeSkillId === s.id ||
    hoverC === s.constellationId;

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      className="h-full w-full touch-none select-none"
      role="group"
      aria-label="Skills as five constellations"
    >
      {/* background field */}
      <g>
        {bg.map((b, i) => (
          <circle
            key={i}
            cx={b.x}
            cy={b.y}
            r={b.r}
            fill="var(--star)"
            opacity={b.o}
            className={reducedMotion ? undefined : "constellation-twinkle"}
            style={reducedMotion ? undefined : { animationDelay: `${(i % 7) * 0.6}s` }}
          />
        ))}
      </g>

      {/* within-constellation lines */}
      {clusterLines.map((l, i) => {
        const on = hoverC === l.constellationId;
        return (
          <line
            key={`c${i}`}
            x1={l.from.x}
            y1={l.from.y}
            x2={l.to.x}
            y2={l.to.y}
            stroke={on ? HUE[l.constellationId] : "#2a3358"}
            strokeWidth={on ? 1.4 : 0.8}
            opacity={on ? 0.85 : 0.4}
          />
        );
      })}

      {/* cross-constellation links */}
      {crossLines.map((l, i) => {
        const on =
          hoverC === constellationById.get(l.a) ||
          hoverC === constellationById.get(l.b) ||
          activeSkillId === l.a ||
          activeSkillId === l.b;
        return (
          <line
            key={`x${i}`}
            x1={l.from.x}
            y1={l.from.y}
            x2={l.to.x}
            y2={l.to.y}
            stroke="var(--accent)"
            strokeWidth={on ? 1.3 : 0.8}
            strokeDasharray="3 5"
            opacity={on ? 0.7 : 0.28}
          />
        );
      })}

      {/* constellation names — on a pill so they stay readable */}
      {centers.map((c) => {
        const w = c.name.length * (c.primary ? 8.4 : 7) + 20;
        const on = hoverC === c.id;
        return (
          <g
            key={c.id}
            className="cursor-pointer"
            onMouseEnter={() => setHoverC(c.id)}
            onMouseLeave={() => setHoverC(null)}
          >
            <rect
              x={c.lx - w / 2}
              y={c.ly - 12}
              width={w}
              height={20}
              rx={5}
              fill="var(--background)"
              opacity={0.72}
            />
            <text
              x={c.lx}
              y={c.ly + 3}
              textAnchor="middle"
              fontSize={c.primary ? 14 : 11.5}
              fontWeight={600}
              letterSpacing="2"
              fill={on ? HUE[c.id] : "var(--muted)"}
              className="uppercase"
            >
              {c.name}
            </text>
          </g>
        );
      })}

      {/* stars */}
      {stars.map((s) => {
        const hue = HUE[s.constellationId];
        const active = activeSkillId === s.id;
        const hot = hoverStar === s.id || active;
        const labelLeft = s.cx > VIEWBOX.w - 190;
        return (
          <g
            key={s.id}
            role="button"
            tabIndex={0}
            aria-label={`${s.name}, ${s.constellationName}`}
            className="cursor-pointer focus:outline-none"
            onMouseEnter={() => {
              setHoverStar(s.id);
              setHoverC(s.constellationId);
            }}
            onMouseLeave={() => {
              setHoverStar(null);
              setHoverC(null);
            }}
            onFocus={() => {
              setHoverStar(s.id);
              setHoverC(s.constellationId);
            }}
            onBlur={() => {
              setHoverStar(null);
              setHoverC(null);
            }}
            onClick={() => onSelect(s.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(s.id);
              }
            }}
          >
            {/* generous hit area */}
            <circle cx={s.cx} cy={s.cy} r={Math.max(s.r * 2.6, 15)} fill="transparent" />
            {/* glow */}
            {(s.size === "xl" || s.size === "lg" || hot) && (
              <circle cx={s.cx} cy={s.cy} r={s.r * 2.6} fill={hue} opacity={hot ? 0.28 : 0.16} />
            )}
            <circle
              cx={s.cx}
              cy={s.cy}
              r={hot ? s.r * 1.18 : s.r}
              fill={s.anchor ? hue : "var(--foreground)"}
              stroke={hue}
              strokeWidth={s.anchor ? 0 : 1}
            />
            {active && (
              <circle cx={s.cx} cy={s.cy} r={s.r + 5} fill="none" stroke={hue} strokeWidth={1.4} />
            )}
            {showLabel(s) && (
              <text
                x={labelLeft ? s.cx - s.r - 6 : s.cx + s.r + 6}
                y={s.cy + 4}
                textAnchor={labelLeft ? "end" : "start"}
                fontSize={s.size === "xl" ? 15 : s.size === "lg" ? 13 : 11.5}
                fontWeight={s.size === "xl" || s.size === "lg" ? 600 : 400}
                fill={hot ? "var(--foreground)" : "var(--muted)"}
                className="pointer-events-none"
              >
                {s.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
