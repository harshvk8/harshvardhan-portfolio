"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
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
  onEnter,
}: {
  planets: PlanetConfig[];
  reducedMotion: boolean;
  enteringSlug: string | null;
  onEnter: (slug: string) => void;
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

        <Sun reducedMotion={reducedMotion} />

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
        autoRotate={!reducedMotion && !enteringSlug}
        autoRotateSpeed={0.12}
      />
    </Canvas>
  );
}
