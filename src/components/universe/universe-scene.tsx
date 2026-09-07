"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import type { PlanetConfig } from "@/lib/universe";
import { Sun } from "./sun";
import { Planet } from "./planet";
import { AsteroidBelt, CameraRig, OrbitRing } from "./scene-extras";

export default function UniverseScene({
  planets,
  reducedMotion,
  enteringSlug,
  entering,
  onEnter,
  onOpenAbout,
}: {
  planets: PlanetConfig[];
  reducedMotion: boolean;
  /** slug of the project being entered (null for About / none) */
  enteringSlug: string | null;
  /** any transition in progress */
  entering: boolean;
  onEnter: (slug: string) => void;
  onOpenAbout: () => void;
}) {
  const [target, setTarget] = useState<THREE.Vector3 | null>(null);
  const beltInner = planets.length ? planets[planets.length - 1].radius + 2.4 : 14;

  return (
    <Canvas
      camera={{ position: [0, 7, 18], fov: 48 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#05070d"]} />
      <fog attach="fog" args={["#05070d", 24, 62]} />
      <ambientLight intensity={0.18} />

      <Suspense fallback={null}>
        <Stars
          radius={140}
          depth={70}
          count={reducedMotion ? 1800 : 3800}
          factor={4}
          saturation={0}
          fade
          speed={reducedMotion ? 0 : 0.35}
        />

        <Sun reducedMotion={reducedMotion} onOpenAbout={onOpenAbout} />

        {planets.map((config) => (
          <OrbitRing key={`ring-${config.project.slug}`} radius={config.radius} />
        ))}

        {planets.map((config) => (
          <Planet
            key={config.project.slug}
            config={config}
            reducedMotion={reducedMotion}
            dimmed={enteringSlug != null && enteringSlug !== config.project.slug}
            onEnter={(slug, pos) => {
              setTarget(pos);
              onEnter(slug);
            }}
          />
        ))}

        <AsteroidBelt
          count={reducedMotion ? 45 : 95}
          inner={beltInner}
          outer={beltInner + 2.2}
          reducedMotion={reducedMotion}
        />

        {/* the belt is background only — certifications / extra learning
            orbit outside the main project universe, not clickable (yet) */}
        <Html center position={[0, 0.6, beltInner + 3]} distanceFactor={18} zIndexRange={[4, 0]}>
          <p className="text-muted/60 pointer-events-none font-mono text-[9px] tracking-[0.25em] uppercase select-none">
            Additional learning
          </p>
        </Html>
      </Suspense>

      <EffectComposer>
        <Bloom intensity={0.7} luminanceThreshold={0.35} luminanceSmoothing={0.85} mipmapBlur />
      </EffectComposer>

      <CameraRig target={enteringSlug ? target : null} />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        minDistance={9}
        maxDistance={30}
        minPolarAngle={Math.PI * 0.12}
        maxPolarAngle={Math.PI * 0.58}
        autoRotate={!reducedMotion && !entering}
        autoRotateSpeed={0.12}
      />
    </Canvas>
  );
}
