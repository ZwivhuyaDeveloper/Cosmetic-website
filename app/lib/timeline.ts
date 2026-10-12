import { EaseName } from "./easing";

export type Keyframe = {
  scroll: number;   // global 0 → 1
  value: number;
  ease?: EaseName;  // easing applied from the PREVIOUS keyframe to this one
};

export type Track = Keyframe[];

export const TRACKS = {
  // ── Lipstick body ────────────────────────────────────────────────
  "lipstick.y": [
    { scroll: 0.00, value: 0.0, ease: "none" },      // start on table
    { scroll: 0.10, value: 1.5, ease: "sine.out" },  // lifted during hero
    { scroll: 0.50, value: 1.5, ease: "none" },      // hold through subtitle
    { scroll: 0.60, value: 0.0, ease: "sine.in" },   // reset: descends to rest
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

  // ── Hero / subtitle copy ─────────────────────────────────────────
  "text.opacity": [
    { scroll: 0.30, value: 0, ease: "sine.in" },
    { scroll: 0.40, value: 1, ease: "sine.out" },
    { scroll: 0.70, value: 0, ease: "sine.in" },
  ],

  // ── Second-section copy (fits inside SECTIONS.secondSection) ─────
  "section.text.opacity": [
    { scroll: 0.72, value: 0, ease: "sine.in" },   // fade in after section starts
    { scroll: 0.80, value: 1, ease: "sine.out" },  // hold at full opacity
    { scroll: 0.88, value: 0, ease: "sine.in" },   // fade out before section ends
  ],

  // ── Cap / stick (aligned to SECTIONS.drop) ───────────────────────
  "cap.y": [
    { scroll: 0.45, value: 2.0, ease: "none" },
    { scroll: 0.70, value: 6.0, ease: "power2.out" },
  ],

  "stick.rotation.z": [
    { scroll: 0.60, value: 0,   ease: "none" },
    { scroll: 0.70, value: 360, ease: "none" },
  ],

  // ── Global overlay ───────────────────────────────────────────────
  "overlay.opacity": [
    { scroll: 0.10, value: 0, ease: "power1.in" },
    { scroll: 0.40, value: 1, ease: "power1.out" },
    { scroll: 1.00, value: 1, ease: "power1.in" },
  ],
} satisfies Record<string, Track>;

export const SECTIONS = {
  hero:          { start: 0.00, end: 0.30 },  // lipstick lifts off the table
  subtitle:      { start: 0.30, end: 0.50 },  // headline fades in, spin continues
  reset:         { start: 0.50, end: 0.60 },  // lipstick descends back to rest
  drop:          { start: 0.60, end: 0.70 },  // cap / stick twist into final pose
  secondSection: { start: 0.70, end: 0.90 },  // second block of copy fades in
  hand:          { start: 0.90, end: 1.00 },  // hand enters frame
} as const;

export type SectionName = keyof typeof SECTIONS;