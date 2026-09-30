import React from 'react';
import { Eye, Wind, ArrowRight } from 'lucide-react';

interface RackControlsProps {
  onInspectFirst: () => void;
  onBreezeWave: () => void;
  onResetRack: () => void;
  selectedCount: number;
}

export const RackControls: React.FC<RackControlsProps> = ({
  onInspectFirst,
  onBreezeWave,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-3.5 z-20 py-3 px-4 select-none">
      {/* Clean Cohesive Control Pair */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Primary Action Button */}
        <button
          onClick={onInspectFirst}
          className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-100 font-medium text-xs sm:text-sm shadow-xs hover:shadow-sm active:scale-98 transition-all cursor-pointer"
        >
          <Eye className="w-4 h-4 text-stone-300 group-hover:scale-105 transition-transform" />
          <span>Examine Featured Garment</span>
          <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Secondary Action Button */}
        <button
          onClick={onBreezeWave}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/90 hover:bg-white text-stone-800 hover:text-stone-900 font-medium text-xs sm:text-sm shadow-2xs border border-stone-300 hover:border-stone-400 transition-all active:scale-98 cursor-pointer"
          title="Send a ripple wave through all hanging garments"
        >
          <Wind className="w-4 h-4 text-stone-500" />
          <span>Simulate Breeze</span>
        </button>
      </div>

      {/* Clean Editorial Hint */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-stone-500 font-mono tracking-wide">
        <span className="font-semibold text-stone-700">Rack Controls:</span>
        <span>Hover to swivel & part rail</span>
        <span aria-hidden="true" className="text-stone-300">·</span>
        <span>Drag hanger to swing</span>
        <span aria-hidden="true" className="text-stone-300">·</span>
        <span>Click to inspect details</span>
      </div>
    </div>
  );
};
