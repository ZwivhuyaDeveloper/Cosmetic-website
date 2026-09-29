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

    console.log("Loading:", albedoUrl, normalUrl, roughnessUrl);

    Promise.all([load(albedoUrl), load(normalUrl), load(roughnessUrl)])
      .then(([albedo, normal, roughness]) => {
        albedo.colorSpace = THREE.SRGBColorSpace;
        [albedo, normal, roughness].forEach((t) => {
          t.wrapS = t.wrapT = THREE.RepeatWrapping;
          t.repeat.set(2, 2);
          t.anisotropy = 16;
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
        roughness={1.5}
        metalness={0.0}
        clearcoat={0.9}
        clearcoatRoughness={0.1}
        envMapIntensity={0.8}
      />
    </mesh>
  );
}