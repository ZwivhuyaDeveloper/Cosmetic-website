"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

import albedoImg    from "../../public/textures/marble/Marble014_2K-JPG_Color.jpg";
import normalImg    from "../../public/textures/marble/Marble014_2K-JPG_NormalGL.jpg";
import roughnessImg from "../../public/textures/marble/Marble014_2K-JPG_Roughness.jpg";

const albedoUrl    = typeof albedoImg    === "string" ? albedoImg    : (albedoImg as any).src;
const normalUrl    = typeof normalImg    === "string" ? normalImg    : (normalImg as any).src;
const roughnessUrl = typeof roughnessImg === "string" ? roughnessImg : (roughnessImg as any).src;

export default function Table() {
  const [maps, setMaps] = useState<{
    albedo: THREE.Texture;
    normal: THREE.Texture;
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

    Promise.all([load(albedoUrl), load(normalUrl), load(roughnessUrl)])
      .then(([albedo, normal, roughness]) => {
        // ── Color spaces ──────────────────────────────────────────
        // Albedo carries color          → sRGB
        // Normal + roughness are *data* → linear (NoColorSpace)
        // Getting these wrong is what darkens a light marble.
        albedo.colorSpace    = THREE.SRGBColorSpace;
        normal.colorSpace    = THREE.NoColorSpace;
        roughness.colorSpace = THREE.NoColorSpace;

        [albedo, normal, roughness].forEach((t) => {
          t.wrapS = t.wrapT = THREE.RepeatWrapping;
          t.repeat.set(2, 2);
          t.anisotropy = 16;
          t.needsUpdate = true; // force GPU re-upload with new colorSpace
        });

        setMaps({ albedo, normal, roughness });
      })
      .catch((e) => console.error("[Table]", e));
  }, []);

  if (!maps) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshPhysicalMaterial color="#e8e4dc" roughness={0.3} metalness={0} />
      </mesh>
    );
  }

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshPhysicalMaterial
        map={maps.albedo}
        normalMap={maps.normal}
        normalScale={new THREE.Vector2(0.6, 0.6)}
        roughnessMap={maps.roughness}
        roughness={1.0}              /* was 1.5 — clamped anyway */
        metalness={0.0}
        clearcoat={0.4}              /* was 0.9 — a thin polish, not a mirror */
        clearcoatRoughness={0.25}    /* was 0.1 — softer, less black hotspots */
        envMapIntensity={1.4}        /* was 0.8 — compensate for the dark IBL */
      />
    </mesh>
  );
}