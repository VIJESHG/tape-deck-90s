import React from 'react';
import { Heart, Smile } from 'lucide-react';

export const DeskStickyNotesBar: React.FC = () => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-3 px-1">
      {/* Sticky Note 1: Life has another soundtrack */}
      <div className="relative w-full sm:w-auto flex-1 max-w-md p-2 sm:p-2.5 rounded-xs bg-[#fef9c3] text-[#1f150d] shadow-md rotate-[-1deg] border border-[#fde047] flex items-center justify-between gap-2 transform transition-transform hover:rotate-0 hover:scale-[1.01] z-10">
        {/* Transparent Adhesive Tape Strip at Top */}
        <div className="absolute -top-2 left-6 w-10 h-3.5 bg-[#fef08a]/80 border border-[#eab308]/40 rotate-[-2deg] shadow-2xs backdrop-blur-2xs" />

        <div className="font-handwritten text-sm sm:text-base font-bold text-[#1a0e05] leading-tight flex items-center gap-1.5 truncate">
          <span>"Life has another soundtrack."</span>
          <Heart className="w-3.5 h-3.5 fill-red-500 text-red-600 inline shrink-0" />
        </div>

        <span className="text-[9px] font-mono-tech text-[#854d0e] font-bold uppercase tracking-wider shrink-0 bg-[#fef08a] px-1.5 py-0.5 rounded border border-[#eab308]/50">
          90s Nostalgia
        </span>
      </div>

      {/* Sticky Note 2: Good times, old songs, best memories */}
      <div className="relative w-full sm:w-auto flex-1 max-w-md p-2 sm:p-2.5 rounded-xs bg-[#fef08a] text-[#1c130b] shadow-md rotate-[1deg] border border-[#eab308] flex items-center justify-between gap-2 transform transition-transform hover:rotate-0 hover:scale-[1.01] z-10">
        {/* Transparent Adhesive Tape Strip at Top */}
        <div className="absolute -top-2 right-6 w-10 h-3.5 bg-[#fef9c3]/80 border border-[#fde047]/50 rotate-[3deg] shadow-2xs" />

        <div className="font-handwritten text-sm sm:text-base font-bold text-[#1a0e05] leading-tight flex items-center gap-1.5 truncate">
          <span>"Good times, old songs, best memories."</span>
          <Smile className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        </div>

        <span className="text-[9px] font-mono-tech text-[#9a3412] font-bold uppercase tracking-wider shrink-0 bg-[#fde047] px-1.5 py-0.5 rounded border border-[#d97706]/40">
          Mixtape Shop
        </span>
      </div>
    </div>
  );
};
