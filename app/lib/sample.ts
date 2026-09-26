import { TIMELINE, SectionName, Section, Track, Keyframe } from "./timeline";
import { ease } from "./easing";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Local 0→1 progress within a section. */
export function sectionProgress(
  scroll: number,
  section: Section
): number {
  return clamp01((scroll - section.start) / (section.end - section.start));
}

/** Interpolate a track at the given local progress. */
function sampleTrack(track: Track<number>, local: number): number {
  // Before first keyframe
  if (local <= track[0].at) return track[0].value;

  // After last keyframe
  const last = track[track.length - 1];
  if (local >= last.at) return last.value;

  // Find surrounding keyframes and interpolate
  for (let i = 0; i < track.length - 1; i++) {
    const a: Keyframe<number> = track[i];
    const b: Keyframe<number> = track[i + 1];
    if (local >= a.at && local <= b.at) {
      const span = b.at - a.at || 1;
      const raw = (local - a.at) / span;
      const eased = ease[b.ease ?? "linear"](raw);
      return a.value + (b.value - a.value) * eased;
    }
  }
  return last.value;
}

/** Read any track by name from a named section. */
export function readTrack(
  scroll: number,
  sectionName: SectionName,
  trackName: string
): number | undefined {
  const section = TIMELINE[sectionName] as Section;
  const track = section.tracks[trackName];
  if (!track) return undefined;
  const local = sectionProgress(scroll, section);
  return sampleTrack(track, local);
}

/** Read the same track name across all sections (first match wins). */
export function readAnywhere(
  scroll: number,
  trackName: string
): number | undefined {
  for (const name of Object.keys(TIMELINE) as SectionName[]) {
    const v = readTrack(scroll, name, trackName);
    if (v !== undefined) return v;
  }
  return undefined;
}