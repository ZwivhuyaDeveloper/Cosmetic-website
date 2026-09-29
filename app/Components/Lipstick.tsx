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

  // Lift the whole assembly so the cylinder (r=0.32) clears the fabric top.
  const Y_OFFSET = 0.25;

  useFrame(() => {
    if (!groupMesh.current) return;

    const scroll = useScrollStore.getState().scrollProgress;
    const y = (readTrack(scroll, "bowl.y") ?? 0.2) + Y_OFFSET;
    const rx = THREE.MathUtils.degToRad(readTrack(scroll, "bowl.rotation.x") ?? 0);
    const ry = THREE.MathUtils.degToRad(readTrack(scroll, "bowl.rotation.y") ?? 0);
    const rz = THREE.MathUtils.degToRad(readTrack(scroll, "bowl.rotation.z") ?? 0);

    groupMesh.current.position.y = y;
    groupMesh.current.rotation.set(rx, ry, rz);
  });

  return (
    <group ref={groupMesh} position={[0, 0.45, 0]}>
      {/* Tilt — lipstick lies on its side */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {/* Center — local origin at center of mass */}
        <group position={[0, -CENTER_OFFSET, 0]}>

          {/* Base tube — gold, matches reference case */}
          <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.32, 0.32, 1.4, 64]} />
            <meshStandardMaterial
              color="#c9a44a"
              roughness={0.28}
              metalness={0.95}
            />
          </mesh>

          {/* Dark matte bottom cap */}
          <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.325, 0.325, 0.12, 64]} />
            <meshStandardMaterial color="#111" roughness={0.55} metalness={0.2} />
          </mesh>

          {/* Polished gold ring */}
          <mesh position={[0, 1.42, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.05, 64]} />
            <meshStandardMaterial
              color="#e8c46a"
              roughness={0.12}
              metalness={1.0}
            />
          </mesh>

          {/* Inner dark collar */}
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.29, 0.29, 0.12, 64]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.45} metalness={0.5} />
          </mesh>

          {/* Bullet body — deep red */}
          <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.27, 0.29, 0.7, 64]} />
            <meshStandardMaterial
              color="#a8203a"
              roughness={0.42}
              metalness={0.05}
            />
          </mesh>

          {/* Bullet rounded tip */}
          <mesh position={[0, 2.25, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.27, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#a8203a"
              roughness={0.42}
              metalness={0.05}
            />
          </mesh>

        </group>
      </group>
    </group>
  );
}