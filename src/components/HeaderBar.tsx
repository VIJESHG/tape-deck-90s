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
    <header className="relative z-20 border-b-2 border-[#2b211a] bg-[#120e0b] px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Retro Shop Signboard Plate */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#1f1712] border border-[#3d2e23] flex items-center justify-center text-[#d97706] shadow-inner">
            <Disc className="w-5 h-5 animate-spin [animation-duration:10s]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-wider text-[#e2d5c8] font-typewriter uppercase">
                90s Cassette Shop <span className="text-[#d97706]">&amp;</span> Radio
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono-tech bg-[#241a12] border border-[#4a3627] text-[#c29873] rounded uppercase">
                EST. 1992
              </span>
            </div>
            <p className="text-[11px] text-[#8c7a6b] font-mono-tech flex items-center gap-1">
              <Radio className="w-3 h-3 text-[#d97706]" />
              Mixtape Counter &amp; Shortwave Receiver • Vividh Bharati 89.1 FM
            </p>
          </div>
        </div>

        {/* Action Controls & Atmosphere Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Create Custom Mixtape Button */}
          <button
            onClick={() => {
              audioEngine.playButtonSnap();
              onOpenMixtapeMaker();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#b45309] hover:bg-[#d97706] text-black font-extrabold text-xs font-mono-tech uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-sm border border-amber-300"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Record Mixtape</span>
          </button>

          {/* Tape Hiss Noise Generator Toggle */}
          <button
            onClick={toggleHiss}
            title="Toggle authentic magnetic tape hiss noise"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono-tech uppercase border transition-all cursor-pointer ${
              playback.tapeHissEnabled
                ? 'bg-[#2a1c12] border-[#d97706] text-[#f59e0b]'
                : 'bg-[#18120e] border-[#2e231b] text-[#8c7a6b] hover:text-[#d4c1a5]'
            }`}
          >
            {playback.tapeHissEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#f59e0b]" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Tape Hiss</span>
          </button>

          {/* Ambient Lighting Level Switch */}
          <button
            onClick={toggleLighting}
            title="Cycle shop lighting (Dim / Cozy Amber / Bright)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#18120e] border border-[#2e231b] text-[#8c7a6b] hover:text-[#e2d5c8] text-xs font-mono-tech uppercase transition-all cursor-pointer"
          >
            <Sun className="w-3.5 h-3.5 text-[#d97706]" />
            <span className="capitalize">{playback.ambientLighting}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
