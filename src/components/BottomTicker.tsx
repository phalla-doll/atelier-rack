import React, { useState } from 'react';
import { ArrowUpRight, Check, Sparkles, Mail } from 'lucide-react';
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
    }, 4000);
  };

  const tickerItems = [
    'DROP 04 / ARCHIVE EDITION NOW LIVE',
    'LIMITED TO 50–90 NUMBERED PIECES PER SILHOUETTE',
    'HEAVYWEIGHT 240–330 GSM JAPANESE & PERUVIAN TEXTILES',
    'NATURAL MINERAL PIGMENTS & BIO-POLISHED COTTON',
    'COMPLIMENTARY WORLDWIDE ARCHIVAL DISPATCH',
    'HAND-NUMBERED CERTIFICATES OF PROVENANCE INCLUDED',
    'DESIGNED & TESTED WITH PHYSICAL CLOTH DYNAMICS',
  ];

  return (
    <footer className="w-full z-20 bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Top Half of Footer: Repeating Marquee Ticker */}
      <div className="relative overflow-hidden py-2.5 border-b border-stone-800/80 bg-stone-950 flex items-center select-none">
        {/* Subtle gradient fades on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-stone-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-stone-950 to-transparent z-10 pointer-events-none" />

        <div className="animate-ticker flex items-center gap-8 whitespace-nowrap">
          {/* Repeating list twice for seamless infinite marquee loop */}
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 text-[11px] font-mono tracking-widest uppercase">
              <span className="text-stone-300 font-medium">{item}</span>
              <span className="text-amber-500/80 font-bold" aria-hidden="true">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Half of Footer: Newsletter Signup & Atelier Info */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Editorial statement */}
        <div className="flex items-center gap-3 text-xs text-stone-400">
          <span className="font-semibold text-stone-200">ATELIER ARCHIVE</span>
          <span>·</span>
          <span>Tokyo / Milan / Porto</span>
          <span>·</span>
          <span className="hidden sm:inline">Tactile Cloth Dynamics</span>
        </div>

        {/* Newsletter Signup Component */}
        <div className="w-full md:w-auto">
          {subscribed ? (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono py-1 px-3 bg-emerald-950/60 border border-emerald-800/80 rounded-lg">
              <Check className="w-3.5 h-3.5" />
              <span>Invitation dispatched. You are registered for the next release.</span>
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
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-800 text-stone-100 placeholder-stone-500 rounded-lg border border-stone-700 focus:outline-none focus:border-stone-400 font-mono transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-white text-stone-900 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer active:scale-95"
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
