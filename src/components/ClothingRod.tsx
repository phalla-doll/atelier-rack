import React from 'react';

export const ClothingRod: React.FC = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto px-2 z-20 pointer-events-none select-none">
      {/* Wall Bracket - Left (Rectangular industrial plate with 2 screws matching reference image) */}
      <div className="absolute -left-1 -top-3 w-8 h-12 flex flex-col items-center justify-between z-10">
        <div className="w-6 h-12 rounded-sm bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 shadow-md border border-slate-300 flex flex-col items-center justify-between py-1.5">
          {/* Top screw */}
          <div className="w-2 h-2 rounded-full bg-slate-500 shadow-inner flex items-center justify-center border border-slate-400">
            <div className="w-1.2 h-0.5 bg-slate-700" />
          </div>
          {/* Central rod mounting collar socket */}
          <div className="w-5 h-4 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 rounded-sm shadow-inner" />
          {/* Bottom screw */}
          <div className="w-2 h-2 rounded-full bg-slate-500 shadow-inner flex items-center justify-center border border-slate-400">
            <div className="w-1.2 h-0.5 bg-slate-700" />
          </div>
        </div>
      </div>

      {/* Wall Bracket - Right (Rectangular industrial plate with 2 screws matching reference image) */}
      <div className="absolute -right-1 -top-3 w-8 h-12 flex flex-col items-center justify-between z-10">
        <div className="w-6 h-12 rounded-sm bg-gradient-to-r from-slate-400 via-slate-100 to-slate-300 shadow-md border border-slate-300 flex flex-col items-center justify-between py-1.5">
          {/* Top screw */}
          <div className="w-2 h-2 rounded-full bg-slate-500 shadow-inner flex items-center justify-center border border-slate-400">
            <div className="w-1.2 h-0.5 bg-slate-700" />
          </div>
          {/* Central rod mounting collar socket */}
          <div className="w-5 h-4 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 rounded-sm shadow-inner" />
          {/* Bottom screw */}
          <div className="w-2 h-2 rounded-full bg-slate-500 shadow-inner flex items-center justify-center border border-slate-400">
            <div className="w-1.2 h-0.5 bg-slate-700" />
          </div>
        </div>
      </div>

      {/* Main Horizontal Chrome Tube */}
      <div className="relative mx-4.5 h-4 rounded-full chrome-rod overflow-hidden">
        {/* Specular high-gloss highlight streak spanning entire length */}
        <div className="absolute top-[1px] left-0 right-0 h-[1.5px] bg-white/95 blur-[0.3px]" />
        <div className="absolute top-[3px] left-0 right-0 h-[0.75px] bg-white/40" />
        <div className="absolute bottom-[1.5px] left-0 right-0 h-[1px] bg-slate-900/70" />
      </div>

      {/* Soft Cast Shadow of the Chrome Tube onto the Pegboard Wall */}
      <div className="mx-6 h-4 bg-stone-900/15 blur-sm -mt-0.5 -z-10 rounded-full" />
    </div>
  );
};
