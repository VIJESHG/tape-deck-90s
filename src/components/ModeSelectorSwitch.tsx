import React from 'react';
import { Disc, Radio } from 'lucide-react';
import { AudioMode } from '../types';
import { audioEngine } from '../lib/audioEngine';

interface ModeSelectorSwitchProps {
  mode: AudioMode;
  onModeChange: (newMode: AudioMode) => void;
}

export const ModeSelectorSwitch: React.FC<ModeSelectorSwitchProps> = ({
  mode,
  onModeChange
}) => {
  const handleToggle = (targetMode: AudioMode) => {
    if (targetMode === mode) return;
    audioEngine.playSwitchClick();
    if (targetMode === 'RADIO') {
      audioEngine.playRadioStatic(250, 0.25);
    } else {
      audioEngine.playButtonSnap();
    }
    onModeChange(targetMode);
  };

  return (
    <div className="flex flex-col items-center my-4">
      {/* Heavy Equipment Plate */}
      <div className="relative p-3 rounded-2xl bg-gradient-to-b from-[#2a221b] via-[#1f1914] to-[#120f0d] border-2 border-[#4a392c] shadow-[0_10px_25px_rgba(0,0,0,0.7)] flex flex-col items-center min-w-[280px]">
        {/* Brass Plate Branding */}
        <div className="text-[10px] font-mono-tech tracking-widest text-[#d97706] uppercase mb-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-pulse" />
          <span>FUNCTION SELECTOR • MODEL 1994</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-pulse" />
        </div>

        {/* Physical Toggle Housing */}
        <div className="relative w-full bg-[#120f0d] p-1.5 rounded-xl border border-[#3a2d24] flex items-center justify-between gap-2 shadow-inner">
          {/* Cassette Tape Option Button */}
          <button
            onClick={() => handleToggle('CASSETTE')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-mono-tech text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
              mode === 'CASSETTE'
                ? 'bg-gradient-to-r from-[#d97706] to-[#b45309] text-black shadow-[0_0_15px_rgba(217,119,6,0.4)] scale-100'
                : 'text-[#8c7a6b] hover:text-[#d4c3b5] hover:bg-[#1a1410]'
            }`}
          >
            <Disc className={`w-4 h-4 ${mode === 'CASSETTE' ? 'animate-spin [animation-duration:4s]' : ''}`} />
            <span>Cassette Deck</span>
          </button>

          {/* Air Radio Option Button */}
          <button
            onClick={() => handleToggle('RADIO')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-mono-tech text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
              mode === 'RADIO'
                ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-100'
                : 'text-[#8c7a6b] hover:text-[#d4c3b5] hover:bg-[#1a1410]'
            }`}
          >
            <Radio className={`w-4 h-4 ${mode === 'RADIO' ? 'animate-pulse' : ''}`} />
            <span>Air Radio</span>
          </button>
        </div>

        {/* Brass Screws Aesthetic */}
        <div className="absolute top-1.5 left-2 text-[#4a392c] text-[9px]">⊕</div>
        <div className="absolute top-1.5 right-2 text-[#4a392c] text-[9px]">⊕</div>
        <div className="absolute bottom-1.5 left-2 text-[#4a392c] text-[9px]">⊕</div>
        <div className="absolute bottom-1.5 right-2 text-[#4a392c] text-[9px]">⊕</div>
      </div>
    </div>
  );
};
