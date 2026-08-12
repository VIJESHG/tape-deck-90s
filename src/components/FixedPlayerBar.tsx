import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc, Radio } from 'lucide-react';
import { AudioMode, CassetteTape, RadioStation, PlaybackState } from '../types';
import { audioEngine } from '../lib/audioEngine';
import { getYouTubeThumbnailUrl } from './YouTubeAudioBackend';

interface FixedPlayerBarProps {
  mode: AudioMode;
  currentTape: CassetteTape | null;
  currentStation: RadioStation | null;
  playback: PlaybackState;
  activeTrackInfo?: { title: string; author: string; videoId?: string; index?: number; total?: number; isPlaylist?: boolean } | null;
  setPlayback: React.Dispatch<React.SetStateAction<PlaybackState>>;
  onNext: () => void;
  onPrev: () => void;
}

export const FixedPlayerBar: React.FC<FixedPlayerBarProps> = ({
  mode,
  currentTape,
  currentStation,
  playback,
  activeTrackInfo,
  setPlayback,
  onNext,
  onPrev
}) => {
  const togglePlay = () => {
    audioEngine.playButtonSnap();
    setPlayback(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const toggleMute = () => {
    audioEngine.playSwitchClick();
    setPlayback(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setPlayback(prev => ({ ...prev, volume: val, isMuted: val === 0 }));
  };

  // Helper time formatter (e.g. 135 -> 02:15)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = playback.duration ? (playback.currentTime / playback.duration) * 100 : 0;

  const thumbnailUrl = mode === 'CASSETTE' && currentTape
    ? getYouTubeThumbnailUrl(currentTape.youtubeId, activeTrackInfo?.videoId)
    : null;

  const displayTitle = mode === 'CASSETTE'
    ? (activeTrackInfo?.title || (currentTape ? currentTape.title : 'No Tape Loaded'))
    : (currentStation ? currentStation.name : 'Air Radio Static');

  const displaySubtitle = mode === 'CASSETTE'
    ? (activeTrackInfo?.author
        ? `By ${activeTrackInfo.author} • ${currentTape?.brand || 'Custom Mixtape'}`
        : (currentTape ? `${currentTape.artist} • ${currentTape.brand}` : 'Select a cassette from shelves'))
    : (currentStation ? `${currentStation.callSign} • ${currentStation.location}` : '88.0 - 108.0 MHz');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#16110d]/95 backdrop-blur-xl border-t-2 border-[#3d2f25] px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.85)]">
      {/* Progress Bar Top Edge */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#2a1e16]">
        <div
          className="h-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] shadow-[0_0_10px_rgba(217,119,6,0.8)] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Track / Station Details */}
        <div className="flex items-center gap-3 min-w-0 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[#2a1e16] border border-[#d97706]/40 flex items-center justify-center shrink-0 shadow-inner overflow-hidden relative">
            {mode === 'CASSETTE' && thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={displayTitle}
                className={`w-full h-full object-cover ${playback.isPlaying ? 'brightness-105' : 'brightness-90'}`}
              />
            ) : mode === 'CASSETTE' ? (
              <Disc className={`w-5 h-5 text-[#f59e0b] ${playback.isPlaying ? 'animate-spin [animation-duration:3s]' : ''}`} />
            ) : (
              <Radio className="w-5 h-5 text-[#10b981] animate-pulse" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase ${
                mode === 'CASSETTE' ? 'bg-[#d97706]/20 text-[#f59e0b] border border-[#d97706]/30' : 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30'
              }`}>
                {mode === 'CASSETTE' ? 'TAPE DECK' : 'RADIO BROADCAST'}
              </span>
              <h4 className="text-xs font-bold font-mono-tech text-[#f3e8dc] truncate">
                {displayTitle}
              </h4>
            </div>
            <p className="text-[11px] font-typewriter text-[#a8988a] truncate">
              {displaySubtitle}
            </p>
          </div>
        </div>

        {/* Central Audio Transport Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              audioEngine.playButtonSnap();
              onPrev();
            }}
            className="p-2 rounded-lg bg-[#221a14] border border-[#3a2d24] text-[#a8988a] hover:text-white cursor-pointer active:scale-95"
            title="Previous Track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-[#d97706] hover:bg-[#b45309] text-black font-bold shadow-[0_0_15px_rgba(217,119,6,0.4)] cursor-pointer active:scale-95 transition-all"
            title={playback.isPlaying ? 'Pause' : 'Play'}
          >
            {playback.isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
          </button>

          <button
            onClick={() => {
              audioEngine.playButtonSnap();
              onNext();
            }}
            className="p-2 rounded-lg bg-[#221a14] border border-[#3a2d24] text-[#a8988a] hover:text-white cursor-pointer active:scale-95"
            title="Next Track"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Time Display */}
          <div className="hidden sm:block text-xs font-mono-tech text-[#d97706]">
            {formatTime(playback.currentTime)} / {formatTime(playback.duration || 240)}
          </div>
        </div>

        {/* Volume & Mute Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded bg-[#221a14] border border-[#3a2d24] text-[#a8988a] hover:text-white cursor-pointer"
          >
            {playback.isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#f59e0b]" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={playback.isMuted ? 0 : playback.volume}
            onChange={handleVolumeChange}
            className="w-20 sm:w-28 h-1.5 bg-[#2a1e16] rounded-lg appearance-none cursor-pointer accent-[#d97706]"
          />
        </div>
      </div>
    </div>
  );
};
