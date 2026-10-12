"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Lightformer } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  DepthOfField,
  Noise,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import Table from "./Table";
import Lipstick from "./Lipstick";
import Overlay from "./Overlay";

/* ────────────────────────────────────────────────────────────────────
   Scene (Δ3) — lighting rework for a soft, luxury studio look.

   · one key + fill + rim + soft top pool (previously two ambients,
     two shadow-casting directionals, two shadow-casting spots and a
     point light — the blown-out pale-gold source)
   · exactly ONE shadow caster → a single, consistent shadow
     direction (falls toward the lower-left, like the reference)
   · studio environment = Lightformer softboxes only (no CDN preset,
     no children+preset conflict, no intensity 100)
   · post-process finish: bloom on the metal speculars, gentle DoF,
     ACES tone mapping (the composer disables the renderer's tone
     mapping, so it must live here), vignette + a whisper of grain
   ──────────────────────────────────────────────────────────────────── */

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 6, 0], fov: 45, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap; // soft-edged shadows
      }}
      style={{ background: "transparent" }}
    >
      {/* ── Global fill ─────────────────────────────────────────────
         Warm sky / dark warm ground — a soft base so nothing reads
         as a hole, without flattening the shading. */}
      <hemisphereLight intensity={0.25} color="#fff0dc" groundColor="#171008" />

      {/* ── Key — one large soft source from the upper-right.
         The ONLY shadow caster: every shadow falls the same way
         (toward the lower-left) exactly like the reference. */}
      <directionalLight
        position={[6.5, 8, -5.5]}
        intensity={3.4}
        color="#ffe3c2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />

      {/* ── Fill — cool bounce from the lower-left, no shadow */}
      <directionalLight position={[-6.5, 3.5, 5]} intensity={1.1} color="#c3cdf0" />

      {/* ── Warm rim graze — keeps metal edges alive */}
      <directionalLight position={[-3.5, 5, 9]} intensity={1.5} color="#ffd2a0" />

      {/* ── Soft top pool — lifts the product area without adding a
         second shadow direction (no castShadow) */}
      <spotLight
        position={[0, 9, 1.5]}
        angle={0.6}
        penumbra={1}
        decay={2}
        distance={45}
        intensity={150}
        color="#ffe9d2"
      />

      {/* ── Studio environment — one coherent source of reflections.
         Lightformer softboxes only: metals pick up soft studio
         highlights, the rest of the void stays deep. */}
      <Environment resolution={256} frames={1}>
        <mesh scale={100}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#070605" side={THREE.BackSide} />
        </mesh>

        <Lightformer
          form="rect"
          intensity={5}
          color="#fff2de"
          scale={[9, 5, 1]}
          position={[0, 7, 0]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={3.2}
          color="#ffd9a4"
          scale={[7, 4, 1]}
          position={[7, 3, 0]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          color="#a9bcff"
          scale={[6, 4, 1]}
          position={[-7, 3, 0]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="ring"
          intensity={0.5}
          color="#4a3623"
          scale={5}
          position={[0, -5, 0]}
          target={[0, 0, 0]}
        />
      </Environment>

      <Suspense fallback={null}>
        <Overlay />
        <Table />
        <Lipstick />
        {/* Cube — parked placeholder; mount from Components/Cube.tsx when needed */}

        <ContactShadows
          position={[0, 0.011, 0]}
          opacity={0.55}
          scale={11}
          blur={4.5}
          far={4}
          color="#000000"
        />
      </Suspense>

      {/* ── Luxury finish — bloom on the metal speculars, gentle DoF on
         the far set, ACES tone mapping (the composer disables the
         renderer's tone mapping, so it must live here), vignette and
         a whisper of film grain. */}
      <EffectComposer multisampling={4}>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
        <DepthOfField focusDistance={5.6} focusRange={3.2} bokehScale={2.2} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette offset={0.26} darkness={0.6} />
        <Noise premultiply opacity={0.035} />
      </EffectComposer>
    </Canvas>
  );
}
