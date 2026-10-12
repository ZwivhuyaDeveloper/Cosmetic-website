"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "../lib/useScrollStore";
import { readTrack } from "../lib/sample";

/* ────────────────────────────────────────────────────────────────────
   Realism pass (Δ2) — mesh + texture design only.

   Composition, part placement, envelopes and the track API remain
   unchanged.

   Δ1 · every part is a profiled lathe with chamfers / edge breaks;
        cap parting lip + inner sleeve; axial brushed grain on the gold.
   Δ2 · bullet rebuilt: rounded edge bevel along the slanted rim,
        slightly softened slant, gently convex face, fine wax grain,
        sheen removed (it washed the red to pink);
        brushed grain reworked (seamless periodic grooves) and now
        applied to the dark components as well.

   Envelopes kept: tube/cap r 0.32 × 1.4 · ring r 0.34 × 0.05 ·
   collar r 0.29 × 0.12 · base r 0.325 × 0.12 · bullet r 0.27 with
   tip at model y 2.52.
   ──────────────────────────────────────────────────────────────────── */

const SEGMENTS = 96;

const lathe = (pts: [number, number][], segments = SEGMENTS) =>
  new THREE.LatheGeometry(
    pts.map(([r, y]) => new THREE.Vector2(r, y)),
    segments
  );

/* ── Brushed streak texture ────────────────────────────────────────
   One-dimensional roughness streaks: constant along the profile (v),
   varying around the circumference (u) → axial brushing on lathes,
   fine circular brushing on flat tops. Every component is periodic,
   so the tile repeats seamlessly. ────────────────────────────────── */
const makeStreakTexture = (
  width: number,
  base: number,
  amplitude: number,
  grooves: number,
  seed: number
) => {
  const data = new Uint8Array(width * 4);
  const tau = Math.PI * 2;
  for (let i = 0; i < width; i++) {
    const t = i / width;
    // fine irregular groove comb — periodic phase, so no tile seam
    const comb = Math.sin(
      tau * grooves * t +
        1.7 * Math.sin(tau * 5 * t + 1.3 + seed) +
        0.9 * Math.sin(tau * 11 * t + 0.4)
    );
    const drift =
      0.6 * Math.sin(tau * 2 * t + 0.7 + seed) +
      0.4 * Math.sin(tau * 5 * t + 2.1);
    const jitter = (() => {
      const s = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
      return s - Math.floor(s) - 0.5;
    })();
    const v = THREE.MathUtils.clamp(
      base + amplitude * (0.55 * comb + 0.3 * drift + 0.15 * 2 * jitter),
      0,
      1
    );
    const b = Math.round(v * 255);
    data[i * 4 + 0] = b;
    data[i * 4 + 1] = b;
    data[i * 4 + 2] = b;
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, width, 1, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
};

/* ── Wax grain texture — fine isotropic surface unevenness for the
      bullet (2-D value noise, two octaves). ──────────────────────── */
const makeWaxGrainTexture = (size: number, base: number, amplitude: number) => {
  const data = new Uint8Array(size * size * 4);
  const hash = (x: number, y: number) => {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const smooth = (x: number) => x * x * (3 - 2 * x);
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = smooth(x - xi), yf = smooth(y - yi);
    const a = hash(xi, yi), b = hash(xi + 1, yi);
    const c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return (
      a * (1 - xf) * (1 - yf) + b * xf * (1 - yf) +
      c * (1 - xf) * yf + d * xf * yf
    );
  };
  let i = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = 0.65 * noise(x / 5, y / 5) + 0.35 * noise(x / 2, y / 2);
      const v = THREE.MathUtils.clamp(base + amplitude * (n - 0.5) * 2, 0, 1);
      const b = Math.round(v * 255);
      data[i++] = b;
      data[i++] = b;
      data[i++] = b;
      data[i++] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
};

// Gold satin — fine axial brush (avg ≈ 0.33)
const GOLD_STREAK = makeStreakTexture(1024, 0.33, 0.09, 260, 11);
GOLD_STREAK.repeat.set(6, 1);

// Dark machined metal — matte with a subtle brush (avg ≈ 0.52)
const DARK_STREAK = makeStreakTexture(512, 0.52, 0.15, 150, 29);
DARK_STREAK.repeat.set(4, 1);

// Bullet wax grain (avg ≈ 0.46)
const WAX_GRAIN = makeWaxGrainTexture(256, 0.46, 0.09);
WAX_GRAIN.repeat.set(4, 3);

/* ── Profiles ──────────────────────────────────────────────────────
   All coordinates are in each part's local space; the mesh positions
   below are unchanged from the previous version. ─────────────────── */

// Base tube — outer wall 0.32, local y −0.7 → 0.7 (mesh y 0.7, model 0 → 1.4)
const TUBE_GEOMETRY = lathe([
  [0.000, -0.700], // base centre (hidden under the dark base cap)
  [0.300, -0.700],
  [0.316, -0.690], // bottom edge break
  [0.320, -0.672],
  [0.320,  0.648],
  [0.318,  0.672], // top edge break
  [0.310,  0.690],
  [0.300,  0.700], // top rim
  [0.296,  0.694], // inner lip
  [0.294,  0.660],
  [0.294,  0.500],
  [0.290,  0.482],
  [0.000,  0.470], // inner floor (only visible with the cap off)
]);

// Cap — rounded shoulder + real parting lip and inner sleeve.
// Rest pose (capY 2.0) still spans model 1.3 → 2.7, covering rim + bullet.
const CAP_GEOMETRY = lathe([
  [0.312, -0.560], // inner sleeve top
  [0.312, -0.690], // inner wall (faces the tube)
  [0.316, -0.698],
  [0.324, -0.700], // bottom edge
  [0.330, -0.696], // parting lip — sits a hair proud of the tube wall
  [0.331, -0.688],
  [0.326, -0.672],
  [0.322, -0.656], // outer wall
  [0.322,  0.630],
  [0.320,  0.664], // rounded shoulder
  [0.314,  0.684],
  [0.300,  0.696],
  [0.272,  0.700],
  [0.000,  0.700], // top centre
]);

// Polished ring — closed band, outer 0.34, height 0.05 (mesh y 1.42)
const RING_GEOMETRY = lathe([
  [0.319, -0.025], // inner wall (tucked behind tube / cap)
  [0.334, -0.025],
  [0.338, -0.021], // rounded outer edges = the polish line
  [0.340, -0.014],
  [0.340,  0.014],
  [0.338,  0.021],
  [0.334,  0.025],
  [0.319,  0.025],
  [0.319, -0.025], // closed loop
]);

// Inner collar — dark sleeve the bullet rises from (mesh y 1.5)
const COLLAR_GEOMETRY = lathe([
  [0.000, -0.060],
  [0.282, -0.060],
  [0.289, -0.052], // bottom edge break
  [0.290, -0.040],
  [0.290,  0.040],
  [0.289,  0.052],
  [0.282,  0.060], // top edge break
  [0.274,  0.060],
  [0.272,  0.056], // bullet opening
  [0.272,  0.010],
  [0.000,  0.008], // recessed floor
]);

// Dark base cap — chamfered top and bottom edges (mesh y 0.06)
const BASE_GEOMETRY = lathe([
  [0.000, -0.060],
  [0.300, -0.060],
  [0.318, -0.052],
  [0.325, -0.042], // bottom chamfer
  [0.325,  0.030],
  [0.322,  0.048],
  [0.312,  0.058],
  [0.300,  0.060], // top chamfer
  [0.000,  0.060],
]);

/* ── Bullet — classic angled tip, beveled edges ────────────────────
   Vertical wall whose top boundary follows the slant plane; the rim
   between wall and face is a true rounded bevel (quarter-arc band),
   and the face closes into a gently convex warp from the bevel rim
   to the tip centre — smooth normals throughout, so the bevel shows
   a soft specular band instead of a razor edge. UVs are authored for
   the wax-grain roughness map. ──────────────────────────────────── */
const BULLET_GEOMETRY = (() => {
  const R = 0.27;         // radius (unchanged)
  const H = 0.97;         // height (unchanged: model 1.55 → 2.52 tip)
  const SLANT = 0.32;     // height drop across the tip ≈ 30.6°
  const BEVEL = 0.042;    // rounded edge between wall and face
  const BEVEL_STEPS = 10; // arc segments across the bevel
  const N = SEGMENTS;     // radial segments (96)

  const topY = (t: number) => H - SLANT / 2 + (SLANT / 2) * Math.cos(t);

  // ring list: bottom rim → wall top → bevel arc → (face fan closes on top)
  const ring = (r: number, y: (t: number) => number) => ({ r, y });
  const rings = [
    ring(R, () => 0),                 // bottom rim
    ring(R, (t) => topY(t) - BEVEL),  // wall top
  ];
  for (let k = 1; k <= BEVEL_STEPS; k++) {
    const a = (k / BEVEL_STEPS) * (Math.PI / 2);
    const r = R - BEVEL + BEVEL * Math.cos(a);
    rings.push(ring(r, (t) => topY(t) + BEVEL * Math.sin(a) - BEVEL));
  }
  const cols = N + 1; // seam column duplicated (u 0 … 1) for clean UVs

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let k = 0; k < rings.length; k++) {
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      positions.push(
        rings[k].r * Math.cos(t),
        rings[k].y(t),
        rings[k].r * Math.sin(t)
      );
      uvs.push(i / N, k / (rings.length - 1));
    }
  }

  for (let k = 0; k < rings.length - 1; k++) {
    for (let i = 0; i < N; i++) {
      const a = k * cols + i;         // lower ring, this column
      const b = k * cols + i + 1;     // lower ring, next column
      const c = (k + 1) * cols + i + 1; // upper ring, next column
      const d = (k + 1) * cols + i;   // upper ring, this column
      indices.push(a, c, b, a, d, c);
    }
  }

  // slanted face — fan from the bevel rim to the tip centre
  const topCentre = positions.length / 3;
  positions.push(0, H - SLANT / 2, 0);
  uvs.push(0.5, 1);
  const rim = (rings.length - 1) * cols;
  for (let i = 0; i < N; i++) {
    indices.push(topCentre, rim + i + 1, rim + i);
  }

  // flat underside (hidden inside the collar)
  const botCentre = positions.length / 3;
  positions.push(0, 0, 0);
  uvs.push(0.5, 0);
  for (let i = 0; i < N; i++) {
    indices.push(botCentre, i, i + 1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
})();

export default function Lipstick() {
  const groupMesh = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Model built from y=0 (base bottom) → y=2.52 (bullet tip top)
  const CENTER_OFFSET = 1.26; // = 2.52 / 2

  // Lift the whole assembly so the cylinder (r=0.32) clears the fabric top.
  const Y_OFFSET = 0.25;

  useFrame(() => {
    if (!groupMesh.current) return;

    const scroll = useScrollStore.getState().scrollProgress;
    const y = (readTrack(scroll, "lipstick.y") ?? 0.2) + Y_OFFSET;
    const rx = THREE.MathUtils.degToRad(readTrack(scroll, "lipstick.rotation.x") ?? 0);
    const ry = THREE.MathUtils.degToRad(readTrack(scroll, "lipstick.rotation.y") ?? 0);
    const rz = THREE.MathUtils.degToRad(readTrack(scroll, "lipstick.rotation.z") ?? 0);
    groupMesh.current.position.y = y;
    groupMesh.current.rotation.set(rx, ry, rz);

    if (!meshRef.current) return;

    const capY = readTrack(scroll, "cap.y") ?? 0.0;
    meshRef.current.position.y = capY;
  });

  return (
    <group ref={groupMesh} position={[0, 0.45, 0]}>
      {/* Tilt — lipstick lies on its side */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {/* Center — local origin at center of mass */}
        <group position={[0, -CENTER_OFFSET, 0]}>

          {/* Base tube — brushed satin gold, chamfered edges */}
          <mesh position={[0, 0.7, 0]} geometry={TUBE_GEOMETRY} castShadow receiveShadow>
            <meshPhysicalMaterial
              color="#c9a44a"
              metalness={0.96}
              roughness={1.0} /* modulated by the streak map */
              roughnessMap={GOLD_STREAK}
              anisotropy={0.65}
              anisotropyRotation={Math.PI / 2} /* grain runs along the case axis */
              clearcoat={0.12} /* thin lacquer over the satin */
              clearcoatRoughness={0.5}
              envMapIntensity={1.5}
            />
          </mesh>

          {/* Cap — brushed satin gold with a rounded shoulder */}
          <mesh ref={meshRef} position={[0, 2.1, 0]} geometry={CAP_GEOMETRY} castShadow receiveShadow>
            <meshPhysicalMaterial
              color="#c9a44a"
              metalness={0.96}
              roughness={1.0}
              roughnessMap={GOLD_STREAK}
              anisotropy={0.65}
              anisotropyRotation={Math.PI / 2}
              clearcoat={0.12}
              clearcoatRoughness={0.5}
              envMapIntensity={1.5}
            />
          </mesh>

          {/* Dark machined bottom cap */}
          <mesh position={[0, 0.06, 0]} geometry={BASE_GEOMETRY} castShadow receiveShadow>
            <meshStandardMaterial
              color="#111"
              roughness={1.0}
              roughnessMap={DARK_STREAK}
              metalness={0.3}
            />
          </mesh>

          {/* Polished gold ring */}
          <mesh position={[0, 1.42, 0]} geometry={RING_GEOMETRY} castShadow receiveShadow>
            <meshStandardMaterial
              color="#e8c46a"
              roughness={0.12}
              metalness={1.0}
              envMapIntensity={1.5}
            />
          </mesh>

          {/* Inner dark collar */}
          <mesh position={[0, 1.5, 0]} geometry={COLLAR_GEOMETRY} castShadow receiveShadow>
            <meshStandardMaterial
              color="#1a1a1a"
              roughness={1.0}
              roughnessMap={DARK_STREAK}
              metalness={0.5}
            />
          </mesh>

          {/* Bullet — deep red wax, beveled slanted tip, fine grain */}
          <mesh position={[0, 1.55, 0]} geometry={BULLET_GEOMETRY} castShadow receiveShadow>
            <meshPhysicalMaterial
              color="#a8203a"
              roughness={1.0} /* modulated by the wax-grain map */
              roughnessMap={WAX_GRAIN}
              metalness={0}
            />
          </mesh>

        </group>
      </group>
    </group>
  );
}
