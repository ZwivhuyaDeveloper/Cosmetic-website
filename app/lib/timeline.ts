import { EaseName } from "./easing";

export type Keyframe = {
  scroll: number;   // global 0 → 1
  value: number;
  ease?: EaseName;  // easing applied from the PREVIOUS keyframe to this one
};

export type Track = Keyframe[];

export const TRACKS = {
  "bowl.y": [
    { scroll: 0.00, value: 0.1, ease: "none" },  // start on table
    { scroll: 0.05, value: 1.0, ease: "sine.out" },  // lifted during hero
    { scroll: 0.50, value: 1.0, ease: "sine.in" },
    { scroll: 0.70, value: 0.1, ease: "sine.out" },     // reset to initial Y
  ],
    "bowl.rotation.x": [
    { scroll: 0.00, value: 0,   ease: "none" },
    { scroll: 0.50, value: 360, ease: "circ.in" },
    ],
    "bowl.rotation.y": [
    { scroll: 0.00, value: 0,   ease: "none" },
    { scroll: 0.50, value: 720, ease: "none" },
    ],
    "bowl.rotation.z": [
    { scroll: 0.00, value: 0,   ease: "none" },
    { scroll: 0.50, value: 360, ease: "circ.in" },
    ],
  "text.opacity": [
    { scroll: 0.30, value: 0, ease: "power1.in" },
    { scroll: 0.40, value: 1, ease: "power1.out" },
    { scroll: 0.50, value: 0, ease: "power1.in" },
  ],
  "overlay.opacity": [
    { scroll: 0.30, value: 0, ease: "power1.in" },
    { scroll: 0.50, value: 1, ease: "power1.out" },
    { scroll: 1.00, value: 1, ease: "power1.in" },
  ],
} satisfies Record<string, Track>;

export const SECTIONS = {
  hero:     { start: 0.00, end: 0.30 },  // bowl lifts & rotates 0° → 360°
  subtitle: { start: 0.30, end: 0.50 },  // text appears, rotation 360° → 720°
  reset:    { start: 0.50, end: 0.60 },  // bowl descends back to initial Y
  drop:     { start: 0.60, end: 0.70 },  // bowl drops to final position
} as const;

export type SectionName = keyof typeof SECTIONS;