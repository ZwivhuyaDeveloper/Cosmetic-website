"use client";

import { useMemo } from "react";
import * as THREE from "three";

export default function Table() {
  const matTexture = useMemo(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Base green cutting mat color
    ctx.fillStyle = "#2d4a3e";
    ctx.fillRect(0, 0, size, size);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    const step = size / 20;
    for (let i = 0; i <= 20; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(size, i * step);
      ctx.stroke();
    }

    // Ruler numbers (simplified)
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "18px monospace";
    for (let i = 0; i <= 20; i += 2) {
      ctx.fillText(String(i * 10), i * step + 4, size - 8);
      ctx.fillText(String(i * 10), 4, i * step - 8);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    tex.anisotropy = 16;
    return tex;
  }, []);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        map={matTexture}
        roughness={0.85}
        metalness={0.05}
      />
    </mesh>
  );
}