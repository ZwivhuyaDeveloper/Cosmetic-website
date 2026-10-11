import { EaseName } from "./easing";

export type Keyframe = {
  scroll: number;   // global 0 → 1
  value: number;
  ease?: EaseName;  // easing applied from the PREVIOUS keyframe to this one
};

export type Track = Keyframe[];

export const TRACKS = {
  "lipstick.y": [
    { scroll: 0.00, value: 0.0, ease: "none" },  // start on table
    { scroll: 0.10, value: 1.5, ease: "sine.out" },  // lifted during hero
    { scroll: 0.50, value: 1.5, ease: "sine.in" },    // reset to initial Y
    { scroll: 0.80, value: 0.0, ease: "none" },     // stay at initial Y
  ],
    "lipstick.rotation.x": [
    { scroll: 0.00, value: 0,   ease: "none" },
    { scroll: 0.50, value: 360, ease: "sine.out" },
    ],
    "lipstick.rotation.y": [
    { scroll: 0.00, value: 0,   ease: "none" },
    { scroll: 0.50, value: 720, ease: "none" },
    ],
    "lipstick.rotation.z": [
    { scroll: 0.00, value: 0,   ease: "none" },
    { scroll: 0.50, value: 360, ease: "none" },
    ],
  "text.opacity": [
    { scroll: 0.30, value: 0, ease: "power1.in" },
    { scroll: 0.40, value: 1, ease: "power1.out" },
    { scroll: 0.70, value: 0, ease: "power1.in" },
  ],
  "cube.z": [
    { scroll: 0.50, value: 3.0, ease: "none" },
    { scroll: 0.80, value: 1.0, ease: "sine.out" },
  ],
  "cap.y": [
    { scroll: 0.40, value: 2.0, ease: "none" },
    { scroll: 0.80, value: 8.0, ease: "power2.out" },
  ],
  "stick.rotation.z": [
    { scroll: 0.40, value: 0, ease: "none" },
    { scroll: 0.80, value: 360, ease: "none" },
  ],
  "overlay.opacity": [
    { scroll: 0.20, value: 0, ease: "power1.in" },
    { scroll: 0.50, value: 1, ease: "power1.out" },
    { scroll: 1.00, value: 1, ease: "power1.in" },
  ],
} satisfies Record<string, Track>;

export const SECTIONS = {
  hero:     { start: 0.00, end: 0.30 },  // lipstick lifts & rotates 0° → 360°
  subtitle: { start: 0.30, end: 0.50 },  // text appears, rotation 360° → 720°
  reset:    { start: 0.50, end: 0.60 },  // lipstick descends back to initial Y
  drop:     { start: 0.60, end: 0.70 },  // lipstick drops to final position
  hand:     { start: 0.70, end: 0.80 },  // hand appears
} as const;

export type SectionName = keyof typeof SECTIONS;