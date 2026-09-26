import React, { useRef } from 'react'
import Header from './Header';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
            <div className="relative z-10 pointer-events-none h-full">
                <Header />
                <div className="absolute top-1/2 left-[8%] -translate-y-1/2">
                    <h1 className="text-[120px] font-black leading-none text-[#f5e6d3] tracking-tighter">
                    LUMIERE
                    </h1>
                    <p className="mt-4 text-sm font-medium tracking-[0.3em] text-[#f5e6d3]/70 uppercase">
                    Enhance your look with light.
                    </p>
                </div>
            </div>
        </section>
    )
}
