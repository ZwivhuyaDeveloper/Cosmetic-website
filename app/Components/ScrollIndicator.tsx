"use client";

interface ScrollIndicatorProps {
  visible: boolean;
}

export default function ScrollIndicator({ visible }: ScrollIndicatorProps) {
  return (
    <div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="w-5 h-5 border-2 border-[#f5e6d3]/50 rounded-full flex items-center justify-center">
        <div className="w-1 h-1 bg-[#f5e6d3] rounded-full animate-bounce" />
      </div>
      <span className="text-[10px] tracking-[0.3em] text-[#f5e6d3]/50 uppercase">
        Scroll to continue
      </span>
    </div>
  );
}