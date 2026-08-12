import React, { useState } from 'react';
import { X, Sparkles, Disc, PenTool } from 'lucide-react';
import { CassetteTape, MusicGenre } from '../types';
import { audioEngine } from '../lib/audioEngine';

interface MixtapeMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMixtape: (newTape: CassetteTape) => void;
}

export const MixtapeMakerModal: React.FC<MixtapeMakerModalProps> = ({
  isOpen,
  onClose,
  onCreateMixtape
}) => {
  const [youtubeInput, setYoutubeInput] = useState('https://www.youtube.com/playlist?list=PL4fGSI1pTGlOE2K38xP21uP1a-29p-pQ8');
  const [title, setTitle] = useState('My 90s Monsoon Mixtape');
  const [artist, setArtist] = useState('Recorded by Me & Friends');
  const [genre, setGenre] = useState<MusicGenre>('Custom Mixtapes');
  const [brand, setBrand] = useState<'Super Cassettes (T-Series)' | 'TDK D-90' | 'Goldstar Chrome' | 'Sony HF-90' | 'Maxell XL-II'>('Super Cassettes (T-Series)');
  const [shellColor, setShellColor] = useState<'gold' | 'clear' | 'black' | 'blue' | 'red'>('gold');
  const [notes, setNotes] = useState('Recorded live off Vividh Bharati 90s radio broadcast.');
  const [sideA, setSideA] = useState('1. Pehla Nasha\n2. Made in India\n3. Chura Ke Dil Mera');
  const [sideB, setSideB] = useState('4. O Sanam\n5. Tip Tip Barsa Paani\n6. Dhoom Pichak Dhoom');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playEjectPop();

    const newTape: CassetteTape = {
      id: `custom-${Date.now()}`,
      title: title.trim() || 'Untitled 90s Mixtape',
      artist: artist.trim() || 'Custom Playlist',
      era: 'Late 90s',
      genre,
      releaseYear: 1996,
      brand,
      shellColor,
      price: 'FREE',
      youtubeId: youtubeInput.trim() || 'bL43s8G1e58',
      sideA: sideA.split('\n').filter(line => line.trim().length > 0),
      sideB: sideB.split('\n').filter(line => line.trim().length > 0),
      notes: notes.trim(),
      isCustom: true
    };

    onCreateMixtape(newTape);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#1e1712] border-2 border-[#523e31] rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3d2f25]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#d97706] text-black flex items-center justify-center">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-mono-tech text-[#f3e8dc] uppercase">
                1990S CUSTOM MIXTAPE STUDIO
              </h3>
              <p className="text-xs font-typewriter text-[#a8988a]">
                Customize your J-Card, tape brand, shell color &amp; fountain pen tracklist
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audioEngine.playButtonSnap();
              onClose();
            }}
            className="p-2 rounded-xl bg-[#2a1f18] text-[#8c7a6b] hover:text-white border border-[#3a2d24] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 font-mono-tech text-xs">
          {/* Title & Artist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#d97706] uppercase mb-1">Mixtape Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#120f0d] border border-[#3a2d24] text-[#f3e8dc] font-handwritten text-lg focus:border-[#d97706] outline-none"
                placeholder="e.g. Monsoon Hits 1996"
                required
              />
            </div>
            <div>
              <label className="block text-[#d97706] uppercase mb-1">Artist / Creator</label>
              <input
                type="text"
                value={artist}
                onChange={e => setArtist(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#120f0d] border border-[#3a2d24] text-[#f3e8dc] font-typewriter text-xs focus:border-[#d97706] outline-none"
                placeholder="e.g. Recorded by Alex"
                required
              />
            </div>
          </div>

          {/* YouTube Link or Playlist URL */}
          <div className="p-3.5 rounded-xl bg-[#140e0b] border border-[#d97706]/40">
            <label className="block text-[#f59e0b] uppercase font-bold mb-1 flex items-center justify-between">
              <span>🔗 YouTube Playlist or Video URL / ID</span>
              <span className="text-[10px] text-[#a8988a] font-normal font-mono-tech">Playlists supported!</span>
            </label>
            <input
              type="text"
              value={youtubeInput}
              onChange={e => setYoutubeInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0b0806] border border-[#3a2d24] text-[#f59e0b] font-mono-tech text-xs focus:border-[#d97706] outline-none"
              placeholder="Paste YouTube Playlist URL (e.g. https://www.youtube.com/playlist?list=PL...) or Video URL/ID"
              required
            />
            <p className="text-[10px] text-[#a8988a] font-typewriter mt-1.5">
              💡 Tip: Paste any full YouTube playlist link or video URL. The deck will load and play your audio directly inside the Hi-Fi cassette!
            </p>
          </div>

          {/* Brand & Shell Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#d97706] uppercase mb-1">Cassette Brand</label>
              <select
                value={brand}
                onChange={e => setBrand(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-[#120f0d] border border-[#3a2d24] text-[#f3e8dc] focus:border-[#d97706] outline-none"
              >
                <option value="Super Cassettes (T-Series)">Super Cassettes (T-Series)</option>
                <option value="TDK D-90">TDK D-90</option>
                <option value="Goldstar Chrome">Goldstar Chrome</option>
                <option value="Sony HF-90">Sony HF-90</option>
                <option value="Maxell XL-II">Maxell XL-II</option>
              </select>
            </div>
            <div>
              <label className="block text-[#d97706] uppercase mb-1">Shell Color</label>
              <div className="flex items-center gap-2 pt-1">
                {(['gold', 'clear', 'red', 'blue', 'black'] as const).map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setShellColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                      color === 'gold' ? 'bg-amber-500 border-amber-300' :
                      color === 'red' ? 'bg-red-600 border-red-300' :
                      color === 'blue' ? 'bg-blue-600 border-blue-300' :
                      color === 'black' ? 'bg-stone-900 border-stone-600' :
                      'bg-gray-200 border-gray-400'
                    } ${shellColor === color ? 'scale-125 ring-2 ring-[#d97706]' : 'opacity-70'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Side A and Side B */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#d97706] uppercase mb-1">Side A Tracklist (One per line)</label>
              <textarea
                value={sideA}
                onChange={e => setSideA(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-[#120f0d] border border-[#3a2d24] text-[#f3e8dc] font-handwritten text-base focus:border-[#d97706] outline-none"
              />
            </div>
            <div>
              <label className="block text-[#d97706] uppercase mb-1">Side B Tracklist (One per line)</label>
              <textarea
                value={sideB}
                onChange={e => setSideB(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-[#120f0d] border border-[#3a2d24] text-[#f3e8dc] font-handwritten text-base focus:border-[#d97706] outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[#d97706] uppercase mb-1">Fountain Pen J-Card Note</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#120f0d] border border-[#3a2d24] text-[#f3e8dc] font-handwritten text-base focus:border-[#d97706] outline-none"
              placeholder="e.g. Favorite track is #2!"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#3d2f25] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#2a1f18] text-[#a8988a] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-black font-bold uppercase shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Create &amp; Load Cassette</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
