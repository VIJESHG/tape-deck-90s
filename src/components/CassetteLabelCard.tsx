import React from 'react';
import { Disc, Play } from 'lucide-react';
import { CassetteTape } from '../types';

interface CassetteLabelCardProps {
  tape: CassetteTape;
  isSelected?: boolean;
  deckNumber?: 1 | 2;
  currentSide?: 'A' | 'B';
  onClick?: () => void;
  className?: string;
}

export const CassetteLabelCard: React.FC<CassetteLabelCardProps> = ({
  tape,
  isSelected = false,
  deckNumber = 1,
  currentSide = 'A',
  onClick,
  className = ''
}) => {
  const totalTracks = tape.sideA.length + tape.sideB.length;
  const isCustom = tape.isCustom || tape.genre === 'Custom Mixtapes';

  return (
    <div
      onClick={onClick}
      className={`relative w-full rounded-xl bg-[#1c1e22] border-2 border-[#2d3036] p-2.5 sm:p-3.5 shadow-2xl overflow-hidden select-none cursor-pointer transition-all ${
        isSelected
          ? 'ring-2 ring-[#d97706] shadow-[0_0_20px_rgba(217,119,6,0.35)]'
          : 'hover:border-[#4a4e58] hover:shadow-xl'
      } ${className}`}
    >
      {/* Molded Corner Screw Sockets */}
      <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-[#111214] border border-[#383c44] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#4a4e58] rotate-45" />
      </div>
      <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#111214] border border-[#383c44] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#4a4e58] -rotate-45" />
      </div>
      <div className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full bg-[#111214] border border-[#383c44] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#4a4e58] rotate-12" />
      </div>
      <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-[#111214] border border-[#383c44] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#4a4e58] -rotate-30" />
      </div>

      {/* TOP HEADER BAR */}
      <div className="flex items-center justify-between mb-2 px-1 z-10 relative">
        {/* Top Left Badge: [ SIDE A ] BRAND */}
        <div className="flex items-center gap-1.5 bg-[#120e0a] border border-[#d97706] px-2 py-0.5 rounded-md shadow-inner text-amber-400 font-mono-tech font-extrabold text-[9px] sm:text-[10px] tracking-wider uppercase">
          <span className="text-[#f59e0b] font-black">[ SIDE {currentSide} ]</span>
          <span className="text-amber-200/90 truncate max-w-[140px] sm:max-w-[200px]">
            {tape.brand || 'SUPER CASSETTES'}
          </span>
        </div>

        {/* Top Right Price Tag Sticker */}
        <div className="px-2 py-0.5 rounded bg-[#fff8f5] border-2 border-[#e11d48] text-[#be123c] font-mono-tech font-black text-[10px] sm:text-[11px] tracking-tight shadow-md rotate-[2deg]">
          {tape.price || '₹40.00'}
        </div>
      </div>

      {/* MAIN CREAM PAPER LABEL AREA */}
      <div className="relative rounded-lg bg-[#f9f6ee] border border-[#d6cebe] p-2.5 sm:p-3 shadow-inner overflow-hidden min-h-[110px] flex flex-col justify-between">
        
        {/* Right Wing Genre Specific Retro Badges */}
        {tape.genre === 'Bollywood Gold' || tape.brand?.includes('T-Series') ? (
          /* T-Series Yellow/Orange Gradient Diagonal Right Wing */
          <div className="absolute top-0 right-0 bottom-0 w-20 sm:w-24 bg-gradient-to-b from-[#eab308] via-[#f97316] to-[#d97706] border-l-2 border-[#b45309] p-1 flex flex-col items-center justify-between text-black font-mono-tech select-none z-0">
            <span className="font-extrabold text-[12px] sm:text-[14px] leading-tight">C-60</span>
            <div className="text-[6.5px] sm:text-[7.5px] font-bold uppercase text-center leading-tight">
              NORMAL<br/>POSITION<br/>120µs EQ
            </div>
            <div className="w-6 h-6 rounded bg-black text-amber-400 font-black text-[10px] flex items-center justify-center border border-amber-300 shadow-sm">
              (T)
            </div>
          </div>
        ) : tape.genre === 'Western Hits' ? (
          /* Western Hits Colored Stacked Stripes Wing */
          <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-20 bg-[#1c1917] text-white p-1 flex flex-col items-center justify-between border-l border-stone-600 z-0">
            <span className="font-extrabold text-sky-400 text-[11px]">C-60</span>
            <div className="text-[6.5px] text-stone-300 font-mono-tech uppercase text-center">
              NORMAL BIAS<br/>120µs EQ
            </div>
            <div className="w-full h-3 flex flex-col">
              <div className="h-1 bg-amber-400" />
              <div className="h-1 bg-orange-500" />
              <div className="h-1 bg-sky-500" />
            </div>
          </div>
        ) : tape.genre === 'Indipop' ? (
          /* Indipop Blue Right Top Corner Badge */
          <div className="absolute top-0 right-0 bg-[#0284c7] text-white px-3 py-1 rounded-bl-lg font-mono-tech font-black text-[11px] shadow-sm z-0">
            C-60
          </div>
        ) : tape.genre === 'Ghazals & Unplugged' ? (
          /* Ghazal Olive Green Angled Right Badge */
          <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-20 bg-[#15803d] text-emerald-100 p-1 flex flex-col items-center justify-between border-l border-emerald-900 z-0">
            <span className="font-extrabold text-[12px]">C-60</span>
            <div className="text-[6.5px] font-mono-tech uppercase text-center">
              HIGH BIAS<br/>70µs EQ
            </div>
            <div className="text-[8px] font-bold border border-emerald-300 px-1 rounded">
              GHAZAL
            </div>
          </div>
        ) : isCustom ? (
          /* Custom Mixtape Index Card Boxed Design */
          <div className="absolute top-1 right-2 w-10 h-10 border border-stone-400 rounded flex flex-col items-center justify-center bg-white/80 font-handwritten text-lg font-bold text-stone-900 z-0">
            <span>A</span>
          </div>
        ) : null}

        {/* Paper Header Line: Type & Track Count */}
        <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono-tech font-extrabold text-stone-600 border-b border-stone-300/80 pb-0.5 mb-1 z-10 pr-16 sm:pr-20">
          <span className="text-[#b45309] uppercase">
            TYPE {tape.genre === 'Ghazals & Unplugged' ? 'II' : 'I'} • C-60
          </span>
          <span className="uppercase">{totalTracks} TRACKS</span>
        </div>

        {/* Central Handwritten Title & Subtitle */}
        <div className="my-0.5 pr-16 sm:pr-20 z-10">
          <h4 className="font-handwritten text-base sm:text-lg font-extrabold text-[#1a1007] leading-tight truncate">
            {tape.title}
          </h4>
          <p className="font-handwritten text-[11.5px] sm:text-xs text-[#1e3a8a] italic font-bold truncate mt-0.5">
            {tape.artist}
          </p>
        </div>

        {/* Classic Dotted Underline Divider */}
        <div className="w-full border-b-2 border-dotted border-stone-400/80 my-1 z-10" />

        {/* BOTTOM STATUS ROW */}
        <div className="flex items-center justify-between z-10 pt-0.5">
          {/* Loaded Status Pill */}
          {isSelected ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#d97706] text-black font-mono-tech font-black text-[9.5px] sm:text-[10px] uppercase shadow-md animate-pulse">
              <Disc className="w-3 h-3 animate-spin [animation-duration:2.5s]" />
              <span>LOADED IN DECK {deckNumber}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#221c16] text-[#d4c1a5] hover:text-amber-300 border border-[#3d2f25] font-mono-tech font-extrabold text-[9px] sm:text-[9.5px] uppercase shadow-sm transition-colors">
              <Play className="w-2.5 h-2.5 fill-current text-amber-500" />
              <span>LOAD CASSETTE</span>
            </div>
          )}

          {/* Release Year Badge */}
          <div className="px-2 py-0.5 rounded bg-[#1f1a14] border border-[#382b20] text-[#c29873] font-mono-tech font-extrabold text-[9px] sm:text-[10px] uppercase">
            {tape.releaseYear || 1994}
          </div>
        </div>
      </div>
    </div>
  );
};
