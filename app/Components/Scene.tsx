"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import Table from "./Table";
import Lipstick from "./Lipstick";
import Overlay from "./Overlay";

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 6, 0], fov: 50, near: 0.1, far: 150 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFShadowMap;
      }}
      style={{ background: "transparent" }}
    >
      {/* ── Lights and non-suspending stuff can stay outside ── */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <spotLight position={[-5, 8, -5]} angle={0.5} penumbra={0.5} intensity={0.8} castShadow />
      <Environment preset="studio" />

      {/* ── Anything that loads assets MUST be inside Suspense ── */}
      <Suspense fallback={null}>
        <Table />
        <Lipstick />
        <Overlay />

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
      </Suspense>
    </Canvas>
  );
}