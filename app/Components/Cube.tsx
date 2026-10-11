//  this is a placeholder mech design for now.
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "../lib/useScrollStore";
import { readTrack } from "../lib/sample";

export default function Cube() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#c97b3a"),
      roughness: 0.95,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    const cube = new THREE.Mesh(geometry, material);
    return geometry;
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
    const z = readTrack(scroll, "cube.z") ?? 0.5;
    meshRef.current.position.z = z;
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