"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useScrollStore } from "../lib/useScrollStore";

gsap.registerPlugin(useGSAP);

const LINKS = [
  { href: "#intro",    label: "Intro" },
  { href: "#features", label: "Features" },
  { href: "#product",  label: "Product" },
  { href: "#contact",  label: "Contact" },
];

export default function Header() {
  const root = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const isCompact = useScrollStore((s) => s.scrollProgress > 0.55);

  // ── Intro ─────────────────────────────────────────────────────
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-header-brand]", { autoAlpha: 0, y: -16, duration: 0.9 })
        .from(
          "[data-header-link]",
          { autoAlpha: 0, y: -10, stagger: 0.07, duration: 0.6 },
          "-=0.6"
        );
    },
    { scope: root }
  );

  // ── Morph into compact variation ──────────────────────────────
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const ctx = gsap.context(() => {
      gsap.to(shell, {
        paddingTop:        isCompact ? 10 : 24,
        paddingBottom:     isCompact ? 10 : 24,
        backgroundColor:   isCompact ? "rgba(12,10,9,0.55)" : "rgba(12,10,9,0)",
        backdropFilter:    isCompact ? "blur(24px)"         : "blur(0px)",
        borderBottomColor: isCompact ? "rgba(245,230,211,0.12)" : "rgba(245,230,211,0)",
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.to("[data-header-brand]", {
        scale: isCompact ? 0.82 : 1,
        transformOrigin: "left center",
        duration: 0.6,
        ease: "power3.out",
      });
    }, root);

    return () => ctx.revert();
  }, [isCompact]);

  return (
    <header
      ref={root}
      className="pointer-events-none fixed top-0 left-0 right-0 z-50"
    >
      <div
        ref={shellRef}
        className="pointer-events-auto flex items-center justify-between px-8 border-b"
        style={{
          paddingTop: 24,
          paddingBottom: 24,
          borderBottomColor: "rgba(245,230,211,0)",
          backgroundColor: "rgba(12,10,9,0)",
          backdropFilter: "blur(0px)",
        }}
      >
        {/* Logo — left */}
        <div
          data-header-brand
          className="text-[#f5e6d3] text-lg font-bold tracking-widest"
        >
          LUMIERE
        </div>

        {/* Links — right */}
        <nav className="flex gap-8 text-xs tracking-[0.2em] text-[#f5e6d3]/70 uppercase">
          {LINKS.map(({ href, label }) => (
            <a
              key={href}
              data-header-link
              href={href}
              className="group relative inline-block py-1 transition-colors duration-300 hover:text-[#f5e6d3]"
            >
              {label}
              <span
                aria-hidden
                className="
                  pointer-events-none absolute left-0 -bottom-0.5 h-px w-full
                  origin-left scale-x-0 bg-[#f5e6d3]
                  transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]
                  group-hover:scale-x-100
                "
              />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}