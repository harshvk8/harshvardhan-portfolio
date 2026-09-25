"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "@/content";
import type { PlanetConfig } from "@/lib/universe";

export function Planet({
  config,
  reducedMotion,
  dimmed,
  onEnter,
  onHover,
}: {
  config: PlanetConfig;
  reducedMotion: boolean;
  /** another planet is being entered — fade this one back */
  dimmed: boolean;
  onEnter: (slug: string, worldPos: THREE.Vector3) => void;
  /** reports the hovered project (and its live "enter" trigger) up so it can
   *  render as a corner notification whose own Explore button re-fires the
   *  same camera-zoom transition as clicking the planet directly */
  onHover: (project: Project | null, enter?: () => void) => void;
}) {
  const { project, radius, speed, size, color, angle } = config;
  const pivot = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const theta = useRef(angle);
  const [hovered, setHovered] = useState(false);

  // Reads pivot.current lazily, so calling this later (e.g. from the corner
  // notification's Explore button, after the planet has kept orbiting) still
  // captures its current world position rather than a stale one from hover time.
  const enter = () => {
    if (pivot.current) onEnter(project.slug, pivot.current.getWorldPosition(new THREE.Vector3()));
  };

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
          onHover(project, enter);
        }}
        onPointerOut={() => {
          setHovered(false);
          setCursor("auto");
        }}
        onClick={(e) => {
          e.stopPropagation();
          enter();
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
    </group>
  );
}
