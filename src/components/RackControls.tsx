import React from 'react';
import { Eye, Wind, RefreshCw, ArrowRight } from 'lucide-react';
import { Garment } from '../types.ts';

interface RackControlsProps {
  onInspectFirst: () => void;
  onBreezeWave: () => void;
  onResetRack: () => void;
  selectedCount: number;
}

export const RackControls: React.FC<RackControlsProps> = ({
  onInspectFirst,
  onBreezeWave,
  onResetRack,
  selectedCount,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 z-20 py-4 px-4 select-none">
      {/* Primary Centerpiece Call-To-Action Button below the rack */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onInspectFirst}
          className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all cursor-pointer"
        >
          <Eye className="w-4 h-4 text-stone-300 group-hover:scale-110 transition-transform" />
          <span>Examine Featured Piece</span>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
          </span>
        </button>

        {/* Secondary Tactile Action */}
        <button
          onClick={onBreezeWave}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 font-medium text-sm shadow-xs border border-stone-300/80 hover:border-stone-400 transition-all active:scale-95 cursor-pointer"
          title="Send a ripple wave through all hanging clothes"
        >
          <Wind className="w-4 h-4 text-stone-500" />
          <span>Simulate Breeze Wave</span>
        </button>
      </div>

      {/* Physics & Interaction Hint */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-stone-500 font-mono text-center">
        <span className="hidden sm:inline font-semibold text-stone-700">Real Rack Physics:</span>
        <span>Hangs side-profile</span>
        <span aria-hidden="true">·</span>
        <span>Hover to swivel front & part rack</span>
        <span aria-hidden="true">·</span>
        <span>Drag to swing & slide rail</span>
        <span aria-hidden="true">·</span>
        <span>Click to inspect</span>
      </div>
    </div>
  );
};
