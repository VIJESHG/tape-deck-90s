import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, FastForward, Rewind, ArrowUp, Sparkles, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { CassetteTape, PlaybackState } from '../types';
import { audioEngine } from '../lib/audioEngine';
import { getYouTubeThumbnailUrl } from './YouTubeAudioBackend';
import { DeskStickyNotesBar } from './DeskStickyNotes';

import cassetteAmberImg from '../assets/images/vintage_cassette_shell_amber_1786569287884.jpg';
import cassetteDarkImg from '../assets/images/vintage_cassette_shell_dark_1786569303742.jpg';
import cassetteRedImg from '../assets/images/vintage_cassette_shell_red_1786569318702.jpg';
import cassetteBlueImg from '../assets/images/vintage_cassette_shell_blue_1786569334437.jpg';

export const getRealisticCassetteImage = (tape: CassetteTape) => {
  if (tape.shellColor === 'red' || tape.genre === '90s Romance') {
    return cassetteRedImg;
  }
  if (tape.shellColor === 'black' || tape.genre === 'Bollywood Gold') {
    return cassetteDarkImg;
  }
  if (tape.shellColor === 'blue' || tape.genre === 'Indipop' || tape.genre === 'Western Hits') {
    return cassetteBlueImg;
  }
  return cassetteAmberImg;
};

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
  onFlipSide?: (newSide: 'A' | 'B') => void;
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
  onFlipSide,
}) => {
  const [pencilSpinning, setPencilSpinning] = useState(false);
  const [pencilTooltip, setPencilTooltip] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isInserting, setIsInserting] = useState(false);
  const [currentSide, setCurrentSide] = useState<'A' | 'B'>('A');
  const [isFlipping, setIsFlipping] = useState(false);

  // Reset side to A when cassette changes
  useEffect(() => {
    if (currentTape) {
      setCurrentSide('A');
    }
  }, [currentTape?.id]);

  const handleFlipSide = () => {
    audioEngine.playSwitchClick();
    setIsFlipping(true);
    const nextSide = currentSide === 'A' ? 'B' : 'A';
    setCurrentSide(nextSide);
    setTimeout(() => {
      setIsFlipping(false);
    }, 450);
    if (onFlipSide) {
      onFlipSide(nextSide);
    }
  };

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
    <div className="relative w-full max-w-6xl mx-auto my-6 p-4 sm:p-6 rounded-2xl shop-counter-desk border-4 border-t-[#523e30] border-l-[#3a2a1d] border-r-[#1e150f] border-b-[#0e0905] shadow-[0_35px_90px_rgba(0,0,0,0.98)]">
      {/* Compact Top Desk Sticky Notes Pinned on Wooden Counter */}
      <DeskStickyNotesBar />

      {/* Heavy Brushed Metal Main Hi-Fi Deck Chassis */}
      <div className="relative w-full rounded-xl chassis-brushed-metal p-5 sm:p-7 text-[#e8dfd8]">
        
        {/* Corner Metallic Screw Heads in Recessed Sockets */}
        <div className="absolute top-3 left-3 w-3.5 h-3.5 rounded-full bg-stone-700 border border-stone-500 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
          <div className="w-2.5 h-0.5 bg-stone-900 rotate-45" />
        </div>
        <div className="absolute top-3 right-3 w-3.5 h-3.5 rounded-full bg-stone-700 border border-stone-500 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
          <div className="w-2.5 h-0.5 bg-stone-900 -rotate-45" />
        </div>
        <div className="absolute bottom-3 left-3 w-3.5 h-3.5 rounded-full bg-stone-700 border border-stone-500 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
          <div className="w-2.5 h-0.5 bg-stone-900 rotate-12" />
        </div>
        <div className="absolute bottom-3 right-3 w-3.5 h-3.5 rounded-full bg-stone-700 border border-stone-500 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
          <div className="w-2.5 h-0.5 bg-stone-900 -rotate-30" />
        </div>

        {/* Top Brushed Aluminum Faceplate Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-5 border-b-2 border-[#3d2f25] gap-3">
          <div className="flex items-center gap-3">
            {/* T-Series Metallic Badge */}
            <div className="px-3.5 py-1 rounded bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#b45309] text-black font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center gap-1.5 font-mono-tech border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>Super Cassettes • T-Series</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-mono-tech text-[#f3e8dc] font-extrabold tracking-wider">
                MODEL CT-909 STEREO CASSETTE DECK
              </span>
              <span className="text-[10px] font-mono-tech text-[#a8988a] font-bold">
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
            <div className="relative w-full h-full bg-[#0a0806] p-4 sm:p-5 rounded-xl border border-[#2b2018] shadow-[inset_0_3px_15px_rgba(0,0,0,0.95)]">
              
              {/* Recessed Glass Door with Tilt Animation & Incandescent Backlight */}
              <div className={`relative w-full h-56 sm:h-60 rounded-lg bg-[#060504] border-2 border-[#3d2f25] p-4 flex flex-col justify-between overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.95)] transition-all duration-300 ${
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
                    {currentTape ? `${currentTape.brand} [SIDE ${currentSide}]` : 'NO CASSETTE INSERTED'}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* FLIP SIDE BUTTON in Chamber Header */}
                    <button
                      onClick={handleFlipSide}
                      className="px-2.5 py-1 rounded bg-[#18120d] hover:bg-[#281d14] border border-[#d97706] text-[#f59e0b] font-mono-tech font-extrabold text-[10px] tracking-wider uppercase shadow-md active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Flip Cassette Tape to Side B / Side A"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 text-[#d97706] ${isFlipping ? 'animate-spin' : ''}`} />
                      <span>FLIP SIDE ({currentSide})</span>
                    </button>

                    {/* 7-Segment Digital LED Timer */}
                    <div className="px-3 py-1 rounded bg-[#070504] border border-[#d97706]/70 text-[#f59e0b] font-mono-tech font-bold text-xs tracking-widest shadow-[inset_0_0_8px_rgba(0,0,0,0.9),0_0_12px_rgba(245,158,11,0.3)]">
                      ⏱️ {formatDigitalTime(playback.currentTime)}
                    </div>
                  </div>
                </div>

                {/* Physical Cassette Tape Shell with Reels & Adhesive Label */}
                {currentTape ? (
                  <div className={`relative w-full h-[155px] sm:h-[162px] my-auto rounded-lg p-2 transition-all z-10 flex flex-col justify-between overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_-2px_4px_rgba(0,0,0,0.8)] ${
                    isInserting ? 'animate-cassette-insert' : ''
                  } ${
                    isFlipping ? 'animate-tape-flip' : ''
                  } ${
                    currentTape.shellColor === 'gold' ? 'bg-[#2d2015] border-2 border-[#543b27] border-t-[#785338] border-b-[#140d07]' :
                    currentTape.shellColor === 'red' ? 'bg-[#291212] border-2 border-[#4f2020] border-t-[#733030] border-b-[#120707]' :
                    currentTape.shellColor === 'blue' ? 'bg-[#121c29] border-2 border-[#223348] border-t-[#324a6a] border-b-[#0a0f17]' :
                    currentTape.shellColor === 'black' ? 'bg-[#181818] border-2 border-[#333333] border-t-[#4a4a4a] border-b-[#0c0c0c]' :
                    'bg-[#202020]/90 border-2 border-[#404040]'
                  }`}>
                    {/* Photorealistic Cassette Photo Shell Background Texture */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-screen pointer-events-none z-0 rounded-lg scale-105"
                      style={{ backgroundImage: `url(${getRealisticCassetteImage(currentTape)})` }}
                    />
                    {/* Top Tactile Grip Ribs & Molded Shell Markings */}
                    <div className="w-full flex items-center justify-between px-3 text-[7px] font-mono-tech font-extrabold text-white/30 tracking-widest uppercase select-none border-b border-white/10 pb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-500/90 font-bold">[ SIDE {currentSide} ]</span>
                        <span className="hidden sm:inline text-white/20">HIGH BIAS TYPE II</span>
                      </div>
                      {/* Top Molded Plastic Ribs */}
                      <div className="flex gap-1 items-center opacity-30">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="w-1 h-1 bg-white rounded-full" />
                        ))}
                      </div>
                      <div>C-90 HIGH BIAS</div>
                    </div>

                    {/* Corner & Center Counter-Sunk Screw Holes */}
                    <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-[#0a0806] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] border border-white/10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-400 border border-stone-600 relative flex items-center justify-center">
                        <div className="w-1 h-0.5 bg-stone-900 rotate-45" />
                      </div>
                    </div>
                    <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#0a0806] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] border border-white/10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-400 border border-stone-600 relative flex items-center justify-center">
                        <div className="w-1 h-0.5 bg-stone-900 -rotate-45" />
                      </div>
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-[#0a0806] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] border border-white/10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-400 border border-stone-600 relative flex items-center justify-center">
                        <div className="w-1 h-0.5 bg-stone-900 rotate-12" />
                      </div>
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#0a0806] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] border border-white/10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-400 border border-stone-600 relative flex items-center justify-center">
                        <div className="w-1 h-0.5 bg-stone-900 -rotate-30" />
                      </div>
                    </div>
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#0a0806] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] border border-white/10 flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-400 border border-stone-600 relative flex items-center justify-center">
                        <div className="w-1 h-0.5 bg-stone-900 rotate-90" />
                      </div>
                    </div>

                    {/* Central Tape Window Bay for Spools & Adhesive Paper Label */}
                    <div className="relative w-full h-[105px] bg-[#070504] rounded border border-[#000000a0] p-1.5 flex items-center justify-between shadow-[inset_0_3px_10px_rgba(0,0,0,0.98)] overflow-hidden my-0.5">
                      {/* Window Sheen Highlight */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-20" />

                      {/* Tape Spool Left */}
                      <div className="relative flex items-center justify-center w-22 h-22 sm:w-24 sm:h-24 bg-[#0a0806] rounded-full border border-stone-800 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] overflow-hidden shrink-0">
                        {/* Dark Brown Magnetic Tape Pack Circle */}
                        <div
                          className="absolute rounded-full bg-gradient-to-r from-[#21150e] via-[#3a281b] to-[#17100b] border border-[#4a392c] transition-all duration-300 shadow-md"
                          style={{ width: `${leftSpoolRadius * 2}px`, height: `${leftSpoolRadius * 2}px` }}
                        />
                        {/* Authentic 6-Spoke White Plastic Reel Hub */}
                        <div className={`relative z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#f8f3e6] border-2 border-[#d6cbaf] flex items-center justify-center shadow-md ${
                          (playback.isPlaying || pencilSpinning) ? 'spin-reel' :
                          playback.isFastForwarding ? 'spin-reel-fast' :
                          playback.isRewinding ? 'spin-reel-reverse' : ''
                        }`}>
                          {[0, 60, 120, 180, 240, 300].map(deg => (
                            <div
                              key={deg}
                              className="absolute w-1 h-3.5 bg-[#8c7a6b] rounded-xs"
                              style={{ transform: `rotate(${deg}deg) translateY(-8px)` }}
                            />
                          ))}
                          <div className="w-3.5 h-3.5 bg-[#0a0806] rounded-full border border-stone-500 z-10 shadow-inner" />
                        </div>
                      </div>

                      {/* Authentic Warm Aged Paper Adhesive Sticker Label */}
                      <div className="flex-1 mx-1.5 sm:mx-2.5 h-[84px] bg-[#f8f4ea] rounded border border-[#cbba9f] p-1.5 flex flex-col justify-between relative shadow-md overflow-hidden text-stone-900 rotate-[-0.2deg] z-10">
                        {/* Classic Printed Color Stripe Header */}
                        <div className="w-full flex items-center justify-between text-[8px] font-mono-tech font-bold border-b border-stone-400 pb-0.5 leading-none">
                          <div className="flex items-center gap-1.5 text-[#b45309] truncate max-w-[120px] font-extrabold uppercase">
                            <span className="px-1 py-0.2 bg-[#3d2b20] text-amber-300 rounded-[2px] text-[7px] font-extrabold">SIDE {currentSide}</span>
                            <span>{currentTape.brand}</span>
                          </div>
                          <span className="text-stone-700 font-extrabold tracking-wider text-[7.5px] uppercase">
                            C-90 HIGH BIAS
                          </span>
                        </div>

                        {/* Label Body: Thumbnail / Handwritten Title & Track */}
                        <div className="flex items-center gap-2 my-0.5 min-w-0 flex-1">
                          {thumbnailUrl ? (
                            <div className="relative w-12 h-10 sm:w-14 sm:h-11 rounded bg-black overflow-hidden border border-[#b89f80] shrink-0 shadow-sm rotate-[-1deg]">
                              <img
                                src={thumbnailUrl}
                                alt={activeTrackInfo?.title || currentTape.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                            </div>
                          ) : null}

                          <div className="min-w-0 flex-1 flex flex-col justify-center">
                            <div className="font-handwritten text-xs sm:text-sm font-extrabold text-[#1a120b] truncate leading-tight">
                              {activeTrackInfo?.title || currentTape.title}
                            </div>
                            <div className="text-[9px] font-handwritten text-blue-900/80 truncate font-semibold">
                              {activeTrackInfo?.author || currentTape.artist}
                            </div>
                            {/* Handwritten Pen Write-in Line Accent */}
                            <div className="w-full border-b border-dashed border-stone-400/80 mt-0.5" />
                          </div>
                        </div>

                        {/* Footer Fine Print & Tape Formula */}
                        <div className="w-full flex items-center justify-between text-[6.5px] font-mono-tech text-stone-600 font-bold border-t border-stone-300 pt-0.5 leading-none uppercase tracking-tighter">
                          <span>HIGH DENSITY • COMPACT CASSETTE</span>
                          <span>{activeTrackInfo?.isPlaylist ? `TRK ${(activeTrackInfo.index || 0) + 1}/${activeTrackInfo.total || 1}` : 'STEREO'}</span>
                        </div>
                      </div>

                      {/* Tape Spool Right */}
                      <div className="relative flex items-center justify-center w-22 h-22 sm:w-24 sm:h-24 bg-[#0a0806] rounded-full border border-stone-800 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] overflow-hidden shrink-0">
                        {/* Dark Brown Magnetic Tape Pack Circle */}
                        <div
                          className="absolute rounded-full bg-gradient-to-r from-[#21150e] via-[#3a281b] to-[#17100b] border border-[#4a392c] transition-all duration-300 shadow-md"
                          style={{ width: `${rightSpoolRadius * 2}px`, height: `${rightSpoolRadius * 2}px` }}
                        />
                        {/* Authentic 6-Spoke White Plastic Reel Hub */}
                        <div className={`relative z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#f8f3e6] border-2 border-[#d6cbaf] flex items-center justify-center shadow-md ${
                          (playback.isPlaying || pencilSpinning) ? 'spin-reel' :
                          playback.isFastForwarding ? 'spin-reel-fast' :
                          playback.isRewinding ? 'spin-reel-reverse' : ''
                        }`}>
                          {[0, 60, 120, 180, 240, 300].map(deg => (
                            <div
                              key={deg}
                              className="absolute w-1 h-3.5 bg-[#8c7a6b] rounded-xs"
                              style={{ transform: `rotate(${deg}deg) translateY(-8px)` }}
                            />
                          ))}
                          <div className="w-3.5 h-3.5 bg-[#0a0806] rounded-full border border-stone-500 z-10 shadow-inner" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Molded Trapezoid Head Bay & Exposed Tape Strand */}
                    <div className="w-[62%] h-4 mx-auto bg-[#140e0a] border-t border-white/10 rounded-b shadow-inner relative flex items-center justify-between px-2 overflow-hidden">
                      {/* Exposed Magnetic Tape Strand running horizontally across head bay */}
                      <div className="absolute inset-x-2 h-2 bg-gradient-to-r from-[#21140a] via-[#3b2513] to-[#21140a] border-y border-[#4a331e] shadow-inner" />
                      {/* Guide Pins / Rollers */}
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-400 border border-stone-600 z-10 shadow-sm" />
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-400 border border-stone-600 z-10 shadow-sm" />
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

          {/* Right Side: Dual Illuminated Analog VU Meters & Pinned Paper Tracklist Note (5 Cols) */}
          <div className="md:col-span-5 flex flex-col justify-between gap-3">
            
            {/* Dual Illuminated Analog Peak Level VU Meters Box */}
            <div className="p-3 rounded-xl bg-[#0d0a08] border-2 border-[#3d2f25] shadow-[inset_0_0_15px_rgba(0,0,0,0.95)] flex flex-col gap-2">
              <div className="flex items-center justify-between text-[9px] font-mono-tech text-[#a8988a] font-black tracking-widest uppercase border-b border-[#2b2018] pb-1">
                <span>ANALOG PEAK LEVEL</span>
                <span className="text-amber-500">STEREO L • R</span>
              </div>

              {/* Dual Meters Frame */}
              <div className="grid grid-cols-2 gap-2">
                {/* LEFT VU METER */}
                <div className="relative h-20 rounded bg-[#f5ebd7] border-2 border-[#1f160e] p-1.5 flex flex-col justify-between overflow-hidden shadow-inner">
                  <div className="text-[7.5px] font-mono-tech font-bold text-stone-700 flex justify-between">
                    <span>-20 -10 -5 -3 0 +3 +5</span>
                    <span className="text-red-700 font-extrabold">VU</span>
                  </div>

                  {/* Arc scale marking */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 60">
                    <path d="M 15 45 A 35 35 0 0 1 85 45" stroke="#444" strokeWidth="1" fill="none" strokeDasharray="1 2" />
                    <line x1="75" y1="20" x2="82" y2="22" stroke="#dc2626" strokeWidth="1.5" />
                  </svg>

                  {/* Needle */}
                  <div
                    className="absolute bottom-1 left-1/2 w-0.5 h-12 bg-red-600 origin-bottom transition-transform duration-100 ease-out z-10"
                    style={{
                      transform: `translateX(-50%) rotate(${
                        playback.isPlaying && !playback.isPaused
                          ? -15 + Math.sin(Date.now() / 150) * 20 + Math.random() * 10
                          : -40
                      }deg)`
                    }}
                  />

                  <div className="z-10 text-[8px] font-mono-tech font-extrabold text-stone-800 text-center uppercase mt-auto">
                    VU
                  </div>
                </div>

                {/* RIGHT VU METER */}
                <div className="relative h-20 rounded bg-[#f5ebd7] border-2 border-[#1f160e] p-1.5 flex flex-col justify-between overflow-hidden shadow-inner">
                  <div className="text-[7.5px] font-mono-tech font-bold text-stone-700 flex justify-between">
                    <span>-20 -10 -5 -3 0 +3 +5</span>
                    <span className="text-red-700 font-extrabold">VU</span>
                  </div>

                  {/* Arc scale marking */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 60">
                    <path d="M 15 45 A 35 35 0 0 1 85 45" stroke="#444" strokeWidth="1" fill="none" strokeDasharray="1 2" />
                    <line x1="75" y1="20" x2="82" y2="22" stroke="#dc2626" strokeWidth="1.5" />
                  </svg>

                  {/* Needle */}
                  <div
                    className="absolute bottom-1 left-1/2 w-0.5 h-12 bg-red-600 origin-bottom transition-transform duration-100 ease-out z-10"
                    style={{
                      transform: `translateX(-50%) rotate(${
                        playback.isPlaying && !playback.isPaused
                          ? -12 + Math.cos(Date.now() / 140) * 18 + Math.random() * 8
                          : -40
                      }deg)`
                    }}
                  />

                  <div className="z-10 text-[8px] font-mono-tech font-extrabold text-stone-800 text-center uppercase mt-auto">
                    VU
                  </div>
                </div>
              </div>
            </div>

            {/* Pinned Paper J-Card Tracklist Note */}
            <div className="relative p-3.5 rounded-lg bg-[#fbf8f1] text-[#1c130b] shadow-2xl border border-[#d6cebe] rotate-[0.8deg] flex flex-col justify-between min-h-[160px]">
              {/* Yellow Tape Strips on Corners */}
              <div className="absolute -top-2 left-4 w-10 h-4 bg-[#fef08a]/80 border border-[#eab308]/40 rotate-[-6deg] shadow-xs" />
              <div className="absolute -top-2 right-4 w-10 h-4 bg-[#fef08a]/80 border border-[#eab308]/40 rotate-[8deg] shadow-xs" />

              {/* Note Title */}
              <div className="border-b border-stone-300 pb-1 mb-1.5 flex items-center justify-between">
                <h4 className="font-handwritten text-sm sm:text-base font-extrabold text-[#1a0f07] leading-tight truncate">
                  {currentTape ? currentTape.title : 'Kumar & Alka: 90s Romance Collection'}
                </h4>
                <span className="text-[9px] font-mono-tech font-bold text-red-600">99.5</span>
              </div>

              {/* Handwritten Tracklist Items */}
              <ol className="font-handwritten text-xs sm:text-sm text-[#1e3a8a] space-y-1 font-bold my-1">
                {currentTape ? (
                  (currentSide === 'A' ? currentTape.sideA : currentTape.sideB).slice(0, 4).map((track, idx) => (
                    <li key={idx} className="truncate">
                      <span className="text-stone-500 font-mono-tech text-[10px] mr-1">{idx + 1}.</span>
                      {track}
                    </li>
                  ))
                ) : (
                  <>
                    <li><span className="text-stone-500 font-mono-tech text-[10px] mr-1">1.</span> Mera Dil Bhi Kitna Pagal Hai</li>
                    <li><span className="text-stone-500 font-mono-tech text-[10px] mr-1">2.</span> Sochenge Tumhe Pyaar Karein</li>
                    <li><span className="text-stone-500 font-mono-tech text-[10px] mr-1">3.</span> Tumhein Dekhein Meri Aankhein</li>
                    <li><span className="text-stone-500 font-mono-tech text-[10px] mr-1">4.</span> Kitna Pyaara Tujhe Rab Ne Banaya</li>
                  </>
                )}
              </ol>

              {/* Bottom Note & Blue C-90 Badge */}
              <div className="pt-1.5 border-t border-dashed border-stone-300 flex items-end justify-between text-[9px] font-handwritten text-stone-600">
                <div className="leading-tight max-w-[170px] italic">
                  Recorded with T-Series Gold C-90 tape from Vishal Bhandari.
                </div>

                <div className="px-2 py-0.5 rounded bg-[#0284c7] text-white font-mono-tech font-black text-[10px] uppercase shadow-xs">
                  C-90
                </div>
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

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 sm:gap-2.5 w-full max-w-5xl">
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

            {/* FLIP SIDE */}
            <button
              onClick={handleFlipSide}
              className={`piano-key-btn py-3 sm:py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer ${
                currentSide === 'B' ? 'piano-key-pressed text-amber-300 border-amber-400' : 'text-[#d4c3b5]'
              }`}
              title="Flip Cassette Tape (Side A / B)"
            >
              <RotateCcw className={`w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-1 ${isFlipping ? 'animate-spin' : ''}`} />
              <span className="text-[9px] sm:text-[10px] font-mono-tech font-extrabold uppercase tracking-wider">FLIP ({currentSide})</span>
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
