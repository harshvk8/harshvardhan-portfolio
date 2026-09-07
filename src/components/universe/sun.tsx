"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { AdditiveBlending } from "three";
import type { Mesh } from "three";
import { siteConfig } from "@/lib/site";

export function Sun({
  reducedMotion,
  onOpenAbout,
}: {
  reducedMotion: boolean;
  onOpenAbout: () => void;
}) {
  const core = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!reducedMotion && core.current) core.current.rotation.y += delta * 0.06;
  });

  const setCursor = (v: string) => {
    document.body.style.cursor = v;
  };

  return (
    <group>
      <mesh
        ref={core}
        scale={hovered ? 1.06 : 1}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          setCursor("pointer");
        }}
        onPointerOut={() => {
          setHovered(false);
          setCursor("auto");
        }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenAbout();
        }}
      >
        <icosahedronGeometry args={[1.7, 6]} />
        <meshStandardMaterial
          color="#b3a4ff"
          emissive="#7c6cff"
          emissiveIntensity={hovered ? 3.1 : 2.6}
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
        <button
          type="button"
          onClick={onOpenAbout}
          onPointerEnter={() => setCursor("pointer")}
          onPointerLeave={() => setCursor("auto")}
          className="bg-background/60 w-60 cursor-pointer rounded-md px-2 py-1 text-center backdrop-blur-sm select-none"
        >
          <span className="text-accent block font-mono text-[10px] tracking-[0.2em] uppercase">
            {siteConfig.role}
          </span>
          <span className="text-foreground mt-0.5 block text-sm font-semibold">
            {siteConfig.name}
          </span>
          <span className="text-muted mt-0.5 block font-mono text-[10px]">About →</span>
        </button>
      </Html>
    </group>
  );
}
