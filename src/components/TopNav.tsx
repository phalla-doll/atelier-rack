import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Info, X } from 'lucide-react';
import { soundEngine } from '../utils/audio.ts';

interface TopNavProps {
  totalPieces: number;
  activeFilter: 'all' | 't-shirt' | 'long-sleeve';
  onFilterChange: (filter: 'all' | 't-shirt' | 'long-sleeve') => void;
  onNudgeAll: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  totalPieces,
  activeFilter,
  onFilterChange,
  onNudgeAll,
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.enabled = next;
    if (next) {
      soundEngine.playHangerClink(0.45);
    }
  };

  return (
    <>
      <header className="relative w-full z-30 bg-[#EDECE8]/80 backdrop-blur-md border-b border-stone-300/70 px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* LEFT ZONE: Segmented Filter Control */}
        <div className="flex items-center gap-3">
          <nav className="flex items-center p-0.5 bg-stone-200/80 rounded-lg border border-stone-300/50 text-xs font-medium">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Pieces ({totalPieces})
            </button>
            <button
              onClick={() => onFilterChange('t-shirt')}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 't-shirt'
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              T-Shirts
            </button>
            <button
              onClick={() => onFilterChange('long-sleeve')}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'long-sleeve'
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Long-Sleeves
            </button>
          </nav>
        </div>

        {/* CENTER ZONE: Brand Wordmark */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
          <a
            href="/"
            className="text-base sm:text-lg font-black font-['Syne',sans-serif] tracking-widest text-stone-900 hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            ATELIER RACK
          </a>
          <span className="hidden md:block text-[9px] font-mono tracking-widest text-stone-500 uppercase -mt-0.5">
            Cloth Dynamics Archive
          </span>
        </div>

        {/* RIGHT ZONE: Consistent Utility Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Hanger Breeze Action */}
          <button
            onClick={onNudgeAll}
            title="Simulate rack breeze wave"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white/90 hover:bg-white rounded-lg border border-stone-300 shadow-2xs transition-all active:scale-97 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Gentle Breeze</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Disable tactile audio' : 'Enable tactile audio'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-stone-700 bg-white/90 hover:bg-white rounded-lg border border-stone-300 shadow-2xs transition-all active:scale-97 cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-stone-800" />
                <span className="hidden md:inline">Audio: On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                <span className="hidden md:inline text-stone-400">Audio: Muted</span>
              </>
            )}
          </button>

          {/* Studio Info Modal Trigger */}
          <button
            onClick={() => setAboutOpen(true)}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 bg-white/90 hover:bg-white border border-stone-300 shadow-2xs transition-all cursor-pointer"
            aria-label="Studio Information"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* About Atelier Info Modal */}
      {aboutOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="About Atelier Studio"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs"
        >
          <div
            className="w-full max-w-lg bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-300 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAboutOpen(false)}
              aria-label="Close about modal"
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-1">
              Design Philosophy & Physics
            </div>
            <h3 className="text-xl font-bold font-['Syne',sans-serif] text-stone-900 mb-3">
              The Digital Clothing Rack
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <p>
                <strong>ATELIER RACK</strong> models the physical presence of a high-end designer showroom wardrobe rail.
                Clothes hang in true volumetric side-profile from solid oak, walnut, and natural birch contoured hangers along an industrial chrome rod.
              </p>
              <p>
                Hovering over any garment swivels it in 3D perspective to face forward, while adjacent garments dynamically part along the rail with spring-damped elasticity.
              </p>
              <p>
                Dragging simulates multi-axis physical pendulum swings, fabric lag, and synthesized acoustic wood-on-metal clinking.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 font-mono">
              <span>Tokyo · Milan · Porto</span>
              <button
                onClick={() => setAboutOpen(false)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors cursor-pointer font-medium"
              >
                Return to Rack
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
