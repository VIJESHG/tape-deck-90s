import React, { useState } from 'react';
import { Disc, Sparkles, Plus, Play } from 'lucide-react';
import { CassetteTape, MusicGenre } from '../types';
import { audioEngine } from '../lib/audioEngine';

interface CassetteRackProps {
  tapes: CassetteTape[];
  currentTapeId: string | null;
  onSelectTape: (tape: CassetteTape) => void;
  onOpenMixtapeMaker: () => void;
}

export const CassetteRack: React.FC<CassetteRackProps> = ({
  tapes,
  currentTapeId,
  onSelectTape,
  onOpenMixtapeMaker
}) => {
  const [selectedGenre, setSelectedGenre] = useState<MusicGenre | 'ALL'>('ALL');

  const genres: (MusicGenre | 'ALL')[] = [
    'ALL',
    '90s Romance',
    'Indipop',
    'Bollywood Gold',
    'Western Hits',
    'Ghazals & Unplugged',
    'Custom Mixtapes'
  ];

  const filteredTapes = selectedGenre === 'ALL'
    ? tapes
    : tapes.filter(t => t.genre === selectedGenre);

  const handleTapeClick = (tape: CassetteTape) => {
    audioEngine.playTapeSlide();
    setTimeout(() => {
      audioEngine.playDoorSnap();
    }, 150);
    onSelectTape(tape);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8 p-5 sm:p-7 rounded-3xl wooden-shelf-rack text-[#f3e8dc]">
      
      {/* Wooden Rack Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b-2 border-[#523d2e] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-extrabold font-mono-tech text-[#f3e8dc] uppercase tracking-wider flex items-center gap-2">
              <span>📼</span> 90S TEAKWOOD CASSETTE WALL RACK
            </h3>
            <span className="px-3 py-0.5 text-xs font-mono-tech bg-[#d97706]/30 border border-[#d97706]/60 text-[#f59e0b] rounded-md uppercase font-extrabold">
              {filteredTapes.length} SPINES IN SHELF
            </span>
          </div>
          <p className="text-xs text-[#a8988a] font-typewriter mt-1">
            Hover over any cassette spine to pull it forward • Click to load into Deck 1
          </p>
        </div>

        {/* Record New Mixtape Button */}
        <button
          onClick={onOpenMixtapeMaker}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#d97706] text-black font-extrabold text-xs font-mono-tech shadow-xl active:scale-95 transition-all cursor-pointer border border-amber-300"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>RECORD NEW MIXTAPE</span>
        </button>
      </div>

      {/* Genre Filter Wooden Ledge Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-3.5 my-2 border-b border-[#4a3627] no-scrollbar">
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => {
              audioEngine.playSwitchClick();
              setSelectedGenre(genre);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-tech whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer border ${
              selectedGenre === genre
                ? 'bg-[#d97706] border-amber-300 text-black font-bold shadow-[0_0_15px_rgba(217,119,6,0.6)]'
                : 'bg-[#1a120c] border-[#38281d] text-[#8c7a6b] hover:text-[#d4c3b5] hover:border-[#d97706]/60'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* PHYSICAL WOODEN CASSETTE WALL SHELF (SPINE VIEW) */}
      <div className="my-6 p-4 sm:p-6 bg-[#160f0a] rounded-2xl border-2 border-[#3d2a1d] shadow-inner relative overflow-hidden">
        
        {/* Wooden Shelf Top Ledge */}
        <div className="h-2 bg-[#422e20] rounded-t border-b border-[#24170e] mb-4 shadow-sm" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 cassette-spine-container">
          {filteredTapes.map(tape => {
            const isSelected = tape.id === currentTapeId;

            // Spine color scheme depending on shell color
            const spineBgClass = 
              tape.shellColor === 'gold' ? 'from-[#3a281a] via-[#523925] to-[#24170d] border-[#d97706]' :
              tape.shellColor === 'red' ? 'from-[#421818] via-[#5c2222] to-[#290e0e] border-red-700' :
              tape.shellColor === 'blue' ? 'from-[#19273a] via-[#243752] to-[#0e1724] border-blue-700' :
              tape.shellColor === 'black' ? 'from-[#1a1a1a] via-[#2b2b2b] to-[#121212] border-stone-600' :
              'from-[#38332d] via-[#4d4740] to-[#24211d] border-stone-400';

            return (
              <div
                key={tape.id}
                onClick={() => handleTapeClick(tape)}
                onMouseEnter={() => audioEngine.playTapeSlide()}
                className={`cassette-spine-item relative group p-3.5 rounded-xl border-2 bg-gradient-to-r ${spineBgClass} cursor-pointer shadow-2xl flex flex-col justify-between min-h-[110px] ${
                  isSelected ? 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)] scale-[1.03]' : ''
                }`}
              >
                {/* Wooden Rack Groove Slot Notch (Top & Bottom) */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0b0704] border-b border-[#38281d]" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0b0704] border-t border-[#38281d]" />

                {/* CASSETTE SPINE TOP BAR: Brand & Duration */}
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10 z-10">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border shadow-sm ${
                      tape.shellColor === 'gold' ? 'bg-amber-400 border-amber-200' :
                      tape.shellColor === 'red' ? 'bg-red-500 border-red-300' :
                      tape.shellColor === 'blue' ? 'bg-blue-500 border-blue-300' :
                      tape.shellColor === 'black' ? 'bg-stone-700 border-stone-500' :
                      'bg-stone-300 border-stone-100'
                    }`} />
                    <span className="text-[11px] font-mono-tech font-extrabold text-[#d97706] tracking-widest uppercase">
                      {tape.brand}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-[#0b0704] text-[9px] font-mono-tech text-[#a8988a] font-bold border border-[#38281d]">
                    C-90 TYPE II
                  </span>
                </div>

                {/* CASSETTE SPINE CENTER LABEL: Handwritten Fountain Pen Title */}
                <div className="my-2 z-10 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-extrabold font-handwritten text-[#f3e8dc] group-hover:text-[#f59e0b] leading-tight transition-colors truncate">
                      {tape.title}
                    </h4>
                    {tape.isCustom && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-[#f59e0b] text-[8px] font-mono-tech border border-amber-500/50 shrink-0 font-extrabold">
                        CUSTOM
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-typewriter text-[#a8988a] truncate">
                    {tape.artist}
                  </p>
                </div>

                {/* CASSETTE SPINE BOTTOM BAR: Status / Pick Prompt */}
                <div className="flex items-center justify-between pt-1.5 border-t border-white/10 z-10 text-[10px] font-mono-tech">
                  {isSelected ? (
                    <span className="flex items-center gap-1.5 text-[#f59e0b] font-extrabold">
                      <Disc className="w-3.5 h-3.5 animate-spin [animation-duration:2.5s]" />
                      LOADED IN DECK 1
                    </span>
                  ) : (
                    <span className="text-[#8c7a6b] group-hover:text-[#f59e0b] transition-colors flex items-center gap-1 font-bold">
                      <Play className="w-3 h-3 fill-current" />
                      <span>SLIDE &amp; LOAD TAPE</span>
                    </span>
                  )}

                  <span className="text-[9px] font-typewriter text-[#8c7a6b] uppercase">{tape.price}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wooden Shelf Bottom Ledge */}
        <div className="h-3 bg-[#3d2a1d] rounded-b border-t border-[#24170e] mt-4 shadow-md" />
      </div>
    </div>
  );
};
