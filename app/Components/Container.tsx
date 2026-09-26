"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import Header from "./Header";
import ScrollIndicator from "./ScrollIndicator";
import { useScrollStore } from "../lib/useScrollStore";
import Scene from "./Scene";
import SubtitleOverlay from "./SubtitleOverlay";
import Hero from "./Hero";

export default function Container() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useScrollStore((s) => s.scrollProgress); // only for the indicator

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / maxScroll, 1);
      useScrollStore.getState().setScrollProgress(progress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
      <div className="fixed inset-0 z-0">
        {/* no more prop drilling */}
        <Scene />
      </div>
      
      <div className="relative z-10 pointer-events-none h-full">
        <Hero />
        <ScrollIndicator visible={scrollProgress < 0.1} />
      </div>

      {/* no more prop drilling */}
      <SubtitleOverlay />
    </section>
  );
}