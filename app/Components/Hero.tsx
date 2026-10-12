"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Header from "./Header";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ── Initial states (GSAP owns transform from here on) ──────
      gsap.set("[data-reveal='dot']",     { autoAlpha: 0, y: -12 });
      gsap.set("[data-reveal='title']",   { autoAlpha: 0, x: -60 });
      gsap.set("[data-reveal='tagline']", { autoAlpha: 0, y: -12 });
      gsap.set("[data-reveal='body']",    { autoAlpha: 0, y: 24 });
      gsap.set("[data-reveal='card']",    { autoAlpha: 0, y: 40 });
      gsap.set("[data-reveal='edge']",    { autoAlpha: 0, x: 20, yPercent: -50 });

      // ── Mount stagger ─────────────────────────────────────────
      const tl = gsap.timeline({
        defaults: { duration: 1, ease: "power3.out" },
      });

      tl.to("[data-reveal='dot']",     { autoAlpha: 1, y: 0 })
        .to("[data-reveal='tagline']", { autoAlpha: 1, y: 0 }, "-=0.85")
        .to("[data-reveal='title']",   { autoAlpha: 1, x: 0 }, "-=0.8")
        .to("[data-reveal='body']",    { autoAlpha: 1, y: 0 }, "-=0.75")
        .to("[data-reveal='card']",    { autoAlpha: 1, y: 0 }, "-=0.75")
        .to("[data-reveal='edge']",    { autoAlpha: 1, x: 0 }, "-=0.8");

      // ── Ambient loops (start after mount stagger settles) ─────
      tl.add(() => {
        gsap.to("[data-reveal='dot']", {
          keyframes: [
            { opacity: 0.3, scale: 0.7, y: -6, duration: 1.1, ease: "sine.inOut" },
            { opacity: 1,   scale: 1,   y: 0,  duration: 1.1, ease: "sine.inOut" },
          ],
          repeat: -1,
        });

        gsap.to("[data-dash]", {
          backgroundPositionX: "40px",
          duration: 3.5,
          ease: "none",
          repeat: -1,
        });

        gsap.to("[data-reveal='edge']", {
          opacity: 0.45,
          duration: 2.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative h-screen w-full overflow-hidden">
      <div className="relative pointer-events-none h-full">

        <div className="w-full h-full grid grid-rows-2">
            {/* 3. Headline */}
            <h1
            data-reveal="title"
            className="absolute top-[21%] left-[7%] text-[clamp(96px,16vw,130px)] font-black leading-[0.82] text-[#f5e6d3] tracking-tighter drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
            >
            LUMIERE
            </h1>

            {/* 2. Tagline */}
            <p
            data-reveal="tagline"
            className="absolute top-[18%] left-[8%] text-[11px] font-semibold tracking-[0.45em] text-[#f5e6d3]/75 uppercase"
            >
            Enhance your look with light.
            </p>
        </div>

        {/* 4. Body copy */}
        <p
          data-reveal="body"
          className="absolute top-[40%] right-[8%] max-w-[480px] text-[26px] leading-[1.4] font-light text-[#f5e6d3]/90 "
        >
          "Designed to enhance, illuminate, and define.
          Lumiere makes the simplest moment feel considered."
        </p>

        {/* 5. Info card */}
        <div
        data-reveal="card"
        className="
            absolute bottom-[7%] left-[8%] w-[340px] p-6 rounded-2xl border border-white/15
            bg-gradient-to-br from-white/[0.14] via-white/[0.07] to-white/[0.02] backdrop-blur-2xl backdrop-saturate-150
            shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.06)]
            ring-1 ring-inset ring-white/5 overflow-hidden
        "
        >
        {/* top sheen — diagonal highlight that sells the "glass pane" */}
        <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-px h-px
                    bg-gradient-to-r from-transparent via-white/60 to-transparent"
        />
        <div
            aria-hidden
            className="pointer-events-none absolute -top-1/2 -left-1/4 h-[200%] w-[150%]
                    rotate-[20deg]
                    bg-gradient-to-b from-white/[0.10] via-transparent to-transparent
                    blur-2xl"
        />

        <h3 className="relative text-[#f5e6d3] font-bold text-[13px] tracking-[0.15em] leading-[1.5] uppercase">
            Designed by Lumiere,
            <br />
            the award-winning
            <br />
            beauty studio.
        </h3>

        <div
            data-dash
            className="relative my-5 h-px w-full"
            style={{
            backgroundImage:
                "linear-gradient(to right, rgba(245,230,211,0.45) 50%, transparent 50%)",
            backgroundSize: "8px 1px",
            backgroundRepeat: "repeat-x",
            }}
        />

        <p className="relative text-[#f5e6d3]/70 text-[11px] tracking-wider text-right leading-[1.8]">
            The world's most
            <br />
            unnecessarily
            <br />
            sophisticated lipstick.
        </p>
        </div>

        {/* 6. Vertical edge text — no Tailwind transforms here */}
        <p
          data-reveal="edge"
          className="absolute top-1/2 right-5 text-[10px] tracking-[0.5em] text-[#f5e6d3]/55 uppercase"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Lumiere — 01 Edition
        </p>
      </div>
    </section>
  );
}