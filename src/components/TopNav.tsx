import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, SlidersHorizontal, Info, X } from 'lucide-react';
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
      soundEngine.playHangerClink(0.5);
    }
  };

  return (
    <>
      <header className="relative w-full z-30 bg-[#F5F1E8]/90 backdrop-blur-md border-b border-stone-300/60 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* LEFT ZONE: Navigation Links & Filter Segments */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-lg text-xs font-medium">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-3 py-1 rounded-md transition-all whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Pieces ({totalPieces})
            </button>
            <button
              onClick={() => onFilterChange('t-shirt')}
              className={`px-3 py-1 rounded-md transition-all whitespace-nowrap ${
                activeFilter === 't-shirt'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              T-Shirts
            </button>
            <button
              onClick={() => onFilterChange('long-sleeve')}
              className={`px-3 py-1 rounded-md transition-all whitespace-nowrap ${
                activeFilter === 'long-sleeve'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Long-Sleeves
            </button>
          </nav>
        </div>

        {/* CENTER ZONE: Centered Brand Wordmark */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <a
            href="/"
            className="text-base sm:text-xl font-black font-['Syne',sans-serif] tracking-widest text-stone-900 hover:opacity-85 transition-opacity whitespace-nowrap"
          >
            ATELIER RACK
          </a>
          <span className="hidden sm:block text-[9px] font-mono tracking-widest text-stone-500 uppercase -mt-0.5">
            Apparel Physics Showcase
          </span>
        </div>

        {/* RIGHT ZONE: Audio Toggle & Studio Info */}
        <div className="flex items-center gap-3">
          {/* Quick Hanger Breeze Action */}
          <button
            onClick={onNudgeAll}
            title="Swing clothing rack"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white/70 hover:bg-white rounded-lg border border-stone-200/80 shadow-2xs transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Gentle Breeze</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Disable tactile sounds' : 'Enable tactile sounds'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-stone-700 bg-white/70 hover:bg-white rounded-lg border border-stone-200/80 shadow-2xs transition-all"
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

          {/* About / Manifesto Modal Trigger */}
          <button
            onClick={() => setAboutOpen(true)}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 transition-colors"
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
            className="w-full max-w-lg bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAboutOpen(false)}
              aria-label="Close about modal"
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100"
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
                <strong>ATELIER RACK</strong> reimagines digital e-commerce as a tactile physical environment.
                Garments hang from solid oak, walnut, and natural birch contoured hangers along a solid chrome wardrobe rail against a warm pegboard atelier wall.
              </p>
              <p>
                Every garment simulates real physical pendulum equations ($g/L \sin\theta$) coupled with cloth drag inertia. When cursor moves or drags a shirt, the hanger tilts, the fabric swerves and sways with natural damping, and realistic contact clinks resonate via Web Audio synthesis.
              </p>
              <p>
                Pulling any shirt forward isolates it in full focus, revealing high-density textile specifications, pattern origins, and limited run reservations.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 font-mono">
              <span>Tokyo · Milan · Porto</span>
              <button
                onClick={() => setAboutOpen(false)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
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
