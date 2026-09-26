// lib/sections.ts
export const SECTIONS = {
  hero:     { start: 0.00, end: 0.35 },  // bowl lifts & rotates
  overlay:  { start: 0.35, end: 0.60 },  // table fades, dark wash
  subtitle: { start: 0.55, end: 0.85 },  // text appears
  outro:    { start: 0.85, end: 1.00 },  // reset for next section
  drop:     { start: 0.90, end: 1.00 },  // object drop
} as const;


export type SectionName = keyof typeof SECTIONS;

/** Returns a local 0→1 value within a section range. */
export function phase(
  scroll: number,
  { start, end }: { start: number; end: number }
): number {
  return Math.max(0, Math.min(1, (scroll - start) / (end - start)));
}