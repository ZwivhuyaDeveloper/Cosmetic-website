"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "../lib/useScrollStore";
import { SECTIONS, phase } from "../lib/sections";
import { ease } from "../lib/easing";

export default function Overlay() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const scroll = useScrollStore.getState().scrollProgress;

    // Fade in during the second half of the hero section
    const heroT = phase(scroll, SECTIONS.hero);
    const targetOpacity = ease.inOut(Math.max(0, (heroT - 0.4) / 0.6));

    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial color="#0a0a0a" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}