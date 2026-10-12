"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useScrollStore } from "../lib/useScrollStore";
import { readTrack } from "../lib/sample";

export default function SecondSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true });
            tl.fromTo(
                ".second-section",
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
                readTrack(state.scrollProgress, "section.text.opacity") ?? 0;

            // Map opacity (0→1) to timeline progress (0→1)
            tl.progress(targetOpacity);
        });
        return () => unsub();
    }, []);

  return (
    <div ref={containerRef}
    className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-[8%]">

      <h2 className="second-section text-center text-[72px] font-black leading-none tracking-tight text-[#f5e6d3] opacity-0 -top-50 ">
        Second Section
      </h2>
      
    </div>
  );
}