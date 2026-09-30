import React, { useState, useEffect, useCallback } from 'react';
import { Garment } from '../types.ts';
import { GarmentRenderer } from './GarmentRenderer.tsx';
import { ChevronLeft, ChevronRight, X, RotateCw, CheckCircle2, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import { soundEngine } from '../utils/audio.ts';

interface GarmentDetailModalProps {
  garment: Garment;
  allGarments: Garment[];
  onClose: () => void;
  onNavigate: (newGarment: Garment) => void;
}

export const GarmentDetailModal: React.FC<GarmentDetailModalProps> = ({
  garment,
  allGarments,
  onClose,
  onNavigate,
}) => {
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');
  const [isReserved, setIsReserved] = useState<boolean>(false);
  const [reserveModalOpen, setReserveModalOpen] = useState<boolean>(false);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('L');

  const currentIndex = allGarments.findIndex((g) => g.id === garment.id);

  const goToPrevious = useCallback(() => {
    const prevIndex = (currentIndex - 1 + allGarments.length) % allGarments.length;
    soundEngine.playClothRustle(0.6);
    setViewSide('front');
    onNavigate(allGarments[prevIndex]);
  }, [currentIndex, allGarments, onNavigate]);

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % allGarments.length;
    soundEngine.playClothRustle(0.6);
    setViewSide('front');
    onNavigate(allGarments[nextIndex]);
  }, [currentIndex, allGarments, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (reserveModalOpen) {
          setReserveModalOpen(false);
        } else {
          soundEngine.playHangerClink(0.4);
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToPrevious, goToNext, reserveModalOpen]);

  const handleFlipView = () => {
    soundEngine.playClothRustle(0.4);
    setViewSide((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail) return;
    setIsReserved(true);
    setReserveModalOpen(false);
    soundEngine.playHangerClink(0.7);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${garment.name} detail view`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-stone-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Background Dim Backdrop (click to close) */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Detail Showcase Dialog Container */}
      <div
        className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-stone-300/80 overflow-hidden flex flex-col md:flex-row my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Close Button */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={onClose}
            aria-label="Close detail view"
            className="p-2 rounded-lg bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-300 shadow-2xs transition-all active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LEFT COLUMN: Garment 3D Pull-Forward Visualizer */}
        <div className="relative w-full md:w-1/2 min-h-[460px] md:min-h-[620px] flex flex-col items-center justify-center bg-gradient-to-b from-[#F2ECE1] to-[#E8E0D1] p-6 border-b md:border-b-0 md:border-r border-stone-300/70 overflow-hidden">
          {/* Subtle Pegboard grid in detail panel */}
          <div className="absolute inset-0 pegboard-bg opacity-35 pointer-events-none" />

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            aria-label="Previous garment"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-lg bg-white/90 hover:bg-white text-stone-800 shadow-2xs border border-stone-300 hover:border-stone-400 active:scale-95 transition-all flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={goToNext}
            aria-label="Next garment"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-lg bg-white/90 hover:bg-white text-stone-800 shadow-2xs border border-stone-300 hover:border-stone-400 active:scale-95 transition-all flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Rendered Interactive Garment in Full Detail Mode */}
          <div className="relative z-10 garment-detail-shadow transform hover:scale-[1.01] transition-transform duration-300">
            <GarmentRenderer
              garment={garment}
              isDetailed={true}
              viewSide={viewSide}
              isFrontFacing={true}
            />
          </div>

          {/* View Rotation Controls & Quick Indicators */}
          <div className="absolute bottom-4 z-20 flex items-center gap-2.5">
            <button
              onClick={handleFlipView}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-stone-800 text-xs font-medium shadow-2xs border border-stone-300 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-stone-600" />
              <span>Flip to {viewSide === 'front' ? 'Back View' : 'Front View'}</span>
            </button>
            <div className="px-2.5 py-1.5 rounded-lg bg-white/80 text-[11px] font-mono text-stone-600 border border-stone-300/80">
              {currentIndex + 1} / {allGarments.length}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Editorial Specifications, Craftsmanship & Availability */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[660px]">
          <div>
            {/* Top metadata tags conforming to Zero-Pill discipline */}
            <div className="flex items-center gap-2 text-xs text-stone-500 font-mono uppercase tracking-wider mb-2">
              <span>{garment.category.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span>{garment.edition}</span>
              <span aria-hidden="true">·</span>
              <span>{garment.fabric.origin}</span>
            </div>

            {/* Title & Price */}
            <div className="flex items-baseline justify-between gap-4 mb-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-['Syne',sans-serif] tracking-tight text-stone-900">
                {garment.name}
              </h2>
              <div className="text-2xl font-bold font-mono tabular-nums text-stone-900">
                ${garment.price}
              </div>
            </div>

            <p className="text-sm font-medium text-stone-600 mb-5">
              {garment.subtitle}
            </p>

            {/* Description & Narrative */}
            <div className="space-y-2.5 mb-5 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <p>{garment.description}</p>
              <p className="text-stone-500 text-xs italic border-l-2 border-stone-300 pl-3">
                "{garment.story}"
              </p>
            </div>

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                <span>Select Size</span>
                <span className="text-stone-400 font-mono font-normal">Relaxed Boxy Fit</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(['S', 'M', 'L', 'XL'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      soundEngine.playClothRustle(0.3);
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Textile & Sizing Spec Grid */}
            <div className="bg-white/80 rounded-xl border border-stone-200/90 p-4 mb-5 space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-y-2 text-stone-600">
                <div>
                  <span className="text-stone-400 block font-mono text-[10px] uppercase">Composition</span>
                  <span className="font-medium text-stone-800">{garment.fabric.material}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-mono text-[10px] uppercase">Fabric Weight</span>
                  <span className="font-medium text-stone-800 font-mono tabular-nums">{garment.fabric.weight}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-mono text-[10px] uppercase">Textile Finish</span>
                  <span className="font-medium text-stone-800">{garment.fabric.finish}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-mono text-[10px] uppercase">Colorway</span>
                  <span className="font-medium text-stone-800 flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block"
                      style={{ backgroundColor: garment.colorHex }}
                    />
                    {garment.colorName}
                  </span>
                </div>
              </div>

              {/* Garment Cut Measurements */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                <span>Chest: <strong className="text-stone-800">{garment.measurements.chest}</strong></span>
                <span>Length: <strong className="text-stone-800">{garment.measurements.length}</strong></span>
                <span>Shoulder: <strong className="text-stone-800">{garment.measurements.shoulder}</strong></span>
              </div>
            </div>
          </div>

          {/* Contiguous Purchase / Availability Module */}
          <div className="pt-4 border-t border-stone-200/80">
            {isReserved ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-800">
                  <div className="font-semibold text-emerald-900">
                    Piece Reserved for {customerEmail || 'Atelier Collector'}
                  </div>
                  <div>Size {selectedSize} is earmarked. Confirmation dispatched to inbox.</div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => setReserveModalOpen(true)}
                  className="w-full py-3 px-6 rounded-lg bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white font-medium text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-stone-300" />
                  <span>Reserve Garment ({garment.stock} Remaining in Batch)</span>
                </button>
                <div className="flex items-center justify-center gap-3 text-[11px] text-stone-500 font-mono">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-stone-400" /> Archival Grade
                  </span>
                  <span>·</span>
                  <span>Free Worldwide Courier</span>
                  <span>·</span>
                  <span>Numbered Certificate</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Reservation Checkout Modal */}
      {reserveModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Order confirmation modal"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-md bg-white rounded-xl p-6 shadow-2xl border border-stone-300 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">Acquire {garment.name}</h3>
              </div>
              <button
                onClick={() => setReserveModalOpen(false)}
                aria-label="Close reservation dialog"
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Securing Size <strong>{selectedSize}</strong> from <strong>{garment.edition}</strong> in{' '}
              <strong>{garment.colorName}</strong>. Hand-packed in cedar storage envelope.
            </p>

            <form onSubmit={handleReserveSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Shipping Destination
                </label>
                <select className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white">
                  <option>United States (2-3 business days)</option>
                  <option>Japan & East Asia (3-4 business days)</option>
                  <option>United Kingdom & Europe (2-4 business days)</option>
                  <option>Canada & Australia (4-6 business days)</option>
                </select>
              </div>

              <div className="bg-stone-50 rounded-lg p-3 text-xs text-stone-600 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="tabular-nums font-semibold">${garment.price}.00</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Archival Delivery:</span>
                  <span className="font-semibold text-emerald-700">COMPLIMENTARY</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setReserveModalOpen(false)}
                  className="w-1/3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg border border-stone-300 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  Confirm Reservation (${garment.price})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
