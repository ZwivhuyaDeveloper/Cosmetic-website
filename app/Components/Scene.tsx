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

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 6, 0], fov: 45, near: 0.1, far: 150 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFShadowMap;
      }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.08} color="#1a1c2e" />

      <directionalLight
        position={[4, 9, 5]}
        intensity={2.6}
        color="#ffd6a8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-6, 4, -3]} intensity={0.55} color="#7da4ff" />

      <spotLight
        position={[2, 3, -6]}
        angle={0.55}
        penumbra={1}
        intensity={4.5}
        color="#ffb178"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <spotLight
        position={[0, 12, 0]}
        angle={0.5}
        penumbra={0.9}
        intensity={3.0}
        color="#fff0dc"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />

      <pointLight
        position={[3, 2, 2]}
        intensity={0.9}
        color="#ff8a3d"
        distance={7}
        decay={2}
      />

      <Environment resolution={256} frames={1} preset="city" environmentIntensity={100}>
        <mesh scale={100}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#050505" side={THREE.BackSide} />
        </mesh>
      </Environment>

      <Suspense fallback={null}>
        <Overlay />
        <Table />
        <Fabric />
        <MakeupProps />
        <Lipstick />

        <ContactShadows
          position={[0, 0.011, 0]}
          opacity={0.6}
          scale={10}
          blur={5}
          far={4}
          color="#000000"
        />
      </Suspense>

      <EffectComposer multisampling={4}>
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
      </EffectComposer>
    </Canvas>
  );
}