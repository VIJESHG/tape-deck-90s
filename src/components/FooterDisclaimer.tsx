import React from 'react';
import { Info, Mail, Disc } from 'lucide-react';

export const FooterDisclaimer: React.FC = () => {
  return (
    <footer className="w-full max-w-6xl mx-auto mt-10 mb-28 p-5 sm:p-6 rounded-xl bg-[#1c140d]/90 border border-[#3d2a1d] text-[#c4b5a5] font-sans shadow-lg backdrop-blur-xs">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        
        {/* Left Side: Disclaimer Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono-tech font-bold uppercase tracking-wider text-amber-400">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>AUDIO STREAMING &amp; COPYRIGHT INFORMATION</span>
          </div>

          <p className="text-xs sm:text-sm font-typewriter text-[#d4c5b5] leading-relaxed">
            All audio playback on this platform streams directly through public embedded YouTube media players. No music files or proprietary audio data are hosted, stored, or distributed on our servers.
          </p>

          <p className="text-xs text-[#a89887] font-typewriter leading-relaxed">
            All musical rights, compositions, and master recordings remain the sole property of their respective record labels, original composers, and performers. Song credits and album details have been compiled for archival nostalgia from historical soundtrack listings.
          </p>
        </div>

        {/* Right Side: Contact Box */}
        <div className="w-full md:w-auto shrink-0 p-4 rounded-lg bg-[#2b1e14] border border-[#4a3424] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-mono-tech font-bold uppercase text-amber-300">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>CONTACT &amp; FEEDBACK</span>
          </div>

          <p className="text-xs text-[#b8a898] font-typewriter max-w-xs">
            For any inquiries, feedback, or content concerns, feel free to reach out:
          </p>

          <a
            href="mailto:mail.vijeshg@gmail.com"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono-tech font-bold transition-colors w-fit"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>mail.vijeshg@gmail.com</span>
          </a>
        </div>

      </div>

      <div className="mt-4 pt-3 border-t border-[#3a281b] flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono-tech text-[#8a7968] gap-2">
        <span>© 90s CASSETTE SHOP • VINTAGE HI-FI TAPE DECK EXPERIENCE</span>
        <span className="flex items-center gap-1">
          <Disc className="w-3 h-3 text-amber-500 animate-spin [animation-duration:12s]" />
          <span>PRESERVING ANALOG MUSIC MEMORIES</span>
        </span>
      </div>
    </footer>
  );
};
