import React, { useState, useCallback } from 'react';
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // External impulses map for ripple physics waves across the rack
  const [impulses, setImpulses] = useState<Record<number, number>>({});

  const filteredGarments = GARMENTS.filter((g) => {
    if (filter === 'all') return true;
    return g.category === filter;
  });

  // Neighbor impulse propagation (when one shirt swings wide, it gently clinks its neighbors)
  const handleNeighborImpulse = useCallback((neighborIndex: number, impulse: number) => {
    setImpulses((prev) => ({
      ...prev,
      [neighborIndex]: (prev[neighborIndex] || 0) + impulse,
    }));

    setTimeout(() => {
      setImpulses((prev) => {
        const next = { ...prev };
        delete next[neighborIndex];
        return next;
      });
    }, 180);
  }, []);

  // "Simulate Breeze Wave" - ripples all garments along the rack sequentially
  const handleBreezeWave = useCallback(() => {
    soundEngine.playClothRustle(0.9);
    filteredGarments.forEach((_, idx) => {
      setTimeout(() => {
        const direction = (idx % 2 === 0 ? 1 : -1) * (4.2 - Math.random() * 1.2);
        setImpulses((prev) => ({
          ...prev,
          [idx]: direction,
        }));
        soundEngine.playHangerClink(0.22);

        setTimeout(() => {
          setImpulses((prev) => {
            const next = { ...prev };
            delete next[idx];
            return next;
          });
        }, 220);
      }, idx * 100);
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
    setHoveredIndex(null);
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
        onFilterChange={(f) => {
          setFilter(f);
          setHoveredIndex(null);
        }}
        onNudgeAll={handleBreezeWave}
      />

      {/* ---------------- 2. MAIN CENTERPIECE: THE PHYSICAL CLOTHING RACK ---------------- */}
      <main
        className={`flex-1 flex flex-col items-center justify-center relative py-6 md:py-10 transition-all duration-300 ${
          selectedGarment ? 'filter blur-sm pointer-events-none scale-[0.98]' : ''
        }`}
      >
        {/* Ambient Top Studio Lighting Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-48 bg-gradient-to-b from-white/70 via-white/20 to-transparent blur-3xl -z-10 pointer-events-none" />

        {/* Rack Header Narrative */}
        <div className="text-center mb-5 px-4">
          <div className="text-[11px] font-mono tracking-widest text-stone-500 uppercase mb-1">
            Permanent Studio Collection · 2026 Archive
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Syne',sans-serif] text-stone-900 tracking-tight">
            The Interactive Wardrobe
          </h1>
        </div>

        {/* Clothing Rod & Hanging Garments Section */}
        <div className="w-full max-w-5xl relative flex flex-col items-center px-4 sm:px-6">
          {/* Chrome Rod Mounted to the Wall */}
          <ClothingRod />

          {/* Hanging Garments Container with 3D Perspective */}
          <div
            className="w-full overflow-x-auto overflow-y-visible py-5 scrollbar-none flex justify-center"
            style={{ perspective: '1400px' }}
          >
            <div
              className="flex items-start justify-center min-w-max px-12 sm:px-24 pt-0.5"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {filteredGarments.map((garment, index) => (
                <GarmentPhysicsItem
                  key={garment.id}
                  garment={garment}
                  index={index}
                  totalGarments={filteredGarments.length}
                  isSelected={selectedGarment?.id === garment.id}
                  onSelect={(g) => setSelectedGarment(g)}
                  hoveredIndex={hoveredIndex}
                  onHoverChange={setHoveredIndex}
                  slotSpacing={78}
                  onNeighborImpulse={handleNeighborImpulse}
                  externalImpulse={impulses[index] || 0}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- 3. CALL-TO-ACTION & CONTROLS BELOW RACK ---------------- */}
        <div className="mt-2">
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
