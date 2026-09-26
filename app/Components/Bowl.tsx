"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "../lib/useScrollStore";
import { SECTIONS, phase } from "../lib/sections";
import { ease } from "../lib/easing";

export default function Bowl() {
  const meshRef = useRef<THREE.Mesh>(null);

  const MAX_LIFT = 2;
  const RADIANS_PER_AXIS = THREE.MathUtils.degToRad(720);

  const geometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const outerRadius = 1.2;
    const innerRadius = 0.9;
    const height = 0.4;

    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(outerRadius, 0));
    points.push(new THREE.Vector2(outerRadius, height));
    points.push(new THREE.Vector2(innerRadius, height));
    points.push(new THREE.Vector2(innerRadius, 0.05));
    points.push(new THREE.Vector2(0, 0.05));

    return new THREE.LatheGeometry(points, 64);
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c97b3a"),
        roughness: 0.95,
        metalness: 0.0,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame(() => {
    if (!meshRef.current) return;

    // Read straight from the conductor — no prop drilling
    const scroll = useScrollStore.getState().scrollProgress;
    const p = THREE.MathUtils.clamp(scroll, 0, 1);

    // Position: eased lift across the hero section only
    const liftT = phase(p, SECTIONS.hero);
    meshRef.current.position.y = ease.inOut(liftT) * MAX_LIFT;

    // Rotation: continuous 0 → 720° on all axes over the full scroll
    meshRef.current.rotation.x = p * RADIANS_PER_AXIS;
    meshRef.current.rotation.y = p * RADIANS_PER_AXIS;
    meshRef.current.rotation.z = p * RADIANS_PER_AXIS;

    // Endpoint lock for exact seamless handoff
    if (p === 1) {
      meshRef.current.rotation.set(
        RADIANS_PER_AXIS,
        RADIANS_PER_AXIS,
        RADIANS_PER_AXIS
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
      position={[0, 0.2, 0]}
    />
  );
}