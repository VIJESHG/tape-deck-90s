import React from 'react';
import { Disc, Radio, Sparkles } from 'lucide-react';
import { PlaybackState } from '../types';
import { audioEngine } from '../lib/audioEngine';

interface HeaderBarProps {
  playback: PlaybackState;
  setPlayback: React.Dispatch<React.SetStateAction<PlaybackState>>;
  onOpenMixtapeMaker: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  playback,
  setPlayback,
  onOpenMixtapeMaker,
  activeTab = 'DECK',
  onTabChange
}) => {
  const tabs = [
    { id: 'DECK', label: 'DECK' },
    { id: 'CASSETTE WALL', label: 'CASSETTE WALL' },
    { id: 'RADIO', label: 'RADIO' },
    { id: 'RECORD MIXTAPE', label: 'RECORD MIXTAPE' },
    { id: 'SHOP MEMORIES', label: 'SHOP MEMORIES' },
    { id: 'ABOUT', label: 'ABOUT' }
  ];

  return (
    <header className="relative z-20 bg-[#ebd9c3] border-b-2 border-[#b8a288] px-4 py-2.5 shadow-md text-[#2e1d11]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2d1e13] border-2 border-[#8c6b4f] flex items-center justify-center text-amber-400 shadow-md">
            <Disc className="w-6 h-6 animate-spin [animation-duration:12s]" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-extrabold tracking-wider text-[#1a0f07] font-mono-tech uppercase leading-tight">
              90s CASSETTE SHOP
            </h1>
            <p className="text-[10.5px] font-mono-tech text-[#705238] font-bold tracking-widest uppercase">
              VINTAGE RADIO &amp; MIXTAPES
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center font-mono-tech font-extrabold text-xs uppercase tracking-wider">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  audioEngine.playSwitchClick();
                  if (tab.id === 'RECORD MIXTAPE') {
                    onOpenMixtapeMaker();
                  } else if (onTabChange) {
                    onTabChange(tab.id);
                  }
                }}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer relative ${
                  isActive
                    ? 'text-[#b91c1c] font-black border-b-2 border-[#b91c1c]'
                    : 'text-[#5c4028] hover:text-[#1a0f07] hover:bg-[#deca17]/20'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right 98.4 FM CASSETTE SHOP RADIO Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-md bg-[#ded0bd] border border-[#a89278] shadow-inner flex items-center gap-2 text-[10px] font-mono-tech font-bold text-[#3d2a1b]">
            <div>
              <div className="text-[11px] font-extrabold text-[#1a0f07] leading-none">98.4 FM</div>
              <div className="text-[8px] text-[#705238] uppercase">CASSETTE SHOP RADIO</div>
            </div>
            <div className="px-1.5 py-0.5 rounded bg-[#be123c] text-white font-mono-tech font-black text-[8px] uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>ON AIR</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

