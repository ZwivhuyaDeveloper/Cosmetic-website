"use client";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div className="text-[#f5e6d3] text-lg font-bold tracking-widest">
        LUMIERE
      </div>
      <nav className="flex gap-8 text-xs tracking-[0.2em] text-[#f5e6d3]/70 uppercase">
        <a href="#intro" className="hover:text-[#f5e6d3] transition-colors">
          Intro
        </a>
        <a href="#features" className="hover:text-[#f5e6d3] transition-colors">
          Features
        </a>
        <a href="#product" className="hover:text-[#f5e6d3] transition-colors">
          Product
        </a>
        <a href="#contact" className="hover:text-[#f5e6d3] transition-colors">
          Contact
        </a>
      </nav>
    </header>
  );
}