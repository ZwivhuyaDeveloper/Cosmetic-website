"use client";

import { useRef } from "react";
import * as THREE from "three";

/* ───────────── Pencil (top-left) ───────────── */
function Pencil({ position, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} rotation={rotation}>
      {/* Body — lies flat on its side */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 2.2, 24]} />
        <meshStandardMaterial color="#111" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Cone tip */}
      <mesh
        position={[1.2, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
        castShadow
      >
        <coneGeometry args={[0.05, 0.18, 24]} />
        <meshStandardMaterial color="#c09080" roughness={0.7} />
      </mesh>
      {/* Gold band near tip */}
      <mesh position={[1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.08, 24]} />
        <meshStandardMaterial color="#c9a44a" roughness={0.2} metalness={1} />
      </mesh>
    </group>
  );
}

/* ───────────── Mascara (bottom-right) ───────────── */
function Mascara({ position, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main tube — horizontal */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.14, 1.4, 32]} />
        <meshStandardMaterial color="#111" roughness={0.35} metalness={0.2} />
      </mesh>
      {/* Gold ring */}
      <mesh position={[0.75, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.08, 32]} />
        <meshStandardMaterial color="#c9a44a" roughness={0.18} metalness={1} />
      </mesh>
      {/* Wand shaft extending right */}
      <mesh
        position={[1.35, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.02, 0.02, 1.0, 12]} />
        <meshStandardMaterial color="#111" roughness={0.4} />
      </mesh>
      {/* Spiral brush tip — stacked small spheres look like bristles */}
      <group position={[1.95, 0, 0]}>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh
            key={i}
            position={[(i - 4.5) * 0.05, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.06, 0.06, 0.045, 12]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
        ))}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.06, 0.15, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/* ───────────── Makeup brush ───────────── */
function Brush({ position, rotation = [0, 0, 0], scale = 1 }: any) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Handle — long, tapered black */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.055, 0.075, 1.2, 24]} />
        <meshStandardMaterial color="#111" roughness={0.35} metalness={0.15} />
      </mesh>
      {/* Gold ferrule */}
      <mesh position={[0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.14, 24]} />
        <meshStandardMaterial color="#c9a44a" roughness={0.18} metalness={1} />
      </mesh>
      {/* Bristles — cream, rounded */}
      <mesh
        position={[0.85, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.02, 0.13, 0.28, 24]} />
        <meshStandardMaterial color="#f5d5c0" roughness={0.95} />
      </mesh>
      {/* Rounded bristle tip */}
      <mesh position={[1.0, 0, 0]} castShadow>
        <sphereGeometry args={[0.09, 20, 16]} />
        <meshStandardMaterial color="#f5d5c0" roughness={0.95} />
      </mesh>
    </group>
  );
}

/* ───────────── Powder spill ───────────── */
function PowderSpill({ position }: any) {
  // A few overlapping translucent discs make an irregular blob
  const blobs = [
    { x: 0, z: 0, r: 0.55, o: 0.85 },
    { x: 0.4, z: 0.15, r: 0.35, o: 0.7 },
    { x: -0.35, z: 0.2, r: 0.3, o: 0.6 },
    { x: 0.1, z: -0.35, r: 0.28, o: 0.65 },
  ];
  return (
    <group position={position}>
      {blobs.map((b, i) => (
        <mesh
          key={i}
          position={[b.x, 0.005, b.z]}
          rotation={[-Math.PI / 2, 0, i * 0.6]}
        >
          <circleGeometry args={[b.r, 32]} />
          <meshStandardMaterial
            color="#c67a86"
            roughness={1.0}
            transparent
            opacity={b.o}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ───────────── Main export ───────────── */
export default function MakeupProps() {
  return (
    <>
      {/* Pencil — top-left, angled */}
      <Pencil position={[-2.5, 0.06, -1.2]} rotation={[0, 0.35, 0]} />

      {/* Mascara — bottom-right */}
      <Mascara position={[2.2, 0.15, 1.5]} rotation={[0, -0.5, 0]} />

      {/* Two brushes — bottom-left, fanned out */}
      <Brush position={[-1.9, 0.1, 1.6]} rotation={[0, 0.6, 0]} scale={0.9} />
      <Brush position={[-2.6, 0.1, 1.0]} rotation={[0, -0.4, 0]} scale={0.75} />

      {/* Pink powder spill between the brushes */}
      <PowderSpill position={[-1.6, 0, 0.9]} />
    </>
  );
}