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
    <div className="w-full max-w-5xl mx-auto my-6 px-4">
      {/* Retro LED Dot Matrix Message Board Frame */}
      <div className="relative p-4 rounded-2xl bg-[#0e0c0a] border-2 border-[#3d2f25] shadow-[0_10px_25px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* LED Glow Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)] animate-pulse" />
          <span className="text-xs font-mono-tech text-[#d97706] uppercase tracking-wider font-bold">
            90S SHOP MEMORIES &amp; ANNOUNCEMENTS
          </span>
        </div>

        {/* Rotating Content */}
        <div className="flex-1 w-full text-center sm:text-left transition-all duration-300">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#2a1e16] text-[#f59e0b] border border-[#d97706]/30 uppercase">
              {activeMemory.tag}
            </span>
            <span className="text-xs font-typewriter text-[#a8988a]">
              • {activeMemory.speaker} ({activeMemory.year})
            </span>
          </div>
          <p className="text-sm font-handwritten text-[#f3e8dc] text-lg leading-tight">
            "{activeMemory.quote}"
          </p>
        </div>

        {/* Counter Indicator */}
        <div className="text-[10px] font-mono-tech text-[#8c7a6b] shrink-0">
          {currentIndex + 1} / {memories.length}
        </div>
      </div>
    </div>
  );
};
