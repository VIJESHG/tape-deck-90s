import React, { useState, useEffect } from 'react';
import { Volume2, MessageSquare, Sparkles } from 'lucide-react';
import { ShopMemory } from '../types';

interface RotatingTickerProps {
  memories: ShopMemory[];
}

export const RotatingTicker: React.FC<RotatingTickerProps> = ({ memories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (memories.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % memories.length);
    }, 5000); // Rotates every 5 seconds

    return () => clearInterval(interval);
  }, [memories.length]);

  const activeMemory = memories[currentIndex] || memories[0];

  return (
    <div className="w-full max-w-5xl mx-auto my-4 px-4">
      {/* Retro Recessed LED Dot Matrix Strip */}
      <div className="relative py-2.5 px-4 rounded-xl bg-[#080604] border border-[#261d15] shadow-inner overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3 text-[#bfaea0]">
        
        {/* LED Glow Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[10px] font-mono-tech text-[#d97706] uppercase tracking-widest font-bold">
            SHOP ANNOUNCEMENTS:
          </span>
        </div>

        {/* Rotating Content */}
        <div className="flex-1 w-full text-center sm:text-left transition-all duration-300 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs">
            <span className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded bg-[#1c140d] text-[#d97706] border border-[#3d2e23] uppercase shrink-0 font-bold">
              {activeMemory.tag}
            </span>
            <span className="text-[11px] font-typewriter text-[#8c7a6b] shrink-0 font-bold">
              {activeMemory.speaker} ({activeMemory.year}):
            </span>
            <p className="text-xs font-handwritten text-[#e2d5c8] truncate italic">
              "{activeMemory.quote}"
            </p>
          </div>
        </div>

        {/* Counter Indicator */}
        <div className="text-[9px] font-mono-tech text-[#66564a] shrink-0 font-bold">
          {currentIndex + 1}/{memories.length}
        </div>
      </div>
    </div>
  );
};
