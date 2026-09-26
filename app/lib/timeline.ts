import { ease, EaseName } from "./easing";

// ─── TYPES ──────────────────────────────────────────────────────────────
export type Keyframe<T> = {
  at: number;        // local progress within the section (0 → 1)
  value: T;
  ease?: EaseName;   // easing applied on the way TO this keyframe
};

export type Track<T> = Keyframe<T>[];

export type Section = {
  start: number;                    // global scroll (0 → 1)
  end: number;                      // global scroll (0 → 1)
  tracks: Record<string, Track<number>>;
};

// ─── TIMELINE ───────────────────────────────────────────────────────────
export const TIMELINE = {
  hero: {
    // Timeline duration: 0.00 → 0.35 (35% of viewport)
    start: 0.00,
    end: 0.35,
    tracks: {
      "bowl.y":        [
        { at: 0, value: 0.2, ease: "inOut" },
        { at: 1, value: 1.0, ease: "inOut" },
      ],
      "bowl.rotation": [
        { at: 0, value: 0,   ease: "linear" },
        { at: 1, value: 360, ease: "linear" },
      ],
    },
  },

  subtitle: {
    start: 0.35,
    end: 2.00,
    tracks: {
      "bowl.y":        [
        { at: 0, value: 1.0, ease: "inOut" },
        { at: 1, value: 1.0, ease: "inOut" },
      ],
      "bowl.rotation": [
        { at: 0, value: 360, ease: "linear" },
        { at: 1, value: 720, ease: "linear" },
      ],
      "text.opacity":  [
        { at: 0.00, value: 0, ease: "out" },
        { at: 0.25, value: 1, ease: "linear" },
        { at: 0.75, value: 1, ease: "in" },
        { at: 1.00, value: 0, ease: "in" },
      ],
    },
  },

  showcase: {
    start: 2.00,
    end: 3.00,
    tracks: {
      "bowl.y":        [
        { at: 0, value: 1.0, ease: "inOut" },
        { at: 1, value: 1.0, ease: "inOut" },
      ],
      "bowl.rotation": [
        { at: 0, value: 720, ease: "linear" },
        { at: 1, value: 1080, ease: "linear" },
      ],
    },
  },

} satisfies Record<string, Section>;

export type SectionName = keyof typeof TIMELINE;