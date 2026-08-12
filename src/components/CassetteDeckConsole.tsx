import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, FastForward, Rewind, ArrowUp, Sparkles, SkipBack, SkipForward } from 'lucide-react';
import { CassetteTape, PlaybackState } from '../types';
import { audioEngine } from '../lib/audioEngine';
import { getYouTubeThumbnailUrl } from './YouTubeAudioBackend';

interface CassetteDeckConsoleProps {
  currentTape: CassetteTape | null;
  playback: PlaybackState;
  activeTrackInfo?: { title: string; author: string; videoId?: string; index?: number; total?: number; isPlaylist?: boolean } | null;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onEject: () => void;
  onFastForward: () => void;
  onRewind: () => void;
  onNextTrack?: () => void;
  onPrevTrack?: () => void;
}

export const CassetteDeckConsole: React.FC<CassetteDeckConsoleProps> = ({
  currentTape,
  playback,
  activeTrackInfo,
  onPlay,
  onPause,
  onStop,
  onEject,
  onFastForward,
  onRewind,
  onNextTrack,
  onPrevTrack,
}) => {
  const [pencilSpinning, setPencilSpinning] = useState(false);
  const [pencilTooltip, setPencilTooltip] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isInserting, setIsInserting] = useState(false);

  const activeVideoId = activeTrackInfo?.videoId;
  const thumbnailUrl = currentTape ? getYouTubeThumbnailUrl(currentTape.youtubeId, activeVideoId) : null;

  // Active latched button state tracking for physical piano keys
  const [pressedKey, setPressedKey] = useState<'NONE' | 'PLAY' | 'PAUSE' | 'REWIND' | 'FFWD' | 'STOP' | 'EJECT' | 'NEXT' | 'PREV'>('NONE');

  // Sync latched piano key state with playback prop
  useEffect(() => {
    if (playback.isPlaying) {
      if (playback.isPaused) {
        setPressedKey('PAUSE');
      } else if (playback.isRewinding) {
        setPressedKey('REWIND');
      } else if (playback.isFastForwarding) {
        setPressedKey('FFWD');
      } else {
        setPressedKey('PLAY');
      }
    } else {
      setPressedKey('NONE');
    }
  }, [playback.isPlaying, playback.isPaused, playback.isRewinding, playback.isFastForwarding]);

  // Trigger door animation when currentTape changes
  useEffect(() => {
    if (currentTape) {
      setIsDoorOpen(true);
      setIsInserting(true);
      const timer1 = setTimeout(() => {
        audioEngine.playDoorSnap();
        setIsDoorOpen(false);
      }, 300);
      const timer2 = setTimeout(() => {
        setIsInserting(false);
      }, 500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [currentTape?.id]);

  // Clickable Pencil interaction: manual tape spool winding
  const handlePencilClick = () => {
    audioEngine.playPencilWind();
    setPencilSpinning(true);
    setTimeout(() => {
      setPencilSpinning(false);
    }, 900);
  };

  // Format 7-segment digital timer display (e.g. 02:45)
  const formatDigitalTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Tape spool size calculation based on playback progress
  const progressRatio = playback.duration ? playback.currentTime / playback.duration : 0.2;
  const leftSpoolRadius = Math.max(16, 36 * (1 - progressRatio));
  const rightSpoolRadius = Math.max(16, 36 * progressRatio);

  // Dynamic Fluorescent VFD Spectrum & Equalizer State
  const [visualizerMode, setVisualizerMode] = useState<'SPECTRUM' | 'WAVEFORM' | 'MATRIX'>('SPECTRUM');
  const [isBassBoost, setIsBassBoost] = useState(true);
  const [isTapeHiss, setIsTapeHiss] = useState(false);
  const [isDolbyNR, setIsDolbyNR] = useState(true);
  const [vfdLevels, setVfdLevels] = useState<number[]>([15, 25, 45, 30, 60, 50, 40, 70, 55, 35, 20, 10]);

  // Animate Fluorescent VFD Audio Equalizer Bands
  useEffect(() => {
    if (!playback.isPlaying || playback.isPaused) {
      setVfdLevels([5, 8, 5, 8, 5, 8, 5, 8, 5, 8, 5, 8]);
      return;
    }

    const interval = setInterval(() => {
      setVfdLevels(prev =>
        prev.map((_, idx) => {
          // Low bands boosted if Bass Boost active
          const isLowFreq = idx < 4;
          const boostFactor = isLowFreq && isBassBoost ? 25 : 0;
          const base = 20 + Math.random() * 65 + boostFactor;
          return Math.min(100, Math.max(10, Math.floor(base)));
        })
      );
    }, 80);

    return () => clearInterval(interval);
  }, [playback.isPlaying, playback.isPaused, isBassBoost]);

  // Audio Enhancer Toggles with Sound Effects
  const toggleBassBoost = () => {
    audioEngine.playSwitchClick();
    setIsBassBoost(prev => !prev);
  };

  const toggleTapeHiss = () => {
    audioEngine.playSwitchClick();
    setIsTapeHiss(prev => {
      const next = !prev;
      audioEngine.toggleTapeHiss(next);
      return next;
    });
  };

  const toggleDolbyNR = () => {
    audioEngine.playSwitchClick();
    setIsDolbyNR(prev => !prev);
  };

  // Button Click Handlers with Physical Sound & Latched State
  const handlePlayKey = () => {
    audioEngine.playButtonSnap();
    setPressedKey('PLAY');
    onPlay();
  };

  const handlePauseKey = () => {
    audioEngine.playButtonSnap();
    setPressedKey('PAUSE');
    onPause();
  };

  const handleStopKey = () => {
    audioEngine.playButtonSnap();
    setPressedKey('STOP');
    setTimeout(() => setPressedKey('NONE'), 150);
    onStop();
  };

  const handleEjectKey = () => {
    audioEngine.playEjectPop();
    setPressedKey('EJECT');
    setIsDoorOpen(true);
    setTimeout(() => {
      setIsDoorOpen(false);
      setPressedKey('NONE');
    }, 400);
    onEject();
  };

  const handleRewindKey = () => {
    audioEngine.playButtonSnap();
    setPressedKey('REWIND');
    onRewind();
  };

  const handleFastForwardKey = () => {
    audioEngine.playButtonSnap();
    setPressedKey('FFWD');
    onFastForward();
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 p-4 sm:p-6 rounded-3xl shop-counter-desk border-4 border-[#3d2e23] shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
      {/* Heavy Brushed Metal Main Hi-Fi Deck Chassis */}
      <div className="relative w-full rounded-2xl chassis-brushed-metal p-5 sm:p-7 text-[#e8dfd8]">
        
        {/* Corner Metallic Screw Heads */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-stone-700 border border-stone-500 flex items-center justify-center shadow-sm">
          <div className="w-2 h-0.5 bg-stone-900 rotate-45" />
        </div>
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-stone-700 border border-stone-500 flex items-center justify-center shadow-sm">
          <div className="w-2 h-0.5 bg-stone-900 -rotate-45" />
        </div>
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-stone-700 border border-stone-500 flex items-center justify-center shadow-sm">
          <div className="w-2 h-0.5 bg-stone-900 rotate-12" />
        </div>
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-stone-700 border border-stone-500 flex items-center justify-center shadow-sm">
          <div className="w-2 h-0.5 bg-stone-900 -rotate-30" />
        </div>

        {/* Top Brushed Aluminum Faceplate Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-5 border-b-2 border-[#4a3b30] gap-3">
          <div className="flex items-center gap-3">
            {/* T-Series Metallic Badge */}
            <div className="px-3.5 py-1 rounded bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#b45309] text-black font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center gap-1.5 font-mono-tech border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>Super Cassettes • T-Series</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-mono-tech text-[#f3e8dc] font-extrabold tracking-wider">
                MODEL CT-909 STEREO CASSETTE DECK
              </span>
              <span className="text-[10px] font-mono-tech text-[#a8988a]">
                3-HEAD SYSTEM • DIRECT DRIVE • HIGH BIAS TYPE II
              </span>
            </div>
          </div>

          {/* Dolby & Maintenance Badges */}
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded bg-[#fef08a] text-black text-[10px] font-typewriter font-bold shadow-md transform -rotate-1 border border-yellow-500">
              ✓ TAPE HEAD CLEANED 1996
            </div>
            <div className="px-2.5 py-1 rounded bg-[#18120d] text-[#d97706] text-[10px] font-mono-tech border border-[#d97706]/50 font-bold shadow-inner">
              DOLBY B-C NR
            </div>
          </div>
        </div>

        {/* Center Main Deck Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Side: Recessed Plastic Glass Cassette Window & Chamber (7 Cols) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div className="relative w-full h-full bg-gradient-to-b from-[#0a0806] to-[#15100c] p-4 sm:p-5 rounded-2xl border-2 border-[#3d2f25] shadow-[inset_0_0_20px_rgba(0,0,0,0.95)]">
              
              {/* Recessed Glass Door with Tilt Animation & Incandescent Backlight */}
              <div className={`relative w-full h-56 sm:h-60 rounded-xl bg-[#080605] border-2 border-[#4a392c] p-4 flex flex-col justify-between overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.95)] transition-all duration-300 ${
                isDoorOpen ? 'door-open border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.3)]' : ''
              }`}>
                {/* Diagonal Glass Sheen Reflection Overlay */}
                <div className="absolute inset-0 glass-window-overlay z-30" />

                {/* Warm Incandescent Backlight Bulb Glow inside Chamber when Playing */}
                {(playback.isPlaying || currentTape) && (
                  <div className="absolute inset-0 incandescent-backlight pointer-events-none z-0" />
                )}

                {/* Cassette Door Header Bar & Digital LED Timer Counter */}
                <div className="flex items-center justify-between text-xs font-mono-tech z-20 border-b border-[#3a2d24] pb-2">
                  <span className="text-[#d97706] font-extrabold tracking-widest uppercase flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      playback.isPlaying ? 'bg-[#10b981] animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-red-800'
                    }`} />
                    {currentTape ? currentTape.brand : 'NO CASSETTE INSERTED'}
                  </span>

                  {/* 7-Segment Digital LED Timer */}
                  <div className="px-3 py-1 rounded bg-[#070504] border border-[#d97706]/70 text-[#f59e0b] font-mono-tech font-bold text-xs tracking-widest shadow-[inset_0_0_8px_rgba(0,0,0,0.9),0_0_12px_rgba(245,158,11,0.3)]">
                    ⏱️ {formatDigitalTime(playback.currentTime)}
                  </div>
                </div>

                {/* Physical Cassette Tape Shell with Reels & Adhesive Label */}
                {currentTape ? (
                  <div className={`relative w-full h-36 my-auto rounded-xl p-3.5 border-2 shadow-2xl flex items-center justify-between transition-all z-10 ${
                    isInserting ? 'animate-cassette-insert' : ''
                  } ${
                    currentTape.shellColor === 'gold' ? 'bg-[#3e2c1c] border-[#d97706]/80' :
                    currentTape.shellColor === 'red' ? 'bg-[#3b1717] border-red-800/80' :
                    currentTape.shellColor === 'blue' ? 'bg-[#1a2536] border-blue-800/80' :
                    currentTape.shellColor === 'black' ? 'bg-[#1a1a1a] border-gray-700' :
                    'bg-white/10 border-white/20 backdrop-blur-sm'
                  }`}>
                    {/* Corner Screw Highlights */}
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-stone-400 border border-stone-600" />
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-stone-400 border border-stone-600" />
                    <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-stone-400 border border-stone-600" />
                    <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-stone-400 border border-stone-600" />

                    {/* Tape Spool Left */}
                    <div className="relative flex items-center justify-center w-24 h-24 bg-[#120e0b] rounded-full border-2 border-amber-900/70 shadow-inner overflow-hidden">
                      {/* Magnetic Tape Wound Circle */}
                      <div
                        className="absolute rounded-full bg-gradient-to-r from-[#2b1f17] to-[#17100b] border border-[#4a392c] transition-all duration-300"
                        style={{ width: `${leftSpoolRadius * 2}px`, height: `${leftSpoolRadius * 2}px` }}
                      />
                      {/* White Plastic Gear Reel */}
                      <div className={`relative z-10 w-11 h-11 rounded-full bg-stone-200 border-2 border-stone-400 flex items-center justify-center shadow-md ${
                        (playback.isPlaying || pencilSpinning) ? 'spin-reel' :
                        playback.isFastForwarding ? 'spin-reel-fast' :
                        playback.isRewinding ? 'spin-reel-reverse' : ''
                      }`}>
                        <div className="w-3.5 h-3.5 bg-stone-900 rounded-full border border-stone-500" />
                        <div className="absolute w-full h-1 bg-stone-400" />
                        <div className="absolute w-1 h-full bg-stone-400" />
                      </div>
                    </div>

                    {/* Center Textured Adhesive Sticker Label */}
                    <div className="flex-1 mx-2 sm:mx-3 h-16 bg-[#f7eedc] rounded-lg border border-[#d4c1a5] p-1.5 flex items-center gap-2 relative shadow-md overflow-hidden text-stone-900">
                      {thumbnailUrl ? (
                        <>
                          <div className="relative w-14 h-12 rounded bg-black overflow-hidden border border-[#b89f80] shrink-0 shadow-sm">
                            <img
                              src={thumbnailUrl}
                              alt={activeTrackInfo?.title || currentTape.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                          </div>
                          <div className="min-w-0 flex-1 flex flex-col justify-between h-full py-0.5">
                            <div className="w-full flex items-center justify-between text-[9px] font-mono-tech font-extrabold border-b border-stone-400 pb-0.5 leading-none">
                              <span className="text-[#b45309] truncate max-w-[110px] font-bold">
                                {activeTrackInfo?.author || currentTape.brand}
                              </span>
                              <span className="text-stone-700 font-mono-tech text-[8px]">
                                {activeTrackInfo?.isPlaylist ? `TRK ${(activeTrackInfo.index || 0) + 1}/${activeTrackInfo.total || 1}` : 'YOUTUBE AUDIO'}
                              </span>
                            </div>
                            <div className="font-handwritten text-xs sm:text-sm font-bold text-[#1f1208] truncate">
                              {activeTrackInfo?.title || currentTape.title}
                            </div>
                            <div className="w-full h-1 bg-gradient-to-r from-[#3d2b20] via-[#5c4233] to-[#3d2b20] shadow-inner rounded-xs" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col justify-between">
                          <div className="w-full flex items-center justify-between text-[10px] font-mono-tech font-extrabold border-b border-stone-400 pb-0.5">
                            <span className="text-amber-800">{currentTape.brand}</span>
                            <span className="text-stone-700">C-90 HIGH BIAS</span>
                          </div>
                          <div className="font-handwritten text-base font-bold text-[#1f1208] truncate max-w-full">
                            {currentTape.title}
                          </div>
                          <div className="w-full h-2 bg-gradient-to-r from-[#3d2b20] via-[#5c4233] to-[#3d2b20] shadow-inner rounded-xs" />
                        </div>
                      )}
                    </div>

                    {/* Tape Spool Right */}
                    <div className="relative flex items-center justify-center w-24 h-24 bg-[#120e0b] rounded-full border-2 border-amber-900/70 shadow-inner overflow-hidden">
                      {/* Magnetic Tape Wound Circle */}
                      <div
                        className="absolute rounded-full bg-gradient-to-r from-[#2b1f17] to-[#17100b] border border-[#4a392c] transition-all duration-300"
                        style={{ width: `${rightSpoolRadius * 2}px`, height: `${rightSpoolRadius * 2}px` }}
                      />
                      {/* White Plastic Gear Reel */}
                      <div className={`relative z-10 w-11 h-11 rounded-full bg-stone-200 border-2 border-stone-400 flex items-center justify-center shadow-md ${
                        (playback.isPlaying || pencilSpinning) ? 'spin-reel' :
                        playback.isFastForwarding ? 'spin-reel-fast' :
                        playback.isRewinding ? 'spin-reel-reverse' : ''
                      }`}>
                        <div className="w-3.5 h-3.5 bg-stone-900 rounded-full border border-stone-500" />
                        <div className="absolute w-full h-1 bg-stone-400" />
                        <div className="absolute w-1 h-full bg-stone-400" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-36 my-auto rounded-xl bg-[#120f0d]/90 border-2 border-dashed border-[#3a2d24] flex flex-col items-center justify-center text-[#8c7a6b] font-mono-tech p-4 text-center z-10">
                    <p className="text-base font-extrabold text-[#d97706] uppercase tracking-wider">
                      DECK CHAMBER EMPTY
                    </p>
                    <p className="text-xs text-[#a8988a] mt-1">
                      SELECT A CASSETTE TAPE FROM THE WOODEN WALL RACK BELOW
                    </p>
                  </div>
                )}

                {/* Deck Door Bottom Text */}
                <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#8c7a6b] z-20 pt-1 border-t border-[#3a2d24]">
                  <span>DECK 1 • AUTO REVERSE</span>
                  <span>HIGH DENSITY PERMALLOY HEAD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Dual Illuminated Analog VU Meters & Paper J-Card Liner (5 Cols) */}
          <div className="md:col-span-5 flex flex-col gap-4 justify-between">
            
            {/* Illuminated Fluorescent VFD Digital Spectrum Analyzer & Audio Synthesizer */}
            <div className="p-3.5 rounded-2xl bg-[#090705] border-2 border-[#3d2f25] shadow-[inset_0_0_18px_rgba(0,0,0,0.95)] flex flex-col justify-between gap-3">
              {/* VFD Header */}
              <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#a8988a] font-bold tracking-wider uppercase border-b border-[#2b2018] pb-1.5">
                <div className="flex items-center gap-1.5 text-[#f59e0b]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin [animation-duration:6s]" />
                  <span>VFD DIGITAL SPECTRUM & EQ</span>
                </div>
                {/* Visualizer Mode Switcher */}
                <div className="flex items-center gap-1 bg-[#18120d] p-0.5 rounded-md border border-[#3d2f25] text-[9px]">
                  {(['SPECTRUM', 'WAVEFORM', 'MATRIX'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => {
                        audioEngine.playSwitchClick();
                        setVisualizerMode(mode);
                      }}
                      className={`px-1.5 py-0.5 rounded transition-all font-mono-tech font-extrabold cursor-pointer ${
                        visualizerMode === mode
                          ? 'bg-[#d97706] text-black shadow-sm'
                          : 'text-[#8c7a6b] hover:text-[#f59e0b]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glowing Vacuum Fluorescent Display Glass Screen */}
              <div className="relative h-28 rounded-xl bg-[#030d08] border-2 border-[#052e16] p-2.5 shadow-[inset_0_0_12px_rgba(16,185,129,0.2)] flex flex-col justify-between overflow-hidden">
                {/* Scanline Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

                {/* Top Status Bar in Glass */}
                <div className="flex items-center justify-between text-[9px] font-mono-tech text-[#10b981] font-extrabold z-10 leading-none">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${playback.isPlaying && !playback.isPaused ? 'bg-[#10b981] animate-ping' : 'bg-[#064e3b]'}`} />
                      {playback.isPlaying && !playback.isPaused ? 'ANALYZING HIGH-BIAS' : 'STANDBY'}
                    </span>
                    <span className="text-[#047857]">|</span>
                    <span className="text-[#34d399]">TYPE-II CHROME</span>
                  </div>
                  <div className="text-[#f59e0b] font-mono-tech">
                    {formatDigitalTime(playback.currentTime)}
                  </div>
                </div>

                {/* Display Body: Spectrum Bars / Waveform / Matrix */}
                <div className="relative h-16 flex items-end justify-between gap-1 z-10 px-1 my-1">
                  {visualizerMode === 'SPECTRUM' && (
                    <div className="w-full h-full flex items-end justify-between gap-1">
                      {vfdLevels.map((val, i) => (
                        <div key={i} className="flex-1 h-full flex flex-col justify-end gap-0.5">
                          {/* Segmented fluorescent LED bar */}
                          {Array.from({ length: 8 }).map((_, segIdx) => {
                            const segThreshold = (8 - segIdx) * 12.5;
                            const isActive = val >= segThreshold;
                            const isPeakRed = segIdx <= 1; // Top 2 segments are red
                            const isMidAmber = segIdx > 1 && segIdx <= 3;

                            return (
                              <div
                                key={segIdx}
                                className={`w-full h-1.5 rounded-xs transition-all duration-75 ${
                                  isActive
                                    ? isPeakRed
                                      ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                                      : isMidAmber
                                      ? 'bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.7)]'
                                      : 'bg-[#10b981] shadow-[0_0_5px_rgba(16,185,129,0.7)]'
                                    : 'bg-[#064e3b]/30'
                                }`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}

                  {visualizerMode === 'WAVEFORM' && (
                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 200 50">
                        <path
                          d={
                            playback.isPlaying && !playback.isPaused
                              ? `M 0 25 Q 25 ${25 - (vfdLevels[0] || 0) * 0.25}, 50 25 T 100 ${25 + (vfdLevels[4] || 0) * 0.25} T 150 25 T 200 25`
                              : 'M 0 25 L 200 25'
                          }
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          className="transition-all duration-75"
                        />
                      </svg>
                    </div>
                  )}

                  {visualizerMode === 'MATRIX' && (
                    <div className="w-full h-full grid grid-cols-12 gap-1 items-center">
                      {vfdLevels.map((val, i) => (
                        <div key={i} className="flex flex-col gap-1 items-center">
                          {Array.from({ length: 4 }).map((_, dotIdx) => {
                            const active = val > dotIdx * 25;
                            return (
                              <div
                                key={dotIdx}
                                className={`w-2 h-2 rounded-full transition-all duration-75 ${
                                  active
                                    ? dotIdx === 0
                                      ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)]'
                                      : 'bg-[#f59e0b] shadow-[0_0_6px_rgba(245,158,11,0.8)]'
                                    : 'bg-[#064e3b]/30'
                                }`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Glass Bottom Frequency Labels */}
                <div className="flex items-center justify-between text-[7px] font-mono-tech text-[#047857] font-bold z-10 uppercase">
                  <span>60Hz</span>
                  <span>150Hz</span>
                  <span>400Hz</span>
                  <span>1kHz</span>
                  <span>2.5kHz</span>
                  <span>6kHz</span>
                  <span>15kHz</span>
                </div>
              </div>

              {/* Interactive Retro Audio Enhancer Controls */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#2b2018]">
                {/* Dynamic Bass Boost */}
                <button
                  onClick={toggleBassBoost}
                  className={`p-1.5 rounded-lg border text-[9px] font-mono-tech font-extrabold flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all shadow-sm ${
                    isBassBoost
                      ? 'bg-[#d97706]/20 border-[#f59e0b] text-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                      : 'bg-[#18120d] border-[#3d2f25] text-[#8c7a6b] hover:text-[#d4c1a5]'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isBassBoost ? 'bg-[#f59e0b]' : 'bg-[#3d2f25]'}`} />
                    BASS BOOST
                  </span>
                  <span className="text-[8px] opacity-80">+6dB LOW EQ</span>
                </button>

                {/* Analog Tape Hiss */}
                <button
                  onClick={toggleTapeHiss}
                  className={`p-1.5 rounded-lg border text-[9px] font-mono-tech font-extrabold flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all shadow-sm ${
                    isTapeHiss
                      ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : 'bg-[#18120d] border-[#3d2f25] text-[#8c7a6b] hover:text-[#d4c1a5]'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isTapeHiss ? 'bg-[#10b981]' : 'bg-[#3d2f25]'}`} />
                    TAPE HISS
                  </span>
                  <span className="text-[8px] opacity-80">ANALOG WARMTH</span>
                </button>

                {/* Dolby NR */}
                <button
                  onClick={toggleDolbyNR}
                  className={`p-1.5 rounded-lg border text-[9px] font-mono-tech font-extrabold flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all shadow-sm ${
                    isDolbyNR
                      ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-[#60a5fa] shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                      : 'bg-[#18120d] border-[#3d2f25] text-[#8c7a6b] hover:text-[#d4c1a5]'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isDolbyNR ? 'bg-[#60a5fa]' : 'bg-[#3d2f25]'}`} />
                    DOLBY B-NR
                  </span>
                  <span className="text-[8px] opacity-80">NOISE REDUCTION</span>
                </button>
              </div>
            </div>

            {/* Authentic Unfolded Paper J-Card Tracklist Liner */}
            <div className="relative p-4 rounded-xl jcard-paper-liner text-[#2e1f14] shadow-2xl transform rotate-1 border-2 border-[#d4c1a5]">
              <div className="absolute top-2 right-2 text-[9px] font-mono-tech text-[#8c6b4f] uppercase tracking-widest font-extrabold border-b border-[#8c6b4f]">
                J-CARD PAPER LINER
              </div>

              <div className="font-handwritten text-2xl font-bold text-[#1f1208] mb-0.5 leading-tight truncate">
                {currentTape ? currentTape.title : 'My 90s Mixtape'}
              </div>
              <div className="text-xs font-typewriter text-[#523d2b] mb-1 font-bold truncate">
                Artist: {currentTape ? currentTape.artist : 'Select a cassette from shelf'}
              </div>

              {activeTrackInfo && activeTrackInfo.title && (
                <div className="my-1.5 p-2 rounded bg-[#3a2517]/10 border border-[#8c6b4f]/30 flex items-center gap-2.5">
                  {thumbnailUrl && (
                    <div className="relative w-12 h-12 rounded bg-black overflow-hidden border border-[#8c6b4f] shrink-0 shadow-sm">
                      <img src={thumbnailUrl} alt={activeTrackInfo.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono-tech text-[#8c6b4f] font-bold uppercase flex items-center justify-between">
                      <span>▶ NOW PLAYING AUDIO TRACK</span>
                      {activeTrackInfo.isPlaylist && (
                        <span className="bg-[#d97706] text-black px-1 rounded text-[9px] font-extrabold ml-1">
                          TRK {(activeTrackInfo.index || 0) + 1}/{activeTrackInfo.total || 1}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-handwritten font-bold text-[#d97706] truncate mt-0.5">
                      {activeTrackInfo.title}
                    </div>
                    {activeTrackInfo.author && (
                      <div className="text-[11px] font-typewriter text-[#523d2b] truncate">
                        By {activeTrackInfo.author}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Handwritten Tracklist */}
              <div className="border-t border-b border-[#d4be9c] py-2 my-1.5 font-handwritten text-base space-y-1 text-[#22140a] max-h-24 overflow-y-auto">
                {currentTape ? (
                  currentTape.sideA.map((track, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <span className="text-xs text-[#8c6b4f] font-mono-tech font-bold">{index + 1}.</span>
                      <span>{track}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm italic text-[#8c6b4f]">
                    No tape inserted. Pick a cassette below!
                  </div>
                )}
              </div>

              <div className="text-xs font-handwritten italic text-[#4a3423] mt-1 flex items-start gap-1">
                <span className="font-bold">Note:</span>
                <span>"{currentTape?.notes || 'Recorded off Vividh Bharati 90s FM!'}"</span>
              </div>
            </div>
          </div>
        </div>

        {/* PHYSICAL MECHANICAL PIANO-KEY PUSH BUTTONS (BOTTOM EDGE) */}
        <div className="mt-7 pt-5 border-t-2 border-[#4a3b30] flex flex-col items-center">
          <div className="text-[10px] font-mono-tech text-[#a8988a] uppercase tracking-widest mb-3 font-extrabold flex items-center gap-2">
            <span>HEAVY MECHANICAL TRANSPORT PUSH-KEYS</span>
            <span className="text-amber-500">• LATCH MECHANISM</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-2.5 w-full max-w-4xl">
            {/* EJECT */}
            <button
              onClick={handleEjectKey}
              className={`piano-key-btn py-3 sm:py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer ${
                pressedKey === 'EJECT' ? 'piano-key-pressed text-amber-400' : 'text-[#d4c3b5]'
              }`}
              title="Eject Cassette"
            >
              <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#d97706] mb-1" />
              <span className="text-[9px] sm:text-[10px] font-mono-tech font-extrabold uppercase tracking-wider">EJECT</span>
            </button>

            {/* PREV SONG */}
            <button
              onClick={() => {
                audioEngine.playButtonSnap();
                onPrevTrack?.();
              }}
              className={`piano-key-btn py-3 sm:py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer text-[#d4c3b5] hover:text-white`}
              title="Previous Track in Playlist"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-1" />
              <span className="text-[9px] sm:text-[10px] font-mono-tech font-extrabold uppercase tracking-wider">PREV</span>
            </button>

            {/* REWIND */}
            <button
              onClick={handleRewindKey}
              className={`piano-key-btn py-3 sm:py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer ${
                pressedKey === 'REWIND' ? 'piano-key-pressed text-amber-400 border-amber-500' : 'text-[#d4c3b5]'
              }`}
              title="Rewind 15 Seconds"
            >
              <Rewind className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
              <span className="text-[9px] sm:text-[10px] font-mono-tech font-extrabold uppercase tracking-wider">REW 15s</span>
            </button>

            {/* PLAY */}
            <button
              onClick={handlePlayKey}
              className={`piano-key-btn py-3 sm:py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer ${
                pressedKey === 'PLAY' ? 'piano-key-pressed text-amber-300 border-amber-400' : 'text-[#f59e0b]'
              }`}
              title="Play Tape"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current mb-1" />
              <span className="text-[9px] sm:text-[10px] font-mono-tech font-extrabold uppercase tracking-wider">PLAY</span>
            </button>

            {/* PAUSE */}
            <button
              onClick={handlePauseKey}
              className={`piano-key-btn py-3 sm:py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer ${
                pressedKey === 'PAUSE' ? 'piano-key-pressed text-amber-400 border-amber-500' : 'text-[#d4c3b5]'
              }`}
              title="Pause"
            >
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
              <span className="text-[9px] sm:text-[10px] font-mono-tech font-extrabold uppercase tracking-wider">PAUSE</span>
            </button>

            {/* STOP */}
            <button
              onClick={handleStopKey}
              className={`piano-key-btn py-3 sm:py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer ${
                pressedKey === 'STOP' ? 'piano-key-pressed text-red-400' : 'text-[#d4c3b5]'
              }`}
              title="Stop Playback"
            >
              <Square className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500 mb-1" />
              <span className="text-[9px] sm:text-[10px] font-mono-tech font-extrabold uppercase tracking-wider">STOP</span>
            </button>

            {/* FAST FWD */}
            <button
              onClick={handleFastForwardKey}
              className={`piano-key-btn py-3 sm:py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer ${
                pressedKey === 'FFWD' ? 'piano-key-pressed text-amber-400 border-amber-500' : 'text-[#d4c3b5]'
              }`}
              title="Fast Forward 15 Seconds"
            >
              <FastForward className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
              <span className="text-[9px] sm:text-[10px] font-mono-tech font-extrabold uppercase tracking-wider">FFWD 15s</span>
            </button>

            {/* NEXT SONG */}
            <button
              onClick={() => {
                audioEngine.playButtonSnap();
                onNextTrack?.();
              }}
              className={`piano-key-btn py-3 sm:py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer text-[#d4c3b5] hover:text-white`}
              title="Next Track in Playlist"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-1" />
              <span className="text-[9px] sm:text-[10px] font-mono-tech font-extrabold uppercase tracking-wider">NEXT</span>
            </button>
          </div>
        </div>
      </div>

      {/* TACTILE SHOP COUNTER DESK PROPS (HB PENCIL) */}
      <div className="mt-6 pt-4 border-t-2 border-[#3d2e23] flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-tech text-[#a8988a]">DESK COUNTER PROP:</span>
          <span className="text-xs font-typewriter text-[#d97706] font-bold uppercase">
            HB 2 WOODEN PENCIL
          </span>
        </div>

        {/* HB Wooden Pencil lying on desk */}
        <button
          onClick={handlePencilClick}
          onMouseEnter={() => setPencilTooltip(true)}
          onMouseLeave={() => setPencilTooltip(false)}
          className={`relative group px-4 py-2 rounded-xl bg-[#1c1510] border-2 border-[#d97706]/60 hover:border-[#d97706] transition-all flex items-center gap-3 cursor-pointer shadow-xl active:scale-95 ${
            pencilSpinning ? 'scale-105 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)]' : ''
          }`}
        >
          {/* Realistic Graphic of HB Wooden Pencil */}
          <div className={`flex items-center ${pencilSpinning ? 'animate-pencil-wind' : ''}`}>
            <div className="w-3 h-3.5 bg-pink-400 rounded-l-sm" /> {/* Eraser */}
            <div className="w-2 h-3.5 bg-yellow-600" /> {/* Brass ring */}
            <div className="w-16 h-3.5 bg-amber-500 flex items-center justify-center text-[8px] font-mono-tech text-black font-extrabold tracking-widest">
              HB 2
            </div>
            <div className="w-4 h-3.5 bg-amber-200 clip-pencil-tip flex items-center justify-end">
              <div className="w-1.5 h-1.5 bg-stone-900 rounded-full" />
            </div>
          </div>

          <span className="text-xs font-mono-tech text-[#f59e0b] font-extrabold uppercase tracking-wider">
            {pencilSpinning ? 'Winding Spool...' : 'Wind Tape Spool'}
          </span>

          {/* Tooltip */}
          {pencilTooltip && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-xl bg-[#fef08a] text-black text-xs font-typewriter whitespace-nowrap shadow-2xl border-2 border-amber-600 z-40 font-bold">
              ✏️ Insert HB pencil into cassette reel hub to wind tape manually!
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
