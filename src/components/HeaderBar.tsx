import React from 'react';
import { Sun, Volume2, VolumeX, Sparkles, Disc, Radio } from 'lucide-react';
import { PlaybackState } from '../types';
import { audioEngine } from '../lib/audioEngine';

interface HeaderBarProps {
  playback: PlaybackState;
  setPlayback: React.Dispatch<React.SetStateAction<PlaybackState>>;
  onOpenMixtapeMaker: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  playback,
  setPlayback,
  onOpenMixtapeMaker
}) => {
  const toggleLighting = () => {
    audioEngine.playSwitchClick();
    const nextLighting: Record<'dim' | 'cozy' | 'bright', 'dim' | 'cozy' | 'bright'> = {
      dim: 'cozy',
      cozy: 'bright',
      bright: 'dim'
    };
    setPlayback(prev => ({ ...prev, ambientLighting: nextLighting[prev.ambientLighting] }));
  };

  const toggleHiss = () => {
    audioEngine.playSwitchClick();
    const nextState = !playback.tapeHissEnabled;
    audioEngine.toggleTapeHiss(nextState);
    setPlayback(prev => ({ ...prev, tapeHissEnabled: nextState }));
  };

  return (
    <header className="relative z-20 border-b border-[#3a2d24] bg-[#1a1410]/90 backdrop-blur-md px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Neon / Amber Retro Shop Sign */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2a1e16] border border-[#d97706]/40 flex items-center justify-center shadow-[0_0_15px_rgba(217,119,6,0.25)] text-[#f59e0b]">
            <Disc className="w-6 h-6 animate-spin [animation-duration:8s]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-wider text-[#f3e8dc] font-typewriter uppercase">
                90s Cassette Shop <span className="text-[#d97706]">&amp;</span> Radio
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono-tech bg-[#d97706]/20 border border-[#d97706]/40 text-[#f59e0b] rounded uppercase">
                EST. 1992
              </span>
            </div>
            <p className="text-xs text-[#a8988a] font-mono-tech flex items-center gap-1">
              <Radio className="w-3 h-3 text-[#d97706]" />
              Mixtape Counter &amp; Shortwave Receiver • T-Series • Vividh Bharati 89.1 FM
            </p>
          </div>
        </div>

        {/* Action Controls & Atmosphere Toggles */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Create Custom Mixtape Button */}
          <button
            onClick={() => {
              audioEngine.playButtonSnap();
              onOpenMixtapeMaker();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#d97706] hover:bg-[#b45309] text-black font-semibold text-xs transition-all shadow-[0_0_10px_rgba(217,119,6,0.3)] active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Make Custom Mixtape</span>
          </button>

          {/* Tape Hiss Noise Generator Toggle */}
          <button
            onClick={toggleHiss}
            title="Toggle authentic magnetic tape hiss noise"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono-tech border transition-all cursor-pointer ${
              playback.tapeHissEnabled
                ? 'bg-[#2a1e16] border-[#d97706] text-[#f59e0b] shadow-[0_0_8px_rgba(217,119,6,0.3)]'
                : 'bg-[#15110e] border-[#3a2d24] text-[#8c7a6b] hover:text-[#c4b5fd]'
            }`}
          >
            {playback.tapeHissEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Tape Hiss</span>
          </button>

          {/* Ambient Lighting Level Switch */}
          <button
            onClick={toggleLighting}
            title="Cycle shop lighting (Dim / Cozy Amber / Bright)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#15110e] border border-[#3a2d24] text-[#a8988a] hover:text-[#f3e8dc] text-xs font-mono-tech transition-all cursor-pointer"
          >
            <Sun className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span className="capitalize">{playback.ambientLighting}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
