import React, { useState } from 'react';
import { CassetteTape, MusicGenre } from '../types';
import { audioEngine } from '../lib/audioEngine';
import { Plus, Radio, Disc, Heart, Star, Film, Music, Guitar, CassetteTape as CassetteIcon, Sparkles } from 'lucide-react';

interface CassetteWallFullViewProps {
  tapes: CassetteTape[];
  currentTapeId: string | null;
  onSelectTape: (tape: CassetteTape) => void;
  onOpenMixtapeMaker: () => void;
  onSelectStation?: (frequency: number) => void;
}

export const CassetteWallFullView: React.FC<CassetteWallFullViewProps> = ({
  tapes,
  currentTapeId,
  onSelectTape,
  onOpenMixtapeMaker
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Categories definition matching reference image exactly
  const categories = [
    { id: 'ALL', label: 'ALL TAPES', icon: null },
    { id: '90s Romance', label: 'ROMANCE', icon: Heart },
    { id: 'Indipop', label: 'INDIPOP', icon: Star },
    { id: 'Bollywood Gold', label: 'BOLLYWOOD', icon: Film },
    { id: 'Ghazals & Unplugged', label: 'GHAZALS', icon: Music },
    { id: 'Western Hits', label: 'WESTERN', icon: Guitar },
    { id: 'Custom Mixtapes', label: 'MIXTAPES', icon: CassetteIcon }
  ];

  // 6 Column Configuration matching image
  const columns = [
    {
      genre: '90s Romance',
      title: '90s ROMANCE ♡',
      spineColor: 'bg-[#b91c1c]', // Red
      cardBg: 'bg-[#fcf8f2]',
      border: 'border-[#fca5a5]',
      textColor: 'text-[#450a0a]',
      subtitleColor: 'text-[#991b1b]',
      tagBg: 'bg-red-100 text-red-900 border-red-300'
    },
    {
      genre: 'Indipop',
      title: 'INDIPOP HITS ☆',
      spineColor: 'bg-[#0284c7]', // Blue
      cardBg: 'bg-[#fefce8]',
      border: 'border-[#fde047]',
      textColor: 'text-[#0f172a]',
      subtitleColor: 'text-[#0369a1]',
      tagBg: 'bg-sky-100 text-sky-900 border-sky-300'
    },
    {
      genre: 'Bollywood Gold',
      title: 'BOLLYWOOD GOLD',
      spineColor: 'bg-[#d97706]', // Orange/Gold
      cardBg: 'bg-[#fef9c3]',
      border: 'border-[#facc15]',
      textColor: 'text-[#1c1917]',
      subtitleColor: 'text-[#854d0e]',
      tagBg: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      genre: 'Ghazals & Unplugged',
      title: 'GHAZALS & UNPLUGGED ♫',
      spineColor: 'bg-[#15803d]', // Green
      cardBg: 'bg-[#f4f7f4]',
      border: 'border-[#86efac]',
      textColor: 'text-[#052e16]',
      subtitleColor: 'text-[#166534]',
      tagBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    {
      genre: 'Western Hits',
      title: 'WESTERN HITS 🎸',
      spineColor: 'bg-[#18181b]', // Black/Dark
      cardBg: 'bg-[#27272a]',
      border: 'border-[#525252]',
      textColor: 'text-[#f4f4f5]',
      subtitleColor: 'text-[#a1a1aa]',
      tagBg: 'bg-zinc-700 text-zinc-100 border-zinc-500'
    },
    {
      genre: 'Custom Mixtapes',
      title: 'CUSTOM MIXTAPES 📻',
      spineColor: 'bg-[#78350f]', // Brown
      cardBg: 'bg-[#fffbeb]',
      border: 'border-[#fde68a]',
      textColor: 'text-[#1c1917]',
      subtitleColor: 'text-[#78350f]',
      tagBg: 'bg-amber-200 text-amber-950 border-amber-400'
    }
  ];

  const handleTapeClick = (tape: CassetteTape) => {
    audioEngine.playTapeSlide();
    setTimeout(() => {
      audioEngine.playDoorSnap();
    }, 150);
    onSelectTape(tape);
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-4 p-3 sm:p-6 rounded-2xl bg-[#f7f3e9] border-8 border-[#3d2a1d] shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-[#1f150d] font-sans relative overflow-hidden">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b-2 border-[#d9cdb8] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#2b1d14] border border-[#d97706] flex items-center justify-center text-amber-400 shadow-sm">
              <Disc className="w-5 h-5 animate-spin [animation-duration:10s]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-mono-tech text-[#1a0e05] tracking-tight uppercase">
              90s CASSETTE WALL
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono-tech font-bold text-[#6e5845] mt-1 tracking-wider uppercase">
            PICK A TAPE FROM THE RACK • INSERT INTO DECK • HIT PLAY!
          </p>
        </div>

        {/* Taped Paper Note Top Right */}
        <div className="relative p-3 rounded-xs bg-[#fef08a] border border-[#eab308] shadow-md rotate-[2deg] max-w-xs text-right hidden sm:block">
          <div className="absolute -top-2 left-4 w-10 h-3.5 bg-[#fef9c3]/80 border border-[#fde047]/60 rotate-[-4deg] shadow-2xs" />
          <p className="font-handwritten text-base sm:text-lg font-bold text-[#1a0e05] leading-tight">
            EVERY TAPE HAS A STORY ♡
          </p>
        </div>
      </div>

      {/* 2. GENRE FILTER PILLS BAR */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 my-2 border-b border-[#e2d5c1] no-scrollbar">
        {categories.map(cat => {
          const IconComp = cat.icon;
          const isActive = activeFilter === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                audioEngine.playSwitchClick();
                setActiveFilter(cat.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono-tech uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-[#1a0e05] text-[#fef08a] border-2 border-[#d97706] shadow-md scale-105'
                  : 'bg-[#ebd2b2] text-[#3d2a1d] hover:bg-[#deca17]/30 border border-[#c9b49b]'
              }`}
            >
              {IconComp && <IconComp className="w-3.5 h-3.5 text-amber-700" />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. MAIN WOODEN CASSETTE CABINET (6 COLUMNS) */}
      <div className="my-3 p-3 sm:p-4 rounded-xl bg-[#1c120a] border-4 border-[#3d2a1d] shadow-[inset_0_4px_25px_rgba(0,0,0,0.95)] relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
          {columns.map(col => {
            // Filter tapes for this column
            const columnTapes = tapes.filter(t => t.genre === col.genre);
            const isColumnDimmed = activeFilter !== 'ALL' && activeFilter !== col.genre;

            return (
              <div
                key={col.genre}
                className={`flex flex-col gap-2 transition-opacity duration-300 ${
                  isColumnDimmed ? 'opacity-30' : 'opacity-100'
                }`}
              >
                {/* Taped Column Paper Header */}
                <div className="relative p-1.5 rounded-xs bg-[#fef9c3] border border-[#fde047] shadow-sm text-center mb-1">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-[#fef08a]/80 border border-[#eab308]/40 shadow-2xs" />
                  <h3 className="font-mono-tech text-[11px] sm:text-xs font-black text-[#1a0e05] tracking-wider uppercase truncate">
                    {col.title}
                  </h3>
                </div>

                {/* Stacked Cassette Cards in Shelf Column Slot */}
                <div className="flex flex-col gap-2 bg-[#120a05] p-2 rounded-lg border border-[#2e1f14] shadow-inner min-h-[380px]">
                  {columnTapes.map(tape => {
                    const isSelected = tape.id === currentTapeId;

                    return (
                      <div
                        key={tape.id}
                        onClick={() => handleTapeClick(tape)}
                        onMouseEnter={() => audioEngine.playTapeSlide()}
                        className={`group relative p-2 rounded-md border ${col.cardBg} ${col.border} shadow-sm cursor-pointer transition-all duration-200 select-none overflow-hidden ${
                          isSelected
                            ? 'ring-2 ring-amber-500 scale-[1.02] shadow-lg border-amber-500'
                            : 'hover:scale-[1.02] hover:shadow-md'
                        }`}
                      >
                        {/* Left Vertical Spine Bar */}
                        <div className={`absolute top-0 left-0 bottom-0 w-2 ${col.spineColor}`} />

                        <div className="pl-2.5 flex items-start justify-between gap-1">
                          {/* Title & Subtitle */}
                          <div className="min-w-0 flex-1">
                            <h4 className={`text-xs sm:text-sm font-extrabold font-handwritten ${col.textColor} leading-tight truncate`}>
                              {tape.title}
                            </h4>
                            <p className={`text-[10px] font-typewriter ${col.subtitleColor} truncate font-bold mt-0.5`}>
                              {tape.artist}
                            </p>
                          </div>

                          {/* Right Badge Tag */}
                          <div className={`px-1.5 py-0.5 text-[8.5px] font-mono-tech font-extrabold rounded uppercase tracking-tighter shrink-0 ${col.tagBg}`}>
                            {tape.price || 'C-60'}
                          </div>
                        </div>

                        {/* Selected Indicator */}
                        {isSelected && (
                          <div className="mt-1 pl-2.5 flex items-center gap-1 text-[8px] font-mono-tech text-amber-700 font-black uppercase">
                            <Disc className="w-3 h-3 animate-spin text-red-600" />
                            <span>IN DECK 1</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. BOTTOM DESK BANNER SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 pt-3 border-t-2 border-[#d9cdb8]">
        
        {/* Box 1: Announcements */}
        <div className="p-3 rounded-lg bg-[#ebd2b2] border border-[#c9b49b] shadow-xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#2b1d14] flex items-center justify-center text-amber-400 shrink-0">
            <Radio className="w-4 h-4" />
          </div>
          <div className="text-[10.5px] font-mono-tech text-[#3d2a1d]">
            <div className="font-extrabold text-[#1a0e05] uppercase">FROM THE CASSETTE SHOP</div>
            <div className="text-[9px] text-[#6e5845]">98.5 SHOP MEMORIES & ANNOUNCEMENTS</div>
          </div>
        </div>

        {/* Box 2: Radio Announcement Banner */}
        <div className="p-3 rounded-lg bg-[#fee2e2] border border-[#fca5a5] shadow-xs flex flex-col justify-between md:col-span-1">
          <div className="flex items-center gap-1.5 text-[9px] font-mono-tech font-black text-red-800">
            <span className="px-1.5 py-0.5 rounded bg-red-700 text-white uppercase">NOW PLAYING ON</span>
            <span>Aakashvani 108.4 FM (1993)</span>
          </div>
          <p className="font-handwritten text-xs sm:text-sm font-bold text-[#450a0a] mt-1 leading-tight">
            "You're listening to the evening cassette hour... dedicated to all the beautiful memories we made in the 90s."
          </p>
        </div>

        {/* Box 3: Taped Paper Tape Care Tip */}
        <div className="relative p-2.5 rounded-xs bg-[#fef9c3] border border-[#fde047] shadow-xs font-handwritten text-xs text-[#1a0e05] flex flex-col justify-center">
          <div className="absolute -top-1.5 right-4 w-8 h-3 bg-[#fef08a]/80 border border-[#eab308]/40 rotate-[3deg]" />
          <div className="font-bold text-[#854d0e] text-[10px] font-mono-tech uppercase">Tape care tip:</div>
          <div>• Store tapes in a cool place. Keep away from sunlight and magnets.</div>
        </div>

        {/* Box 4: Record New Mixtape Button Card */}
        <button
          onClick={onOpenMixtapeMaker}
          className="p-3 rounded-lg bg-gradient-to-r from-[#b45309] to-[#883d06] hover:from-[#d97706] hover:to-[#b45309] text-white border-2 border-amber-300 shadow-md flex items-center justify-between gap-2 cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
        >
          <div className="text-left font-mono-tech">
            <div className="text-xs font-black uppercase text-amber-200 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-amber-200 stroke-[3]" />
              RECORD NEW MIXTAPE
            </div>
            <div className="text-[9px] text-amber-100/90 mt-0.5">
              Make your own. From YouTube playlists.
            </div>
          </div>
          <div className="w-7 h-7 rounded bg-amber-300/20 flex items-center justify-center shrink-0">
            <CassetteIcon className="w-4 h-4 text-amber-200" />
          </div>
        </button>

      </div>
    </div>
  );
};
