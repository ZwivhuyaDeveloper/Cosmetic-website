"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "../lib/useScrollStore";
import { SECTIONS, phase } from "../lib/sections";
import { ease } from "../lib/easing";

export default function Bowl() {
  const meshRef = useRef<THREE.Mesh>(null);

  // ─── POSITION ───
  const START_Y = 0.2;
  const LIFT_Y  = 1.0;
  const DROP_Y  = 0.2;

  // ─── ROTATION WINDOW ───
  // Rotation spans from the start of hero through the end of outro.
  // At scroll = ROTATION_WINDOW.end, rotation = 720° (= 0° visually).
  // Through the drop section, rotation is locked at that value.
  const ROTATION_WINDOW = {
    start: SECTIONS.hero.start,    // 0.00
    end:   SECTIONS.outro.end,     // 0.85
  };
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

    const scroll = useScrollStore.getState().scrollProgress;
    const p = THREE.MathUtils.clamp(scroll, 0, 1);

    // ─────────────── POSITION ───────────────
    const heroT = phase(p, SECTIONS.hero);
    let targetY = START_Y + (LIFT_Y - START_Y) * ease.inOut(heroT);

    if (p >= SECTIONS.drop.start) {
      const dropT = phase(p, SECTIONS.drop);
      targetY = LIFT_Y + (DROP_Y - LIFT_Y) * ease.in(dropT);
    }

    meshRef.current.position.y = targetY;

    // ─────────────── ROTATION ───────────────
    // Smoothly rotates 0° → 720° across the full window:
    //   hero → overlay → subtitle → outro
    // Past 0.85 it naturally returns 1, so rotation stays at 720° (= 0° visually).
    const rotT = phase(p, ROTATION_WINDOW);
    const rotValue = rotT * RADIANS_PER_AXIS;

    meshRef.current.rotation.set(rotValue, rotValue, rotValue);
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
      position={[0, START_Y, 0]}
    />
  );
}