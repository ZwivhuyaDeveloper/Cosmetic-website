"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

import albedoImg from "../../public/textures/marble/white_marble.jpg";
import roughnessImg from "../../public/textures/marble/white_marble_roughness.jpg";

const albedoUrl =
  typeof albedoImg === "string" ? albedoImg : (albedoImg as any).src;
const roughnessUrl =
  typeof roughnessImg === "string" ? roughnessImg : (roughnessImg as any).src;

/* ────────────────────────────────────────────────────────────────────
   Marble surface (Δ3) — white Calacatta-style stone replacing the
   warm-brown Marble014.

   Mapping (checked — no distortion, no seams in frame):
   · albedo is a square 751² crop → maps square-to-square on the plane
   · repeat 1.25 → one tile spans 16 world units; the tile wrap seam
     sits at x/z ≈ +6, beyond the visible window (±5 / ±2.5)
   · albedo sRGB, roughness linear data; both share the same repeat so
     the veins keep their slightly rougher finish
   · polished stone = map-driven roughness + a soft clearcoat sheen
   ──────────────────────────────────────────────────────────────────── */

export default function Table() {
  const [maps, setMaps] = useState<{
    albedo: THREE.Texture;
    roughness: THREE.Texture;
  } | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    const load = (url: string) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        loader.load(
          url,
          (tex) => resolve(tex),
          undefined,
          () => reject(new Error(`Failed to load: ${url}`))
        );
      });

    Promise.all([load(albedoUrl), load(roughnessUrl)])
      .then(([albedo, roughness]) => {
        // Albedo carries colour → sRGB · roughness is *data* → linear
        albedo.colorSpace = THREE.SRGBColorSpace;
        roughness.colorSpace = THREE.NoColorSpace;

        [albedo, roughness].forEach((t) => {
          t.wrapS = t.wrapT = THREE.RepeatWrapping;
          t.repeat.set(1.25, 1.25);
          t.anisotropy = 16;
          t.needsUpdate = true; // force GPU re-upload with new settings
        });

        setMaps({ albedo, roughness });
      })
      .catch((e) => console.error("[Table]", e));
  }, []);

  if (!maps) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshPhysicalMaterial color="#ece7df" roughness={0.3} metalness={0} />
      </mesh>
    );
  }

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshPhysicalMaterial
        color="#ffffff"
        map={maps.albedo}
        roughnessMap={maps.roughness}
        roughness={1.0} /* map-driven: polished field ≈ 0.27, veins ≈ 0.45 */
        metalness={0.0}
        clearcoat={0.35} /* polished stone sheen */
        clearcoatRoughness={0.5}
        clearcoatRoughnessMap={maps.roughness}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}
