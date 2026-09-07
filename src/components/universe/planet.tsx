"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { PlanetConfig } from "@/lib/universe";

export function Planet({
  config,
  reducedMotion,
  dimmed,
  onEnter,
}: {
  config: PlanetConfig;
  reducedMotion: boolean;
  /** another planet is being entered — fade this one back */
  dimmed: boolean;
  onEnter: (slug: string, worldPos: THREE.Vector3) => void;
}) {
  const { project, radius, speed, size, color, angle } = config;
  const pivot = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const theta = useRef(angle);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!reducedMotion) {
      theta.current += delta * speed * (hovered ? 0.2 : 1);
    }
    if (pivot.current) {
      pivot.current.position.x = Math.cos(theta.current) * radius;
      pivot.current.position.z = Math.sin(theta.current) * radius;
    }
    if (body.current && !reducedMotion) body.current.rotation.y += delta * 0.4;
  });

  const setCursor = (v: string) => {
    document.body.style.cursor = v;
  };

  return (
    <group ref={pivot} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
      <mesh
        ref={body}
        scale={(hovered ? size * 1.28 : size) * (dimmed ? 0.85 : 1)}
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
          if (pivot.current)
            onEnter(project.slug, pivot.current.getWorldPosition(new THREE.Vector3()));
        }}
      >
        <sphereGeometry args={[1, 40, 40]} />
        <meshStandardMaterial
          color={color}
          roughness={0.55}
          metalness={0.15}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.14}
          transparent
          opacity={dimmed ? 0.25 : 1}
        />
      </mesh>

      {hovered && !dimmed ? (
        <Html center distanceFactor={9} position={[0, size * 1.6 + 0.7, 0]} zIndexRange={[60, 0]}>
          <div className="border-border bg-surface/95 w-56 rounded-lg border p-3 text-left shadow-xl backdrop-blur">
            <p className="text-sm font-medium">{project.name}</p>
            <p className="text-muted mt-1 line-clamp-3 text-xs">{project.tagline}</p>
            <p className="text-muted mt-2 font-mono text-[10px]">
              {project.stack.slice(0, 3).join(" · ")}
            </p>
            <p className="text-accent mt-2 text-xs">Explore project →</p>
          </div>
        </Html>
      ) : null}
    </group>
  );
}
