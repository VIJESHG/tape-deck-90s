import React, { useState } from 'react';
import { Radio, Volume2, Sparkles, Navigation, Signal } from 'lucide-react';
import { RadioStation, PlaybackState } from '../types';
import { audioEngine } from '../lib/audioEngine';

interface RadioConsoleProps {
  stations: RadioStation[];
  currentStation: RadioStation | null;
  playback: PlaybackState;
  onSelectStation: (station: RadioStation) => void;
}

export const RadioConsole: React.FC<RadioConsoleProps> = ({
  stations,
  currentStation,
  playback,
  onSelectStation
}) => {
  const [selectedFreq, setSelectedFreq] = useState<number>(
    currentStation ? currentStation.frequency : 89.1
  );
  const [band, setBand] = useState<'FM' | 'SW'>('FM');

  // Frequency range: 88.0 to 108.0 MHz
  const minFreq = 88.0;
  const maxFreq = 108.0;
  const currentPosPercent = Math.min(
    100,
    Math.max(0, ((selectedFreq - minFreq) / (maxFreq - minFreq)) * 100)
  );

  const handleFrequencyChange = (newFreq: number) => {
    const clampedFreq = Math.round(newFreq * 10) / 10;
    setSelectedFreq(clampedFreq);
    audioEngine.playRadioStatic(200, 0.3);

    // Find matching station nearby (within 0.5 MHz)
    const match = stations.find(
      s => Math.abs(s.frequency - clampedFreq) <= 0.4
    );

    if (match && match.id !== currentStation?.id) {
      onSelectStation(match);
    }
  };

  const handleStationClick = (station: RadioStation) => {
    audioEngine.playSwitchClick();
    audioEngine.playRadioStatic(250, 0.25);
    setSelectedFreq(station.frequency);
    onSelectStation(station);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-4 p-4 md:p-6 rounded-3xl bg-gradient-to-b from-[#2e241d] via-[#1f1813] to-[#14100c] border-2 border-[#523e31] shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
      {/* Top Header & Vacuum Tube Glow Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-[#423328] gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b] amber-tube-glow flex items-center justify-center text-[#f59e0b]">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-mono-tech text-[#f3e8dc] uppercase tracking-wider">
              AAKASHVANI SHORTWAVE &amp; FM RECEIVER
            </h2>
            <p className="text-[10px] font-mono-tech text-[#a8988a]">MODEL SW-108 STEREO VACUUM TUBE</p>
          </div>
        </div>

        {/* Band Switcher & Signal Meter */}
        <div className="flex items-center gap-3">
          {/* Signal Quality */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#120f0d] border border-[#3a2d24] text-xs font-mono-tech">
            <Signal className="w-3.5 h-3.5 text-[#10b981]" />
            <span className="text-[#10b981] font-bold">
              {currentStation ? currentStation.signalStrength : 'TUNING'}
            </span>
          </div>

          {/* FM / SW Toggle */}
          <div className="flex bg-[#120f0d] p-1 rounded-lg border border-[#3a2d24]">
            <button
              onClick={() => {
                audioEngine.playSwitchClick();
                setBand('FM');
              }}
              className={`px-3 py-1 text-xs font-mono-tech font-bold rounded cursor-pointer ${
                band === 'FM' ? 'bg-[#d97706] text-black shadow-md' : 'text-[#8c7a6b]'
              }`}
            >
              FM
            </button>
            <button
              onClick={() => {
                audioEngine.playSwitchClick();
                setBand('SW');
              }}
              className={`px-3 py-1 text-xs font-mono-tech font-bold rounded cursor-pointer ${
                band === 'SW' ? 'bg-[#d97706] text-black shadow-md' : 'text-[#8c7a6b]'
              }`}
            >
              SW
            </button>
          </div>
        </div>
      </div>

      {/* Main Backlit Analog Dial Window */}
      <div className="relative w-full bg-[#140e0a] p-4 sm:p-6 rounded-2xl border-2 border-[#4a392c] shadow-[inset_0_0_30px_rgba(0,0,0,0.95)]">
        {/* Illuminated Dial Glass Screen */}
        <div className="relative w-full h-44 sm:h-48 rounded-xl bg-gradient-to-b from-[#241a12] via-[#1a120c] to-[#0f0a07] border border-[#d97706]/40 p-4 flex flex-col justify-between overflow-hidden shadow-[0_0_25px_rgba(217,119,6,0.15)]">
          
          {/* Cathode Glow Bulbs */}
          <div className="absolute top-2 left-4 w-3 h-3 rounded-full bg-[#f59e0b] blur-sm opacity-80 amber-tube-glow" />
          <div className="absolute top-2 right-4 w-3 h-3 rounded-full bg-[#f59e0b] blur-sm opacity-80 amber-tube-glow" />

          {/* Station Brand Header */}
          <div className="flex items-center justify-between text-xs font-mono-tech z-10">
            <span className="text-[#f59e0b] font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentStation ? currentStation.callSign : 'SEARCHING FREQUENCY...'}</span>
            </span>
            <span className="text-[#d97706] font-mono-tech text-[11px]">
              {selectedFreq.toFixed(1)} {band === 'FM' ? 'MHz' : 'kHz'}
            </span>
          </div>

          {/* Frequency Rail & Red Mechanical Tuning Pointer */}
          <div className="relative my-auto w-full py-6">
            {/* Frequency Tick Marks (88 to 108) */}
            <div className="relative w-full h-12 border-t-2 border-b-2 border-[#d97706]/60 flex items-center justify-between px-2">
              {Array.from({ length: 21 }).map((_, idx) => {
                const freq = 88 + idx;
                const isMajor = idx % 2 === 0;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-0.5 bg-[#d97706] ${
                        isMajor ? 'h-5 opacity-90' : 'h-3 opacity-50'
                      }`}
                    />
                    {isMajor && (
                      <span className="text-[10px] font-mono-tech text-[#f3e8dc] mt-1 font-bold">
                        {freq}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Red Mechanical Tuning Needle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-red-600 shadow-[0_0_12px_rgba(239,68,68,0.9)] z-20 transition-all duration-150 flex flex-col items-center pointer-events-none"
              style={{ left: `${currentPosPercent}%` }}
            >
              <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-md -mt-1" />
              <div className="w-0.5 h-full bg-red-500" />
            </div>

            {/* Range Slider Overlay for smooth dragging */}
            <input
              type="range"
              min={minFreq}
              max={maxFreq}
              step="0.1"
              value={selectedFreq}
              onChange={(e) => handleFrequencyChange(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>

          {/* Bottom Broadcast Status */}
          <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#a8988a] z-10">
            <span>STATION: {currentStation ? currentStation.name : 'AIR STATIC'}</span>
            <span>LOCATION: {currentStation ? currentStation.location : 'ALL INDIA'}</span>
          </div>
        </div>

        {/* Tuning Knob & Station Presets */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Station Presets Grid */}
          <div className="flex-1 w-full">
            <div className="text-[10px] font-mono-tech text-[#a8988a] uppercase mb-2">
              QUICK STATION PRESETS (CLICK TO TUNE)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {stations.map(st => {
                const isActive = currentStation?.id === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => handleStationClick(st)}
                    className={`p-2 rounded-lg border font-mono-tech text-xs text-left transition-all active:scale-95 cursor-pointer ${
                      isActive
                        ? 'bg-[#d97706] border-amber-400 text-black font-bold shadow-[0_0_12px_rgba(217,119,6,0.4)]'
                        : 'bg-[#1f1813] border-[#3a2d24] text-[#d4c3b5] hover:border-[#d97706]/60 hover:text-white'
                    }`}
                  >
                    <div className="text-[10px] opacity-80">{st.callSign}</div>
                    <div className="truncate font-semibold">{st.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Knurled Brass Tuning Knob Visual */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-mono-tech text-[#d97706] uppercase mb-1">
              TUNING KNOB
            </div>
            <div
              className="relative w-20 h-20 rounded-full bg-gradient-to-b from-[#4a392c] via-[#2a1e16] to-[#120f0d] border-4 border-[#523e31] shadow-[0_5px_15px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-grab active:cursor-grabbing hover:border-[#d97706] transition-colors"
              onClick={() => handleFrequencyChange(selectedFreq + 0.2 > maxFreq ? minFreq : selectedFreq + 0.2)}
            >
              {/* Knurled Ridges */}
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#d97706]/40 flex items-center justify-center">
                <div
                  className="w-1 h-6 bg-red-500 rounded-full shadow-md"
                  style={{ transform: `rotate(${(selectedFreq - minFreq) * 18}deg)` }}
                />
              </div>
            </div>
            <span className="text-[9px] font-mono-tech text-[#8c7a6b] mt-1">CLICK / DRAG SLIDER</span>
          </div>
        </div>
      </div>
    </div>
  );
};
