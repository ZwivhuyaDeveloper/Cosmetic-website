"use client";

import { useMemo } from "react";
import * as THREE from "three";

export default function Fabric() {
  const geometry = useMemo(() => {
    const W = 6;
    const H = 5;
    const SEG_X = 128;
    const SEG_Y = 108;

    const geo = new THREE.PlaneGeometry(W, H, SEG_X, SEG_Y);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();

    // ── Deterministic value noise (for wrinkles) ──
    const hash = (x: number, y: number) => {
      const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return s - Math.floor(s);
    };
    const noise = (x: number, y: number) => {
      const xi = Math.floor(x);
      const yi = Math.floor(y);
      const xf = x - xi;
      const yf = y - yi;
      const u = xf * xf * (3 - 2 * xf);
      const w = yf * yf * (3 - 2 * yf);
      const a = hash(xi, yi);
      const b = hash(xi + 1, yi);
      const c = hash(xi, yi + 1);
      const d = hash(xi + 1, yi + 1);
      return (
        a * (1 - u) * (1 - w) +
        b * u * (1 - w) +
        c * (1 - u) * w +
        d * u * w
      );
    };
    const fbm = (x: number, y: number, octaves = 4) => {
      let val = 0;
      let amp = 0.5;
      let freq = 1;
      for (let o = 0; o < octaves; o++) {
        val += amp * noise(x * freq, y * freq);
        amp *= 0.5;
        freq *= 2;
      }
      return val;
    };

    // Sharpened sine → 0..1 with a narrow peak.
    // Higher k = sharper ridge, thinner crease line.
    const crease = (t: number, k: number) => {
      const s = Math.sin(t) * 0.5 + 0.5;
      return Math.pow(s, k);
    };

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const x = v.x;
      const y = v.y;

      // Fabric-local 0..1 coords
      const u = x / W + 0.5;
      const w = y / H + 0.5;

      // ── DRAPE DIRECTIONS ──
      // Primary folds run diagonally top-left → bottom-right (like the reference)
      const d1 = u * 1.0 + w * 0.85;
      // Secondary folds cross them at an angle
      const d2 = u * 0.6 - w * 1.0;

      // ── LARGE DRAPE (broad smooth waves) ──
      const drapePrimary =
        Math.sin(d1 * Math.PI * 2.1) * 0.32 +
        Math.sin(d1 * Math.PI * 1.05 + 0.7) * 0.18;
      const drapeSecondary = Math.sin(d2 * Math.PI * 1.7 + 0.4) * 0.20;

      // ── SHARP CREASES (the fold-over lines) ──
      const creaseA = crease(d1 * Math.PI * 3.8 + 0.9, 5) * 0.26;
      const creaseB = crease(d1 * Math.PI * 5.4 + 2.1, 6) * 0.12;
      const creaseC = crease(d2 * Math.PI * 3.2 + 1.3, 5) * 0.16;

      // ── MID WRINKLES (organic, non-periodic) ──
      const wrinkle = (fbm(u * 4.5, w * 4.5) - 0.5) * 0.16;

      // ── MICRO TEXTURE (fine fabric grain) ──
      const micro = (fbm(u * 22, w * 22, 3) - 0.5) * 0.025;

      // ── EDGE FALLOFF (fabric never pokes through the marble) ──
      const nx = x / (W / 2);
      const ny = y / (H / 2);
      const edge =
        Math.max(0, 1 - Math.pow(Math.abs(nx), 2.4)) *
        Math.max(0, 1 - Math.pow(Math.abs(ny), 2.4));

      v.z =
        (drapePrimary +
          drapeSecondary +
          creaseA +
          creaseB +
          creaseC +
          wrinkle +
          micro) *
        edge;

      pos.setXYZ(i, v.x, v.y, v.z);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#c99a55"),
        metalness: 0.95,
        roughness: 0.28,
        // Satin sheen at grazing angles
        sheen: 1.0,
        sheenColor: new THREE.Color("#ffd97a"),
        sheenRoughness: 0.35,
        // Thin polish layer
        clearcoat: 0.4,
        clearcoatRoughness: 0.25,
        side: THREE.DoubleSide,
        envMapIntensity: 1.4,
      }),
    []
  );

  return (
    <group rotation={[0, Math.PI / 7, 0]} position={[1.3, 0.02, 0]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={geometry}
        material={material}
        castShadow
        receiveShadow
      />
    </group>
  );
}