"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

export default function Table() {
  const [albedo, normal, roughness, ao] = useTexture([
    "/textures/marble/Marble014_2K-JPG_Color.jpg",
    "/textures/marble/Marble014_2K-JPG_NormalGL.jpg",
    "/textures/marble/Marble014_2K-JPG_Roughness.jpg",
    "/textures/marble/Marble014_2K-JPG_Displacement.jpg",
  ]);

  useMemo(() => {
    // ── COLOR SPACE: only albedo is sRGB ──
    albedo.colorSpace = THREE.SRGBColorSpace;

    // Data maps stay linear (default) — do NOT set colorSpace on these.
    normal.colorSpace    = THREE.NoColorSpace;
    roughness.colorSpace = THREE.NoColorSpace;
    ao.colorSpace        = THREE.NoColorSpace;

    // ── TILING: same UV across all maps ──
    const REPEAT = 2;
    [albedo, normal, roughness, ao].forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(REPEAT, REPEAT);
      t.anisotropy = 16;
    });
  }, [albedo, normal, roughness, ao]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshPhysicalMaterial
        map={albedo}
        normalMap={normal}
        normalScale={new THREE.Vector2(0.6, 0.6)}
        roughnessMap={roughness}
        roughness={1.0}          // multiplier — keeps map variance
        metalness={0.0}          // marble is dielectric
        aoMap={ao}
        aoMapIntensity={0.8}
        clearcoat={0.9}
        clearcoatRoughness={0.1}
        envMapIntensity={0.8}
      />
    </mesh>
  );
}