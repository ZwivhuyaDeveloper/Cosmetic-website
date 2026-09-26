// lib/useSection.ts
import { SectionName, SECTIONS } from "./sections";
import { useScrollStore } from "./useScrollStore";


export function useSection<T = number>(
  name: SectionName,
  mapper: (local: number) => T
): T {
  const scroll = useScrollStore((s) => s.scrollProgress);
  const { start, end } = SECTIONS[name];
  const local = Math.max(0, Math.min(1, (scroll - start) / (end - start)));
  return mapper(local);
}