import React, { useState, useCallback, useRef } from 'react';
import { GARMENTS } from './data/garments.ts';
import { Garment } from './types.ts';
import { TopNav } from './components/TopNav.tsx';
import { ClothingRod } from './components/ClothingRod.tsx';
import { GarmentPhysicsItem } from './components/GarmentPhysicsItem.tsx';
import { GarmentDetailModal } from './components/GarmentDetailModal.tsx';
import { RackControls } from './components/RackControls.tsx';
import { BottomTicker } from './components/BottomTicker.tsx';
import { soundEngine } from './utils/audio.ts';

export default function App() {
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [filter, setFilter] = useState<'all' | 't-shirt' | 'long-sleeve'>('all');
  
  // External impulses map for ripple physics waves across the rack
  const [impulses, setImpulses] = useState<Record<number, number>>({});

  const filteredGarments = GARMENTS.filter((g) => {
    if (filter === 'all') return true;
    return g.category === filter;
  });

  // Neighbor impulse propagation (when one shirt swings, it nudges its neighbors)
  const handleNeighborImpulse = useCallback((neighborIndex: number, impulse: number) => {
    setImpulses((prev) => ({
      ...prev,
      [neighborIndex]: (prev[neighborIndex] || 0) + impulse,
    }));

    // Reset impulse after a short interval so new physics can trigger
    setTimeout(() => {
      setImpulses((prev) => {
        const next = { ...prev };
        delete next[neighborIndex];
        return next;
      });
    }, 150);
  }, []);

  // "Simulate Breeze Wave" - ripples all garments along the rack sequentially
  const handleBreezeWave = useCallback(() => {
    soundEngine.playClothRustle(0.9);
    filteredGarments.forEach((_, idx) => {
      setTimeout(() => {
        // Alternating wave impulse
        const direction = (idx % 2 === 0 ? 1 : -1) * (4.5 - Math.random() * 1.5);
        setImpulses((prev) => ({
          ...prev,
          [idx]: direction,
        }));
        soundEngine.playHangerClink(0.25);

        setTimeout(() => {
          setImpulses((prev) => {
            const next = { ...prev };
            delete next[idx];
            return next;
          });
        }, 200);
      }, idx * 110);
    });
  }, [filteredGarments]);

  // Pull forward the first or featured piece
  const handleInspectFeatured = useCallback(() => {
    if (filteredGarments.length > 0) {
      soundEngine.playClothRustle(0.6);
      setSelectedGarment(filteredGarments[0]);
    }
  }, [filteredGarments]);

  // Reset rack positions
  const handleResetRack = useCallback(() => {
    setImpulses({});
    soundEngine.playHangerClink(0.4);
  }, []);

  // When detail view closes, the rack background sharpens and the garments settle naturally
  const handleCloseDetail = useCallback(() => {
    setSelectedGarment(null);
    soundEngine.playHangerClink(0.3);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between pegboard-bg relative selection:bg-stone-800 selection:text-white">
      {/* ---------------- 1. TOP NAVIGATION BAR ---------------- */}
      <TopNav
        totalPieces={GARMENTS.length}
        activeFilter={filter}
        onFilterChange={setFilter}
        onNudgeAll={handleBreezeWave}
      />

      {/* ---------------- 2. MAIN CENTERPIECE: THE CLOTHING RACK ---------------- */}
      <main
        className={`flex-1 flex flex-col items-center justify-center relative py-6 md:py-10 transition-all duration-300 ${
          selectedGarment ? 'filter blur-sm pointer-events-none scale-[0.98]' : ''
        }`}
      >
        {/* Ambient Top Studio Lighting Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-44 bg-gradient-to-b from-white/60 via-white/20 to-transparent blur-2xl -z-10 pointer-events-none" />

        {/* Rack Header Narrative (subtle) */}
        <div className="text-center mb-6 px-4">
          <div className="text-[11px] font-mono tracking-widest text-stone-500 uppercase mb-1">
            Permanent Studio Collection · 2026 Archive
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Syne',sans-serif] text-stone-900 tracking-tight">
            The Interactive Wardrobe
          </h1>
        </div>

        {/* Clothing Rod & Hanging Garments Section */}
        <div className="w-full max-w-6xl relative flex flex-col items-center px-2 sm:px-6">
          {/* Chrome Rod Mounted to the Wall */}
          <ClothingRod />

          {/* Hanging Garments Container with Overflow Scroll on Smaller Screens */}
          <div className="w-full overflow-x-auto overflow-y-visible py-4 scrollbar-none flex justify-center">
            <div className="flex items-start justify-center min-w-max px-6 sm:px-12 pt-0.5">
              {filteredGarments.map((garment, index) => (
                <GarmentPhysicsItem
                  key={garment.id}
                  garment={garment}
                  index={index}
                  totalGarments={filteredGarments.length}
                  isSelected={selectedGarment?.id === garment.id}
                  onSelect={(g) => setSelectedGarment(g)}
                  onNeighborImpulse={handleNeighborImpulse}
                  externalImpulse={impulses[index] || 0}
                  rackSpacing={142}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- 3. CALL-TO-ACTION & CONTROLS BELOW RACK ---------------- */}
        <div className="mt-4">
          <RackControls
            onInspectFirst={handleInspectFeatured}
            onBreezeWave={handleBreezeWave}
            onResetRack={handleResetRack}
            selectedCount={filteredGarments.length}
          />
        </div>
      </main>

      {/* ---------------- 4. DETAILED CENTERED VIEW (WHEN SHIRT IS PULLED FORWARD) ---------------- */}
      {selectedGarment && (
        <GarmentDetailModal
          garment={selectedGarment}
          allGarments={filteredGarments}
          onClose={handleCloseDetail}
          onNavigate={(newGarment) => setSelectedGarment(newGarment)}
        />
      )}

      {/* ---------------- 5. REPEATING BOTTOM TICKER & NEWSLETTER SIGNUP ---------------- */}
      <BottomTicker />
    </div>
  );
}
