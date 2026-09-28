"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "../lib/useScrollStore";
import { readTrack } from "../lib/sample";

export default function Lipstick() {
  const groupMesh = useRef<THREE.Group>(null);

  // Model built from y=0 (base bottom) → y=2.52 (bullet tip top)
  const CENTER_OFFSET = 1.26; // = 2.52 / 2

  useFrame(() => {
    if (!groupMesh.current) return;

    const scroll = useScrollStore.getState().scrollProgress;
    const y = readTrack(scroll, "bowl.y") ?? 0.2;
    const rotDeg = readTrack(scroll, "bowl.rotation") ?? 0;
    const rx = THREE.MathUtils.degToRad(readTrack(scroll, "bowl.rotation.x") ?? 0);
    const ry = THREE.MathUtils.degToRad(readTrack(scroll, "bowl.rotation.y") ?? 0);
    const rz = THREE.MathUtils.degToRad(readTrack(scroll, "bowl.rotation.z") ?? 0);

    groupMesh.current.position.y = y;
    groupMesh.current.rotation.set(rx, ry, rz);
  });

  return (
    <group ref={groupMesh} position={[0, 0.2, 0]}>
      {/* ── TILT: lays the lipstick on its side (world-Z = lipstick length) ── */}
      <group rotation={[Math.PI / -2, 0, 0]}>
        {/* ── CENTER: shifts model along its LOCAL Y so origin = center of mass ── */}
        <group position={[0, -CENTER_OFFSET, 0]}>

          <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.32, 0.32, 1.4, 64]} />
            <meshStandardMaterial color="#1c1c1c" roughness={0.35} metalness={0.85} />
          </mesh>

          <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.325, 0.325, 0.12, 64]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.6} />
          </mesh>

          <mesh position={[0, 1.42, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.05, 64]} />
            <meshStandardMaterial color="#d4af5a" roughness={0.18} metalness={1.0} />
          </mesh>

          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.29, 0.29, 0.12, 64]} />
            <meshStandardMaterial color="#2b2b2b" roughness={0.4} metalness={0.7} />
          </mesh>

          <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.27, 0.29, 0.7, 64]} />
            <meshStandardMaterial color="#b8304a" roughness={0.38} metalness={0.05} />
          </mesh>

          <mesh position={[0, 2.25, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.27, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#b8304a" roughness={0.38} metalness={0.05} />
          </mesh>

        </group>
      </group>
    </group>
  );
}