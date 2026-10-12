"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Lightformer } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  DepthOfField,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import Table from "./Table";
import Fabric from "./Fabric";
import Lipstick from "./Lipstick";
import MakeupProps from "./MakeupProps";
import Overlay from "./Overlay";
import Cube from "./Cube";

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 6, 0], fov: 45, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFShadowMap;
      }}
      style={{ background: "transparent" }}
    >
      
      <ambientLight intensity={0.35} color="#20243a" />

            {/* ── Global fill ─────────────────────────────────────────── */}
      {/* Warm sky + cool ground bounce — reads as a lit room, not a void */}
      <hemisphereLight
        intensity={0.9}
        color="#ffffff"
        groundColor="#2a1e18"
      />

      {/* Base ambient, now neutral and actually visible */}
      <ambientLight intensity={1.2} color="#ffffff" />

      <directionalLight
        position={[4, 10, 5]}
        intensity={10.0}
        color="#ffd6a8"
        scale={10}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />


      <directionalLight
        position={[-4, 10, -5]}
        intensity={20.0}
        color="#585654"
        scale={10}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      
      <directionalLight position={[-6, 4, -3]} intensity={1.4} color="#7da4ff" />

      {/* ── Spots ─────────────────────────────────────────────────── */}
      <spotLight
        position={[2, 3, -6]}
        angle={0.55}
        penumbra={1}
        scale={50}
        intensity={24}
        color="#ffb178"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />

      {/* Top-down key — the main brightener for the whole set */}
      <spotLight
        position={[0, 20, 0]}
        scale={50}
        angle={0.65}              // widened from 0.5
        penumbra={2}
        intensity={40}          // doubled from 20
        color="#fff0dc"
        castShadow
        shadow-mapSize={[2048, 2048]} // higher res so wider cone stays crisp
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />

      {/* Fill from below-front so the underside of props isn't black */}
      <pointLight
        position={[0, 2, 6]}
        intensity={3}
        color="#ffe6c8"
        distance={20}
        decay={2}
      />


      <Environment resolution={256} frames={1} preset="city" environmentIntensity={100}>
        <mesh scale={100}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#050505" side={THREE.BackSide} />
        </mesh>

        <Lightformer
          form="rect"
          intensity={0.5}
          color="#7da4ff"
          scale={5}
          position={[-8, 4, -6]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.5}
          color="#ffb178"
          scale={5}
          position={[8, 4, 6]}
          target={[0, 0, 0]}
        />

      </Environment>

      <Suspense fallback={null}>
        <Overlay />
        <Table />
        <Lipstick />
        {/* <Cube /> */}

        <ContactShadows
          position={[0, 0.011, 0]}
          opacity={0.6}
          scale={10}
          blur={5}
          far={4}
          color="#000000"
        />
      </Suspense>


      {/* Effects "use later" */}
      {/* <EffectComposer multisampling={4}>
        <DepthOfField
          focusDistance={10}
          focalLength={23}
          bokehScale={5}
          height={480}
        />
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.72}
          luminanceSmoothing={0.22}
          mipmapBlur
        />
        <Vignette
          offset={0.28}
          darkness={0.75}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer> */}
    </Canvas>
  );
}