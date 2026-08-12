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
    <div className="flex flex-col items-center my-3">
      {/* Heavy Equipment Function Selector Plate */}
      <div className="relative px-4 py-2 rounded-xl bg-[#18120e] border-2 border-[#3d2e23] shadow-md flex items-center gap-3 min-w-[280px]">
        {/* Hardware Label */}
        <div className="text-[10px] font-mono-tech tracking-widest text-[#8c7a6b] uppercase font-bold shrink-0">
          FUNCTION:
        </div>

        {/* Physical Toggle Housing */}
        <div className="relative flex-1 bg-[#0d0a08] p-1 rounded-lg border border-[#2b2018] flex items-center gap-1.5 shadow-inner">
          {/* Cassette Tape Option Button */}
          <button
            onClick={() => handleToggle('CASSETTE')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded font-mono-tech text-xs uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
              mode === 'CASSETTE'
                ? 'bg-[#d97706] text-black shadow-sm'
                : 'text-[#8c7a6b] hover:text-[#d4c1a5] hover:bg-[#18120e]'
            }`}
          >
            <Disc className={`w-3.5 h-3.5 ${mode === 'CASSETTE' ? 'animate-spin [animation-duration:5s]' : ''}`} />
            <span>Tape Deck</span>
          </button>

          {/* Air Radio Option Button */}
          <button
            onClick={() => handleToggle('RADIO')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded font-mono-tech text-xs uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
              mode === 'RADIO'
                ? 'bg-[#10b981] text-black shadow-sm'
                : 'text-[#8c7a6b] hover:text-[#d4c1a5] hover:bg-[#18120e]'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${mode === 'RADIO' ? 'animate-pulse' : ''}`} />
            <span>FM Radio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
