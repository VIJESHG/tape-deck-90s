import React, { useState } from 'react';
import { Disc, Plus, Play, Tag, Image, LayoutGrid } from 'lucide-react';
import { CassetteTape, MusicGenre } from '../types';
import { audioEngine } from '../lib/audioEngine';
import { getRealisticCassetteImage } from './CassetteDeckConsole';
import { CassetteLabelCard } from './CassetteLabelCard';

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
  const [viewMode, setViewMode] = useState<'photo' | 'spine'>('photo');

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

  // Helper to determine specific physical J-Card Spine styling for each genre
  const getSpineTheme = (tape: CassetteTape) => {
    if (tape.isCustom || tape.genre === 'Custom Mixtapes') {
      return {
        paperBg: 'bg-[#fffbeb] border-[#fde68a]',
        accentBand: 'bg-[#d97706]',
        textColor: 'text-[#1c1917]',
        subTextColor: 'text-[#78350f]',
        fontFamily: 'font-handwritten',
        tagText: 'HANDWRITTEN MIX',
        priceTagBg: 'bg-amber-200 text-amber-900 border-amber-400',
        brandBadge: 'bg-[#78350f] text-amber-100'
      };
    }

    switch (tape.genre) {
      case '90s Romance':
        return {
          paperBg: 'bg-[#fcf8f2] border-[#fca5a5]',
          accentBand: 'bg-[#b91c1c]',
          textColor: 'text-[#450a0a]',
          subTextColor: 'text-[#991b1b]',
          fontFamily: 'font-handwritten',
          tagText: '90s ROMANCE',
          priceTagBg: 'bg-red-100 text-red-900 border-red-300',
          brandBadge: 'bg-[#991b1b] text-white'
        };

      case 'Indipop':
        return {
          paperBg: 'bg-[#fefce8] border-[#fde047]',
          accentBand: 'bg-[#0284c7]',
          textColor: 'text-[#0f172a]',
          subTextColor: 'text-[#0369a1]',
          fontFamily: 'font-mono-tech',
          tagText: 'INDIPOP HITS',
          priceTagBg: 'bg-yellow-200 text-yellow-950 border-yellow-400',
          brandBadge: 'bg-[#0284c7] text-white'
        };

      case 'Bollywood Gold':
        return {
          paperBg: 'bg-[#1c130b] border-[#d97706]',
          accentBand: 'bg-[#d97706]',
          textColor: 'text-[#fef3c7]',
          subTextColor: 'text-[#f59e0b]',
          fontFamily: 'font-typewriter',
          tagText: 'BOLLYWOOD GOLD',
          priceTagBg: 'bg-[#d97706] text-black font-extrabold border-amber-300',
          brandBadge: 'bg-[#b45309] text-amber-100'
        };

      case 'Western Hits':
        return {
          paperBg: 'bg-[#262626] border-[#525252]',
          accentBand: 'bg-[#dc2626]',
          textColor: 'text-[#f5f5f5]',
          subTextColor: 'text-[#d4d4d4]',
          fontFamily: 'font-mono-tech',
          tagText: 'WESTERN POP/ROCK',
          priceTagBg: 'bg-stone-300 text-stone-900 border-stone-400',
          brandBadge: 'bg-[#dc2626] text-white'
        };

      case 'Ghazals & Unplugged':
        return {
          paperBg: 'bg-[#f4f7f4] border-[#86efac]',
          accentBand: 'bg-[#15803d]',
          textColor: 'text-[#052e16]',
          subTextColor: 'text-[#166534]',
          fontFamily: 'font-typewriter',
          tagText: 'GHAZAL / UNPLUGGED',
          priceTagBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          brandBadge: 'bg-[#15803d] text-white'
        };

      default:
        return {
          paperBg: 'bg-[#f8f4ea] border-[#d6cbaf]',
          accentBand: 'bg-[#b45309]',
          textColor: 'text-[#1c1917]',
          subTextColor: 'text-[#78350f]',
          fontFamily: 'font-typewriter',
          tagText: 'CASSETTE TAPE',
          priceTagBg: 'bg-amber-100 text-amber-900 border-amber-300',
          brandBadge: 'bg-[#b45309] text-white'
        };
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-8 p-4 sm:p-6 rounded-2xl wooden-shelf-rack text-[#f3e8dc]">
      
      {/* Wooden Rack Header with Shop Counter Signboard Aesthetics */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-3.5 border-b-2 border-[#3d2b1f] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold font-mono-tech text-[#d4c1a5] uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#d97706]" />
              <span>CASSETTE SHOP DISPLAY WALL (1995 DISPLAY)</span>
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-mono-tech bg-[#24170e] border border-[#4a3627] text-[#c29873] rounded uppercase font-bold shadow-inner">
              {filteredTapes.length} TAPE SLOTS
            </span>
          </div>
          <p className="text-[11px] text-[#8c7a6b] font-typewriter mt-0.5">
            Select a tape from the rack shelf to slide into Deck 1
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Real Cassette Photo View / Spine View Toggle Buttons */}
          <div className="flex items-center p-1 rounded-lg bg-[#18100a] border border-[#38271c] shadow-inner">
            <button
              onClick={() => {
                audioEngine.playSwitchClick();
                setViewMode('photo');
              }}
              className={`px-3 py-1 rounded text-[10px] font-mono-tech font-extrabold uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'photo'
                  ? 'bg-[#d97706] text-black shadow-xs'
                  : 'text-[#8c7a6b] hover:text-[#d4c1a5]'
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>REAL CASSETTE PHOTOS</span>
            </button>
            <button
              onClick={() => {
                audioEngine.playSwitchClick();
                setViewMode('spine');
              }}
              className={`px-3 py-1 rounded text-[10px] font-mono-tech font-extrabold uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'spine'
                  ? 'bg-[#d97706] text-black shadow-xs'
                  : 'text-[#8c7a6b] hover:text-[#d4c1a5]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>J-CARD SPINES</span>
            </button>
          </div>

          {/* Physical Shop Counter Record Mixtape Machine Switch */}
          <button
            onClick={onOpenMixtapeMaker}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-gradient-to-b from-[#b45309] to-[#883d06] hover:from-[#d97706] hover:to-[#b45309] text-black font-extrabold text-xs font-mono-tech shadow-[0_4px_8px_rgba(0,0,0,0.6)] active:translate-y-0.5 transition-all cursor-pointer border border-amber-300/80 uppercase tracking-wider shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3] text-black" />
            <span>RECORD MIXTAPE</span>
          </button>
        </div>
      </div>

      {/* Category Divider Shop Labels Attached to Wooden Shelf */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-3 my-1 border-b border-[#38271c] no-scrollbar">
        <span className="text-[10px] font-mono-tech text-[#7a6858] uppercase font-bold mr-1 shrink-0">
          SHELF RACK:
        </span>
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => {
              audioEngine.playSwitchClick();
              setSelectedGenre(genre);
            }}
            className={`px-3 py-1 rounded text-[10.5px] font-mono-tech uppercase tracking-wider transition-all cursor-pointer border shadow-sm ${
              selectedGenre === genre
                ? 'bg-[#d97706] border-amber-300 text-black font-extrabold shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]'
                : 'bg-[#18100a] border-[#38271c] text-[#8c7a6b] hover:text-[#d4c1a5] hover:border-[#4a3627]'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* PHYSICAL WOODEN CASSETTE WALL RACK SHELF */}
      <div className="my-4 p-3.5 sm:p-5 bg-[#120b07] rounded-xl border-2 border-[#2b1d14] shadow-[inset_0_4px_20px_rgba(0,0,0,0.95)] relative overflow-hidden">
        
        {/* Wooden Shelf Top Groove */}
        <div className="h-2 bg-[#38261b] rounded-t border-b border-[#1f130b] mb-4 shadow-sm flex items-center justify-between px-2 text-[7px] font-mono-tech text-[#8c7a6b]">
          <span>SLOT RACK NO. 1 - {filteredTapes.length}</span>
          <span>REAL VINTAGE 1990S AUDIO CASSETTE SHELLS</span>
        </div>

        {/* Shelf Slots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 cassette-spine-container">
          {filteredTapes.map(tape => {
            const isSelected = tape.id === currentTapeId;
            const theme = getSpineTheme(tape);
            const realisticImg = getRealisticCassetteImage(tape);

            return (
              <div
                key={tape.id}
                onClick={() => handleTapeClick(tape)}
                onMouseEnter={() => audioEngine.playTapeSlide()}
                className={`group relative p-1 rounded-lg bg-[#0a0705] border border-[#2b1d14] shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)] cursor-pointer transition-all duration-200 select-none ${
                  isSelected ? 'translate-y-[-6px]' : 'hover:translate-y-[-4px]'
                }`}
              >
                {viewMode === 'photo' ? (
                  /* 90S REFERENCE CASSETTE LABEL DESIGN CARD */
                  <CassetteLabelCard
                    tape={tape}
                    isSelected={isSelected}
                    deckNumber={1}
                    currentSide="A"
                  />
                ) : (
                  /* Physical Clear Plastic Case & J-Card Paper Spine Insert */
                  <div
                    className={`relative p-3 rounded-md border ${theme.paperBg} shadow-lg flex flex-col justify-between min-h-[115px] transition-all overflow-hidden ${
                      isSelected
                        ? 'shadow-[0_12px_24px_rgba(0,0,0,0.9),0_0_0_2px_#d97706]'
                        : 'group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.8)]'
                    }`}
                  >
                    {/* Spine Fold Paper Edge Texture Line */}
                    <div className={`absolute top-0 left-0 bottom-0 w-2.5 ${theme.accentBand} opacity-90 border-r border-black/20 flex flex-col items-center justify-between py-1 text-[7px] text-white/90 font-mono-tech font-extrabold select-none`}>
                      <span>SIDE</span>
                      <span className="text-[9px]">A</span>
                      <span>TAPE</span>
                    </div>

                    {/* Top Bar: Brand Badge & Small Price Tag Sticker */}
                    <div className="flex items-start justify-between pl-3.5 z-10">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 text-[8.5px] font-mono-tech font-extrabold rounded-[2px] uppercase shadow-xs ${theme.brandBadge}`}>
                          {tape.brand}
                        </span>
                        <span className="text-[8px] font-mono-tech text-stone-500 font-bold uppercase hidden sm:inline">
                          HIGH BIAS C-90
                        </span>
                      </div>

                      {/* Authentic Small Round/Square Shop Price Sticker */}
                      <div className={`px-1.5 py-0.5 text-[8.5px] font-mono-tech font-extrabold rounded-[2px] border shadow-xs rotate-[1.5deg] ${theme.priceTagBg}`}>
                        {tape.price}
                      </div>
                    </div>

                    {/* Center Label: Title & Artist */}
                    <div className="pl-3.5 my-1.5 z-10 min-w-0">
                      <h4 className={`text-sm sm:text-base font-extrabold ${theme.fontFamily} ${theme.textColor} leading-tight truncate`}>
                        {tape.title}
                      </h4>
                      <p className={`text-[11px] font-typewriter ${theme.subTextColor} truncate font-bold mt-0.5`}>
                        {tape.artist}
                      </p>
                    </div>

                    {/* Bottom Bar: Track Info / Pick Prompt */}
                    <div className="flex items-center justify-between pl-3.5 pt-1.5 border-t border-black/10 z-10 text-[9.5px] font-mono-tech">
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[#b45309] font-extrabold uppercase">
                          <Disc className="w-3.5 h-3.5 animate-spin [animation-duration:3s]" />
                          <span>SLOTTED IN DECK 1</span>
                        </span>
                      ) : (
                        <span className="text-stone-500 group-hover:text-stone-900 transition-colors flex items-center gap-1 font-bold uppercase">
                          <Play className="w-3 h-3 fill-current text-amber-700" />
                          <span>LOAD CASSETTE</span>
                        </span>
                      )}

                      <span className="text-[8px] font-mono-tech text-stone-500 font-extrabold uppercase">
                        {theme.tagText}
                      </span>
                    </div>
                  </div>
                )}

                {/* Slot Floor Shadow underneath tape when pulled forward */}
                <div className={`h-1.5 w-full bg-[#050302] rounded-b transition-all ${
                  isSelected ? 'opacity-100 shadow-md' : 'opacity-40 group-hover:opacity-80'
                }`} />
              </div>
            );
          })}
        </div>

        {/* Wooden Shelf Bottom Ledge */}
        <div className="h-3 bg-[#3d2a1d] rounded-b border-t border-[#24170e] mt-4 shadow-md flex items-center justify-between px-3 text-[8px] font-mono-tech text-[#8c7a6b]">
          <span>TEAKWOOD RACK SYSTEM • NEW DELHI 110001</span>
          <span>STEREO COMPACT CASSETTES</span>
        </div>
      </div>
    </div>
  );
};

