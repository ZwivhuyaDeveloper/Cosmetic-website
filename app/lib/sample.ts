import { TRACKS, Track, Keyframe } from "./timeline";
import { getEase } from "./easing";

export function readTrack(scroll: number, trackName: string): number | undefined {
  const track = TRACKS[trackName as keyof typeof TRACKS] as Track | undefined;
  if (!track || track.length === 0) return undefined;

  if (scroll <= track[0].scroll) return track[0].value;
  const last = track[track.length - 1];
  if (scroll >= last.scroll) return last.value;

  for (let i = 0; i < track.length - 1; i++) {
    const a: Keyframe = track[i];
    const b: Keyframe = track[i + 1];
    if (scroll >= a.scroll && scroll <= b.scroll) {
      const span = b.scroll - a.scroll || 1;
      const raw = (scroll - a.scroll) / span;
      const eased = getEase(b.ease ?? "none")(raw);   // ← GSAP easing
      return a.value + (b.value - a.value) * eased;
    }
  }
  return last.value;
}