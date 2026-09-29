"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, SoftShadows } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  DepthOfField,
  ChromaticAberration,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import Table from "./Table";
import Lipstick from "./Lipstick";
import Overlay from "./Overlay";

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 6, 0], fov: 45, near: 0.1, far: 150 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;

        // Atmospheric depth — swallows the edges of the marble plane
        scene.fog = new THREE.FogExp2("#050505", 0.035);
      }}
      style={{ background: "transparent" }}
    >

      {/* ─────────── CINEMATIC LIGHTING RIG ─────────── */}

      {/* Ambient — very low, only lifts pure black */}
      <ambientLight intensity={0.08} color="#202230" />

      {/* KEY — warm, upper-front-left, main shaper */}
      <directionalLight
        position={[4, 8, 5]}
        intensity={2.8}
        color="#ffd9b0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-8, 8, 8, -8, 0.5, 30]}
        />
      </directionalLight>

      {/* FILL — cool, soft, opposite side, keeps shadows readable */}
      <directionalLight position={[-6, 4, -3]} intensity={0.6} color="#7fa8ff" />

      {/* RIM / BACKLIGHT — sharp warm edge, separates subject from bg */}
      <spotLight
        position={[2, 3, -6]}
        angle={0.6}
        penumbra={1}
        intensity={4.0}
        color="#ffb070"
        castShadow
        shadow-bias={-0.0005}
      />

      {/* TOP SPOT — overhead pool, gives the "stage" feel */}
      <spotLight
        position={[0, 12, 0]}
        angle={0.55}
        penumbra={0.9}
        intensity={3.5}
        color="#fff2e0"
        castShadow
        shadow-bias={-0.0005}
      />

      {/* ACCENT — warm kicker from the right for the gold ring to catch */}
      <pointLight
        position={[3, 2, 2]}
        intensity={0.8}
        color="#ff8a3d"
        distance={6}
        decay={2}
      />

      {/* Reflections — polished marble catches this in the clearcoat */}
      <Environment preset="studio" environmentIntensity={0.6} />

      {/* ─────────── SCENE CONTENT ─────────── */}
      <Suspense fallback={null}>
        <Table />
        <Lipstick />
        <Overlay />

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.55}
          scale={10}
          blur={2.8}
          far={4}
          color="#000000"
        />
      </Suspense>

      {/* ─────────── POST-PROCESSING ─────────── */}
      <EffectComposer multisampling={4}>
        {/* Subtle DOF — lipstick sharp, distant marble falls off */}
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.06}
          bokehScale={3}
          height={480}
        />

        {/* Bloom on highlights — gold ring and rim glow */}
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.25}
          mipmapBlur
        />

        {/* Chromatic aberration — filmic "lens" character */}
        <ChromaticAberration
          offset={[0.0008, 0.0008]}
          radialModulation={false}
          modulationOffset={0}
          blendFunction={BlendFunction.NORMAL}
        />

        {/* Vignette — darkens corners, pulls focus to center */}
        <Vignette
          eskil={false}
          offset={0.25}
          darkness={0.75}
          blendFunction={BlendFunction.NORMAL}
        />

        {/* Fine film grain — kills the "CG clean" look */}
        <Noise
          premultiply
          blendFunction={BlendFunction.OVERLAY}
          opacity={0.08}
        />
      </EffectComposer>
    </Canvas>
  );
}