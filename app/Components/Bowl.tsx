"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "../lib/useScrollStore";
import { readAnywhere } from "../lib/sample";

export default function Bowl() {
  const meshRef = useRef<THREE.Mesh>(null);

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

    const y = readAnywhere(scroll, "bowl.y") ?? 0.2;
    const rotDeg = readAnywhere(scroll, "bowl.rotation") ?? 0;
    const rotRad = THREE.MathUtils.degToRad(rotDeg);

    meshRef.current.position.y = y;
    meshRef.current.rotation.set(rotRad, rotRad, rotRad);
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