"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";
import * as THREE from "three";

/** Faint circle showing an orbit path, laid flat on the XZ plane. */
export function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.015, radius + 0.015, 128]} />
      <meshBasicMaterial
        color="#2a3358"
        side={THREE.DoubleSide}
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </mesh>
  );
}

type Rock = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

/** Deterministic PRNG so the belt layout is stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Decorative belt of tumbling rocks between two radii. Becomes the
 *  certificate belt once `certificates` has entries. */
export function AsteroidBelt({
  count,
  inner,
  outer,
  reducedMotion,
}: {
  count: number;
  inner: number;
  outer: number;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  const rocks = useMemo<Rock[]>(() => {
    const rand = mulberry32(1337);
    const out: Rock[] = [];
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = inner + rand() * (outer - inner);
      out.push({
        position: [Math.cos(a) * r, (rand() - 0.5) * 0.9, Math.sin(a) * r],
        rotation: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
        scale: 0.04 + rand() * 0.09,
      });
    }
    return out;
  }, [count, inner, outer]);

  useFrame((_, delta) => {
    if (!reducedMotion && group.current) group.current.rotation.y += delta * 0.015;
  });

  return (
    <group ref={group}>
      <Instances limit={count} range={count}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#5b6488" roughness={1} metalness={0.1} />
        {rocks.map((rock, i) => (
          <Instance key={i} position={rock.position} rotation={rock.rotation} scale={rock.scale} />
        ))}
      </Instances>
    </group>
  );
}

/** When `target` is set, eases the camera toward that point and hands
 *  control back to nobody until the route changes. */
export function CameraRig({ target }: { target: THREE.Vector3 | null }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as { enabled: boolean } | null;
  const desired = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!target) return;
    if (controls) controls.enabled = false;
    desired.copy(target).multiplyScalar(1.32);
    desired.y += 1.3;
    camera.position.lerp(desired, 0.045);
    camera.lookAt(target);
  });

  return null;
}
