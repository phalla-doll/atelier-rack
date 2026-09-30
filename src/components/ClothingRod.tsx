import React from 'react';

export const ClothingRod: React.FC = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 z-20 pointer-events-none select-none">
      {/* Wall Bracket - Left */}
      <div className="absolute left-2 -top-3 w-7 h-10 flex flex-col items-center justify-between z-10">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 shadow-md border border-slate-300 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80 shadow-inner" />
        </div>
        <div className="w-3 h-4 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 rounded-sm -mt-1 shadow-sm" />
      </div>

      {/* Wall Bracket - Right */}
      <div className="absolute right-2 -top-3 w-7 h-10 flex flex-col items-center justify-between z-10">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 shadow-md border border-slate-300 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80 shadow-inner" />
        </div>
        <div className="w-3 h-4 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 rounded-sm -mt-1 shadow-sm" />
      </div>

      {/* Main Horizontal Chrome Tube */}
      <div className="relative mx-5 h-4.5 rounded-full chrome-rod overflow-hidden">
        {/* Specular high-gloss highlight streak */}
        <div className="absolute top-[1.5px] left-0 right-0 h-[1.5px] bg-white/90 blur-[0.4px]" />
        <div className="absolute bottom-[2px] left-0 right-0 h-[1px] bg-slate-900/60" />
      </div>

      {/* Cast Shadow of the Rod onto the Pegboard Wall */}
      <div className="mx-6 h-5 bg-stone-900/18 blur-md -mt-1 -z-10 rounded-full" />
    </div>
  );
};
