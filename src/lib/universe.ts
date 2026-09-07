import type { Project } from "@/content";

export type PlanetConfig = {
  project: Project;
  radius: number;
  /** radians per second at rest */
  speed: number;
  /** sphere radius */
  size: number;
  color: string;
  /** starting angle, radians */
  angle: number;
};

const COLORS = ["#8b7cff", "#22d3ee", "#f472b6", "#facc15", "#4ade80", "#fb923c"];

/**
 * Lay projects out as orbits: featured ones ride closer and larger, the rest
 * farther out. Angular speed falls off with radius (loosely Keplerian) so the
 * inner planets feel livelier.
 */
export function planetLayout(projects: Project[]): PlanetConfig[] {
  const ordered = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));

  return ordered.map((project, i) => {
    const radius = 5.5 + i * 2.2;
    return {
      project,
      radius,
      speed: 0.34 / Math.sqrt(radius),
      size: project.featured ? 0.62 : 0.46,
      color: COLORS[i % COLORS.length],
      angle: (i * (Math.PI * 2)) / Math.max(ordered.length, 1) + i * 0.6,
    };
  });
}
