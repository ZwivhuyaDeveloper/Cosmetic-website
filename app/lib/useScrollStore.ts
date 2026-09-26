import { create } from "zustand";

interface ScrollState {
  scrollProgress: number;
  setScrollProgress: (v: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (v) => set({ scrollProgress: v }),
}));