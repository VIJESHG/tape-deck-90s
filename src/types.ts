export type AudioMode = 'CASSETTE' | 'RADIO';

export type MusicGenre = 
  | '90s Romance'
  | 'Indipop'
  | 'Bollywood Gold'
  | 'Western Hits'
  | 'Ghazals & Unplugged'
  | 'Custom Mixtapes';

export interface CassetteTape {
  id: string;
  title: string;
  artist: string;
  era: string;
  genre: MusicGenre;
  releaseYear: number;
  brand: 'Super Cassettes (T-Series)' | 'TDK D-90' | 'Goldstar Chrome' | 'Sony HF-90' | 'Maxell XL-II';
  shellColor: 'clear' | 'gold' | 'black' | 'blue' | 'red';
  sideA: string[];
  sideB: string[];
  youtubeId: string;
  price: string;
  notes?: string;
  isCustom?: boolean;
}

export interface RadioStation {
  id: string;
  frequency: number; // e.g. 108.4
  callSign: string;  // e.g. "Aakashvani 108.4 FM"
  name: string;
  genre: MusicGenre;
  description: string;
  youtubeId: string;
  location: string;
  signalStrength: 'Strong' | 'Moderate' | 'Faint';
  band: 'FM' | 'SW';
}

export interface ShopMemory {
  id: string;
  speaker: string;
  quote: string;
  year: string;
  tag: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  isFastForwarding: boolean;
  isRewinding: boolean;
  isTuning: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  tapeHissEnabled: boolean;
  ambientLighting: 'dim' | 'cozy' | 'bright';
}
