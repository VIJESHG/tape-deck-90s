/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AudioMode, CassetteTape, RadioStation, PlaybackState } from './types';
import { INITIAL_CASSETTES, RADIO_STATIONS, SHOP_MEMORIES } from './data/musicData';
import { HeaderBar } from './components/HeaderBar';
import { ModeSelectorSwitch } from './components/ModeSelectorSwitch';
import { CassetteDeckConsole } from './components/CassetteDeckConsole';
import { RadioConsole } from './components/RadioConsole';
import { CassetteRack } from './components/CassetteRack';
import { RotatingTicker } from './components/RotatingTicker';
import { MixtapeMakerModal } from './components/MixtapeMakerModal';
import { FixedPlayerBar } from './components/FixedPlayerBar';
import { YouTubeAudioBackend } from './components/YouTubeAudioBackend';
import { audioEngine } from './lib/audioEngine';

export default function App() {
  const [mode, setMode] = useState<AudioMode>('CASSETTE');
  const [tapes, setTapes] = useState<CassetteTape[]>(INITIAL_CASSETTES);
  const [currentTape, setCurrentTape] = useState<CassetteTape | null>(INITIAL_CASSETTES[0]);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(RADIO_STATIONS[0]);
  const [isMixtapeModalOpen, setIsMixtapeModalOpen] = useState(false);

  // YouTube Playlist & Player Navigation state
  const [seekTargetTime, setSeekTargetTime] = useState<number | null>(null);
  const [skipSignal, setSkipSignal] = useState<{ action: 'NEXT' | 'PREV'; timestamp: number } | null>(null);
  const [activeTrackInfo, setActiveTrackInfo] = useState<{ title: string; author: string; videoId?: string; index?: number; total?: number; isPlaylist?: boolean } | null>(null);

  const [playback, setPlayback] = useState<PlaybackState>({
    isPlaying: true,
    isPaused: false,
    isFastForwarding: false,
    isRewinding: false,
    isTuning: false,
    currentTime: 0,
    duration: 240,
    volume: 80,
    isMuted: false,
    tapeHissEnabled: false,
    ambientLighting: 'cozy'
  });

  // Tape Handlers
  const handleSelectTape = (tape: CassetteTape) => {
    setCurrentTape(tape);
    setActiveTrackInfo(null);
    setSeekTargetTime(null);
    setPlayback(prev => ({ ...prev, isPlaying: true, currentTime: 0 }));
  };

  const handleSelectStation = (station: RadioStation) => {
    setCurrentStation(station);
    setActiveTrackInfo(null);
    setSeekTargetTime(null);
    setPlayback(prev => ({ ...prev, isPlaying: true }));
  };

  const handleCreateMixtape = (newTape: CassetteTape) => {
    setTapes(prev => [newTape, ...prev]);
    setCurrentTape(newTape);
    setMode('CASSETTE');
    setActiveTrackInfo(null);
    setSeekTargetTime(null);
    setPlayback(prev => ({ ...prev, isPlaying: true, currentTime: 0 }));
  };

  // Next / Prev track (Handles both YouTube playlists and Cassette rack items)
  const handleNext = () => {
    if (mode === 'CASSETTE') {
      if (activeTrackInfo?.isPlaylist) {
        setSkipSignal({ action: 'NEXT', timestamp: Date.now() });
      } else {
        const idx = tapes.findIndex(t => t.id === currentTape?.id);
        const nextTape = tapes[(idx + 1) % tapes.length];
        handleSelectTape(nextTape);
      }
    } else {
      const idx = RADIO_STATIONS.findIndex(s => s.id === currentStation?.id);
      const nextStation = RADIO_STATIONS[(idx + 1) % RADIO_STATIONS.length];
      handleSelectStation(nextStation);
    }
  };

  const handlePrev = () => {
    if (mode === 'CASSETTE') {
      if (activeTrackInfo?.isPlaylist) {
        setSkipSignal({ action: 'PREV', timestamp: Date.now() });
      } else {
        const idx = tapes.findIndex(t => t.id === currentTape?.id);
        const prevTape = tapes[(idx - 1 + tapes.length) % tapes.length];
        handleSelectTape(prevTape);
      }
    } else {
      const idx = RADIO_STATIONS.findIndex(s => s.id === currentStation?.id);
      const prevStation = RADIO_STATIONS[(idx - 1 + RADIO_STATIONS.length) % RADIO_STATIONS.length];
      handleSelectStation(prevStation);
    }
  };

  // Current active YouTube ID depending on mode
  const currentYoutubeId = mode === 'CASSETTE'
    ? (currentTape ? currentTape.youtubeId : 'bL43s8G1e58')
    : (currentStation ? currentStation.youtubeId : '99_4T6iS_2E');

  // Background color based on shop ambient lighting
  const bgLightingClass = playback.ambientLighting === 'dim'
    ? 'bg-[#0c0a08]'
    : playback.ambientLighting === 'bright'
    ? 'bg-[#1e1915]'
    : 'bg-[#14100c]';

  return (
    <div className={`min-h-screen ${bgLightingClass} text-[#e8dfd8] relative pb-28 transition-colors duration-500`}>
      {/* Header Bar */}
      <HeaderBar
        playback={playback}
        setPlayback={setPlayback}
        onOpenMixtapeMaker={() => setIsMixtapeModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {/* Mode Selector Switch */}
        <ModeSelectorSwitch
          mode={mode}
          onModeChange={newMode => setMode(newMode)}
        />

        {/* Central Dual-Mode Audio Console */}
        {mode === 'CASSETTE' ? (
          <CassetteDeckConsole
            currentTape={currentTape}
            playback={playback}
            activeTrackInfo={activeTrackInfo}
            onPlay={() => setPlayback(p => ({ ...p, isPlaying: true }))}
            onPause={() => setPlayback(p => ({ ...p, isPlaying: false }))}
            onStop={() => setPlayback(p => ({ ...p, isPlaying: false, currentTime: 0 }))}
            onEject={() => {
              setCurrentTape(null);
              setPlayback(p => ({ ...p, isPlaying: false }));
            }}
            onFastForward={() => {
              const target = Math.min(playback.duration || 240, playback.currentTime + 15);
              setSeekTargetTime(target);
              setPlayback(p => ({ ...p, currentTime: target }));
            }}
            onRewind={() => {
              const target = Math.max(0, playback.currentTime - 15);
              setSeekTargetTime(target);
              setPlayback(p => ({ ...p, currentTime: target }));
            }}
            onNextTrack={handleNext}
            onPrevTrack={handlePrev}
            onFlipSide={() => setSeekTargetTime(0)}
          />
        ) : (
          <RadioConsole
            stations={RADIO_STATIONS}
            currentStation={currentStation}
            playback={playback}
            onSelectStation={handleSelectStation}
          />
        )}

        {/* Rotating Memories & Radio Announcements Ticker */}
        <RotatingTicker memories={SHOP_MEMORIES} />

        {/* 90s Cassette Wall & Mixtape Shelves */}
        <CassetteRack
          tapes={tapes}
          currentTapeId={currentTape?.id || null}
          onSelectTape={tape => {
            setMode('CASSETTE');
            handleSelectTape(tape);
          }}
          onOpenMixtapeMaker={() => setIsMixtapeModalOpen(true)}
        />
      </main>

      {/* Fixed Bottom Glassmorphism Player */}
      <FixedPlayerBar
        mode={mode}
        currentTape={currentTape}
        currentStation={currentStation}
        playback={playback}
        activeTrackInfo={activeTrackInfo}
        setPlayback={setPlayback}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      {/* Custom Mixtape Creator Modal */}
      <MixtapeMakerModal
        isOpen={isMixtapeModalOpen}
        onClose={() => setIsMixtapeModalOpen(false)}
        onCreateMixtape={handleCreateMixtape}
      />

      {/* Hidden YouTube IFrame Audio Engine */}
      <YouTubeAudioBackend
        youtubeId={currentYoutubeId}
        isPlaying={playback.isPlaying}
        volume={playback.isMuted ? 0 : playback.volume}
        seekTargetTime={seekTargetTime}
        skipSignal={skipSignal}
        onTimeUpdate={(currentTime, duration) => {
          setPlayback(p => ({ ...p, currentTime, duration }));
        }}
        onTrackInfoUpdate={info => {
          setActiveTrackInfo(info);
        }}
        onEnded={handleNext}
      />
    </div>
  );
}
