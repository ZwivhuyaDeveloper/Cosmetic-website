"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useScrollStore } from "../lib/useScrollStore";
import { readTrack } from "../lib/sample";

export default function SubtitleOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(
        ".subtitle-left, .subtitle-right, .subtitle-footnote",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power2.out" }
      );
      tlRef.current = tl;
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const unsub = useScrollStore.subscribe((state) => {
      const tl = tlRef.current;
      if (!tl) return;
      // Read the raw opacity track from the subtitle section
      const targetOpacity =
        readTrack(state.scrollProgress, "subtitle", "text.opacity") ?? 0;
      // Map opacity (0→1) to timeline progress (0→1)
      tl.progress(targetOpacity);
    });
    return () => unsub();
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-20 flex items-center justify-between px-[8%]"
    >
      <h2 className="subtitle-left max-w-[40%] text-[72px] font-black leading-none tracking-tight text-[#f5e6d3] opacity-0">
        ISN&apos;T JUST
        <br />
        A COASTER.
      </h2>
      <p className="subtitle-right max-w-[320px] text-[22px] leading-snug text-[#f5e6d3] opacity-0">
        Lumiere isn&apos;t just a make up.
      </p>
      <span className="subtitle-footnote absolute bottom-8 right-8 text-right text-[11px] tracking-widest text-[#f5e6d3]/70 opacity-0">
        LOOK
        <br />
        BEAUTIFUL
      </span>
    </div>
  );
}