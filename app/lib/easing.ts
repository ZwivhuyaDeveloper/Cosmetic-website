// lib/easing.ts

import gsap from "gsap";

// GSAP eases available by name — full list at https://gsap.com/docs/v3/Eases
export type EaseName =
  | "none"           // linear
  | "power1.in"      | "power1.out"      | "power1.inOut"
  | "power2.in"      | "power2.out"      | "power2.inOut"
  | "power3.in"      | "power3.out"      | "power3.inOut"
  | "power4.in"      | "power4.out"      | "power4.inOut"
  | "sine.in"        | "sine.out"        | "sine.inOut"
  | "expo.in"        | "expo.out"        | "expo.inOut"
  | "circ.in"        | "circ.out"        | "circ.inOut"
  | "back.in"        | "back.out"        | "back.inOut"
  | "elastic.in"     | "elastic.out"     | "elastic.inOut"
  | "bounce.in"      | "bounce.out"      | "bounce.inOut";

// Cache parsed eases so we don't re-parse every frame
const cache = new Map<string, (t: number) => number>();

export function getEase(name: EaseName = "none"): (t: number) => number {
  let fn = cache.get(name);
  if (!fn) {
    fn = gsap.parseEase(name);
    cache.set(name, fn);
  }
  return fn;
}


