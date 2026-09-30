import React, { useState } from 'react';
import { Check, Mail } from 'lucide-react';
import { soundEngine } from '../utils/audio.ts';

export const BottomTicker: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    soundEngine.playHangerClink(0.4);
    setTimeout(() => {
      setEmail('');
    }, 4500);
  };

  const tickerItems = [
    'DROP 04 / ARCHIVE EDITION NOW AVAILABLE',
    'LIMITED TO 50–90 NUMBERED PIECES PER SILHOUETTE',
    'HEAVYWEIGHT 240–330 GSM JAPANESE & PERUVIAN TEXTILES',
    'NATURAL MINERAL CLAY PIGMENTS & BIO-POLISHED COTTON',
    'COMPLIMENTARY WORLDWIDE ARCHIVAL DISPATCH',
    'HAND-NUMBERED CERTIFICATES OF PROVENANCE INCLUDED',
    'PHYSICALLY SIMULATED 3D CLOTH DYNAMICS',
  ];

  return (
    <footer className="w-full z-20 bg-[#191918] text-stone-300 border-t border-stone-800/80">
      {/* Repeating Marquee Announcement Ticker */}
      <div className="relative overflow-hidden py-2.5 border-b border-stone-800/80 bg-[#141413] flex items-center select-none">
        {/* Subtle edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#141413] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#141413] to-transparent z-10 pointer-events-none" />

        <div className="animate-ticker flex items-center gap-8 whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 text-[10.5px] font-mono tracking-widest uppercase">
              <span className="text-stone-300 font-medium">{item}</span>
              <span className="text-amber-400/80 font-bold" aria-hidden="true">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Content & Unified Newsletter Form */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Clean Editorial Provenance */}
        <div className="flex items-center gap-2.5 text-xs text-stone-400 font-mono">
          <span className="font-semibold text-stone-200">ATELIER RACK</span>
          <span aria-hidden="true">·</span>
          <span>Tokyo / Milan / Porto</span>
          <span aria-hidden="true">·</span>
          <span className="hidden sm:inline">Tactile Cloth Dynamics</span>
        </div>

        {/* Newsletter Access Form */}
        <div className="w-full md:w-auto">
          {subscribed ? (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono py-1.5 px-3 bg-emerald-950/60 border border-emerald-800/80 rounded-lg">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Invitation dispatched. You are registered for private allocations.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-72">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="Private drop access (email)..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-800/90 text-stone-100 placeholder-stone-500 rounded-lg border border-stone-700/80 focus:outline-none focus:border-stone-400 font-mono transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-semibold bg-white hover:bg-stone-100 text-stone-900 rounded-lg shadow-2xs transition-all whitespace-nowrap cursor-pointer active:scale-98"
              >
                Join Access
              </button>
            </form>
          )}
        </div>
      </div>
    </footer>
  );
};
