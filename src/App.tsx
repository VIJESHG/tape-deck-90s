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
import { CassetteWallFullView } from './components/CassetteWallFullView';
import { RotatingTicker } from './components/RotatingTicker';
import { MixtapeMakerModal } from './components/MixtapeMakerModal';
import { FixedPlayerBar } from './components/FixedPlayerBar';
import { FooterDisclaimer } from './components/FooterDisclaimer';
import { YouTubeAudioBackend } from './components/YouTubeAudioBackend';
import { audioEngine } from './lib/audioEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('DECK');
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'RADIO') {
      setMode('RADIO');
    } else if (tab === 'DECK') {
      setMode('CASSETTE');
    }
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
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenMixtapeMaker={() => setIsMixtapeModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {activeTab === 'CASSETTE WALL' ? (
          /* Full 90s Cassette Wall Display View Matching Reference Image */
          <CassetteWallFullView
            tapes={tapes}
            currentTapeId={currentTape?.id || null}
            onSelectTape={tape => {
              setMode('CASSETTE');
              handleSelectTape(tape);
            }}
            onOpenMixtapeMaker={() => setIsMixtapeModalOpen(true)}
          />
        ) : activeTab === 'SHOP MEMORIES' ? (
          /* Shop Memories Dedicated View */
          <div className="max-w-4xl mx-auto my-6 p-6 rounded-2xl bg-[#ebd2b2] text-[#2b1d14] border-4 border-[#3d2a1d] shadow-2xl">
            <h2 className="text-2xl font-mono-tech font-extrabold uppercase mb-2 text-[#1a0e05]">
              📻 90s CASSETTE SHOP MEMORIES &amp; ANNOUNCEMENTS
            </h2>
            <p className="text-sm font-typewriter text-[#5c4028] mb-6">
              Recollections and listener request logs from 1990 to 1999.
            </p>
            <div className="space-y-4">
              {SHOP_MEMORIES.map(mem => (
                <div key={mem.id} className="p-4 rounded-lg bg-[#fdfbf7] border border-[#c9b49b] shadow-sm">
                  <div className="flex justify-between items-center text-xs font-mono-tech font-bold text-[#8c6b4f] mb-1">
                    <span>{mem.speaker}</span>
                    <span className="bg-[#ebd2b2] px-2 py-0.5 rounded border border-[#c9b49b]">{mem.year}</span>
                  </div>
                  <p className="font-handwritten text-lg font-bold text-[#1a0e05]">"{mem.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'ABOUT' ? (
          /* About Retro Shop View */
          <div className="max-w-3xl mx-auto my-6 p-6 rounded-2xl bg-[#f8f4ea] text-[#1c120a] border-4 border-[#3a271a] shadow-2xl font-typewriter">
            <h2 className="text-2xl font-mono-tech font-extrabold uppercase mb-3 text-[#1a0e05]">
              📼 ABOUT THE 90s CASSETTE SHOP
            </h2>
            <p className="text-sm leading-relaxed mb-4">
              Welcome to the 90s Cassette Shop! Step back in time to the golden era of magnetic audio tapes, Hi-Fi stereo decks, shortwave radio broadcasts, and handmade mixtapes.
            </p>
            <p className="text-sm leading-relaxed mb-4">
              Browse our 6-column Cassette Wall stocked with classic Romance, Indipop, Bollywood Gold, Ghazals, Western Hits, and Custom Mixtapes. Insert any tape into the Model CT-989 Hi-Fi Deck to hear authentic tape noise, mechanical button clicks, and vintage analog sound.
            </p>
            <div className="p-3 rounded bg-[#fef08a] border border-[#eab308] font-handwritten text-lg font-bold text-red-800">
              "Good music never gets old. Every tape has a story." ♡
            </div>
          </div>
        ) : (
          /* Default DECK / RADIO Main Console View */
          <>
            {/* Mode Selector Switch */}
            <ModeSelectorSwitch
              mode={mode}
              onModeChange={newMode => {
                setMode(newMode);
                setActiveTab(newMode === 'CASSETTE' ? 'DECK' : 'RADIO');
              }}
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
          </>
        )}

        {/* Footer Disclaimer & Contact Info */}
        <FooterDisclaimer />
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

