"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { AdditiveBlending } from "three";
import type { Mesh } from "three";
import { siteConfig } from "@/lib/site";

export function Sun({ reducedMotion }: { reducedMotion: boolean }) {
  const core = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!reducedMotion && core.current) core.current.rotation.y += delta * 0.06;
  });

  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.7, 6]} />
        <meshStandardMaterial
          color="#b3a4ff"
          emissive="#7c6cff"
          emissiveIntensity={2.6}
          roughness={0.35}
          metalness={0}
        />
      </mesh>

      {/* faint additive corona — reads as glow, never as a solid disc */}
      <mesh scale={1.35}>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial
          color="#8b7cff"
          transparent
          opacity={0.06}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight position={[0, 0, 0]} intensity={140} distance={70} decay={2} color="#c3b6ff" />

      <Html center distanceFactor={13} position={[0, -3.3, 0]} zIndexRange={[10, 0]}>
        <div className="bg-background/60 pointer-events-none w-60 rounded-md px-2 py-1 text-center backdrop-blur-sm select-none">
          <div className="text-accent font-mono text-[10px] tracking-[0.2em] uppercase">
            {siteConfig.role}
          </div>
          <div className="text-foreground mt-0.5 text-sm font-semibold">{siteConfig.name}</div>
        </div>
      </Html>
    </group>
  );
}
