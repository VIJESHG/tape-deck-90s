import React, { useEffect, useRef } from 'react';

interface YouTubeAudioBackendProps {
  youtubeId: string;
  isPlaying: boolean;
  volume: number;
  seekTargetTime?: number | null;
  skipSignal?: { action: 'NEXT' | 'PREV'; timestamp: number } | null;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onTrackInfoUpdate?: (info: { title: string; author: string; videoId?: string; index?: number; total?: number; isPlaylist: boolean }) => void;
  onEnded?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function parseYouTubeInput(input: string): { type: 'video' | 'playlist'; id: string } {
  if (!input) return { type: 'video', id: 'bL43s8G1e58' };
  const trimmed = input.trim();

  // 1. Check for playlist list= parameter in URL
  const listMatch = trimmed.match(/[?&]list=([^#&?]+)/);
  if (listMatch) {
    return { type: 'playlist', id: listMatch[1] };
  }

  // 2. Check for standalone Playlist ID (starts with PL, RD, FL, CL, OLAK5ve...)
  if (/^(PL|RD|FL|CL|OLAK5ve)[a-zA-Z0-9_-]+/.test(trimmed)) {
    return { type: 'playlist', id: trimmed };
  }

  // 3. Check for standard YouTube video URL (v=ID or youtu.be/ID)
  const videoMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (videoMatch) {
    return { type: 'video', id: videoMatch[1] };
  }

  // 4. Standalone 11-char Video ID
  if (/^[\w-]{11}$/.test(trimmed)) {
    return { type: 'video', id: trimmed };
  }

  return { type: 'video', id: trimmed };
}

export function getYouTubeThumbnailUrl(youtubeInput?: string, activeVideoId?: string): string | null {
  if (activeVideoId) {
    return `https://img.youtube.com/vi/${activeVideoId}/hqdefault.jpg`;
  }
  if (!youtubeInput) return null;
  const parsed = parseYouTubeInput(youtubeInput);
  if (parsed.type === 'video') {
    return `https://img.youtube.com/vi/${parsed.id}/hqdefault.jpg`;
  }
  return null;
}

export const YouTubeAudioBackend: React.FC<YouTubeAudioBackendProps> = ({
  youtubeId,
  isPlaying,
  volume,
  seekTargetTime,
  skipSignal,
  onTimeUpdate,
  onTrackInfoUpdate,
  onEnded
}) => {
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkTrackDetails = () => {
    if (!playerRef.current) return;
    try {
      if (playerRef.current.getVideoData) {
        const data = playerRef.current.getVideoData();
        const parsed = parseYouTubeInput(youtubeId);
        const isPlaylist = parsed.type === 'playlist';
        let index = 0;
        let total = 1;
        if (isPlaylist && playerRef.current.getPlaylist) {
          const list = playerRef.current.getPlaylist() || [];
          total = list.length || 1;
          if (playerRef.current.getPlaylistIndex) {
            index = playerRef.current.getPlaylistIndex();
          }
        }
        if (data && data.title && onTrackInfoUpdate) {
          onTrackInfoUpdate({
            title: data.title,
            author: data.author || '',
            videoId: data.video_id || (parsed.type === 'video' ? parsed.id : undefined),
            index,
            total,
            isPlaylist
          });
        }
      }
    } catch {
      // Ignore API ready state delay
    }
  };

  useEffect(() => {
    // Load YouTube IFrame API script if not already present
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    function initPlayer() {
      if (playerRef.current) return;

      const parsed = parseYouTubeInput(youtubeId);
      const playerConfig: any = {
        height: '0',
        width: '0',
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume);
            if (parsed.type === 'playlist' && event.target.loadPlaylist) {
              event.target.loadPlaylist({
                list: parsed.id,
                listType: 'playlist',
                index: 0
              });
            }
            if (isPlaying) {
              event.target.playVideo();
            }
            checkTrackDetails();
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING === 1 or BUFFERING === 3
            if (event.data === 1 || event.data === 3) {
              checkTrackDetails();
            }
            // YT.PlayerState.ENDED === 0
            if (event.data === 0) {
              const parsedCurrent = parseYouTubeInput(youtubeId);
              if (parsedCurrent.type === 'playlist' && event.target.nextVideo) {
                // Advance to next song in YouTube playlist
                event.target.nextVideo();
              } else if (onEnded) {
                onEnded();
              }
            }
          }
        }
      };

      if (parsed.type === 'playlist') {
        playerConfig.playerVars.listType = 'playlist';
        playerConfig.playerVars.list = parsed.id;
      } else {
        playerConfig.videoId = parsed.id;
      }

      playerRef.current = new window.YT.Player('yt-audio-player', playerConfig);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Update track or playlist when youtubeId changes
  useEffect(() => {
    if (!playerRef.current) return;
    const parsed = parseYouTubeInput(youtubeId);

    try {
      if (parsed.type === 'playlist') {
        if (playerRef.current.loadPlaylist) {
          playerRef.current.loadPlaylist({
            list: parsed.id,
            listType: 'playlist',
            index: 0
          });
          if (isPlaying && playerRef.current.playVideo) {
            playerRef.current.playVideo();
          }
        }
      } else {
        if (playerRef.current.loadVideoById) {
          playerRef.current.loadVideoById(parsed.id);
          if (isPlaying && playerRef.current.playVideo) {
            playerRef.current.playVideo();
          }
        }
      }
      setTimeout(() => checkTrackDetails(), 800);
    } catch {
      // Ignore initial YT async load delay
    }
  }, [youtubeId]);

  // Handle Seek Signal
  useEffect(() => {
    if (seekTargetTime !== undefined && seekTargetTime !== null && playerRef.current && playerRef.current.seekTo) {
      try {
        playerRef.current.seekTo(seekTargetTime, true);
      } catch {
        // Ignore seek error
      }
    }
  }, [seekTargetTime]);

  // Handle Playlist Skip Signal (Next / Prev Track)
  useEffect(() => {
    if (!skipSignal || !playerRef.current) return;
    const parsed = parseYouTubeInput(youtubeId);

    try {
      if (parsed.type === 'playlist') {
        if (skipSignal.action === 'NEXT' && playerRef.current.nextVideo) {
          playerRef.current.nextVideo();
        } else if (skipSignal.action === 'PREV' && playerRef.current.previousVideo) {
          playerRef.current.previousVideo();
        }
        setTimeout(() => checkTrackDetails(), 600);
      }
    } catch {
      // Ignore skip error
    }
  }, [skipSignal]);

  // Sync play/pause state
  useEffect(() => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch {
      // Ignore initial YT sync delay
    }
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  // Polling playback position for cassette reel speed & progress bar
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          const current = playerRef.current.getCurrentTime() || 0;
          const duration = playerRef.current.getDuration() || 240; // Fallback 4 mins
          if (onTimeUpdate) {
            onTimeUpdate(current, duration);
          }
          checkTrackDetails();
        }
      }, 500);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, onTimeUpdate]);

  return (
    <div className="hidden">
      <div id="yt-audio-player" />
    </div>
  );
};

