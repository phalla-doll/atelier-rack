import React, { useRef, useState, useCallback } from 'react';
import { Garment } from '../types.ts';
import { GarmentRenderer } from './GarmentRenderer.tsx';
import { soundEngine } from '../utils/audio.ts';

interface GarmentPhysicsItemProps {
  garment: Garment;
  index: number;
  totalGarments: number;
  isSelected: boolean;
  onSelect: (garment: Garment) => void;
  hoveredIndex: number | null;
  slotSpacing?: number;
  breezeImpulse?: number;
}

export const GarmentPhysicsItem: React.FC<GarmentPhysicsItemProps> = ({
  garment,
  index,
  totalGarments,
  isSelected,
  onSelect,
  hoveredIndex,
  slotSpacing = 78,
  breezeImpulse = 0,
}) => {
  const isCurrentHovered = hoveredIndex === index;

  // Dragging state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);

  // Calculate deterministic rail parting and 3D angle transforms
  let targetOffsetX = 0;
  let targetAngleY = -68; // side profile at rest
  let targetTranslateZ = 0;
  let targetAngleZ = 0;

  if (hoveredIndex !== null) {
    if (hoveredIndex === index) {
      // Hovered item: swivels to face FRONT (0 deg) and pulls forward
      targetAngleY = 0;
      targetTranslateZ = 46;
      targetOffsetX = 0;
    } else if (index < hoveredIndex) {
      // Items to the left part left
      const dist = hoveredIndex - index;
      targetOffsetX = -62 * Math.exp(-(dist - 1) * 0.7);
      targetAngleY = -72;
      targetTranslateZ = -6 * Math.exp(-dist);
    } else {
      // Items to the right part right
      const dist = index - hoveredIndex;
      targetOffsetX = 62 * Math.exp(-(dist - 1) * 0.7);
      targetAngleY = -64;
      targetTranslateZ = -6 * Math.exp(-dist);
    }
  }

  // Add breeze impulse if active
  if (breezeImpulse !== 0 && !isDragging) {
    targetAngleZ += breezeImpulse * 3.5;
    targetAngleY += breezeImpulse * 4.0;
  }

  // Apply drag displacement if currently dragging
  if (isDragging) {
    targetOffsetX += dragOffset.x * 0.5;
    targetAngleZ = Math.max(-28, Math.min(28, dragOffset.x * 0.28));
    targetAngleY = Math.max(-80, Math.min(45, (isCurrentHovered ? 0 : -68) + dragOffset.x * 0.35));
    targetTranslateZ = Math.max(0, targetTranslateZ + 15);
  }

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();

    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setDragOffset({ x: 0, y: 0 });

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    soundEngine.playHangerClink(0.4);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMovedRef.current = true;
    }
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (!hasMovedRef.current) {
      soundEngine.playClothRustle(0.6);
      onSelect(garment);
    } else {
      soundEngine.playHangerClink(0.45);
    }
  };

  // Dynamic drop shadow width based on angle
  const radY = (targetAngleY * Math.PI) / 180;
  const frontRatio = Math.abs(Math.cos(radY)); // 0 = side, 1 = front
  const shadowWidth = 52 + frontRatio * 135;
  const shadowOpacity = 0.14 + frontRatio * 0.08;

  return (
    <div
      style={{
        width: `${slotSpacing}px`,
        perspective: '1200px',
      }}
      className="relative flex flex-col items-center flex-shrink-0 select-none z-10"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* 3D SWINGING & SWIVELING GARMENT ASSEMBLY (Compositor GPU Transition - Zero Stutter) */}
      <div
        style={{
          transformOrigin: '50% 12px',
          transformStyle: 'preserve-3d',
          transform: `
            translateX(${targetOffsetX.toFixed(1)}px)
            translateZ(${targetTranslateZ.toFixed(1)}px)
            rotateY(${targetAngleY.toFixed(1)}deg)
            rotateZ(${targetAngleZ.toFixed(1)}deg)
          `,
          transition: isDragging
            ? 'none'
            : 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
          willChange: 'transform',
        }}
        className={`relative ${
          isSelected ? 'opacity-25 pointer-events-none scale-95' : 'opacity-100'
        } ${isCurrentHovered ? 'z-40' : 'z-10'}`}
      >
        {/* Rod Contact Hook Glider on the Chrome Rod */}
        <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 w-2.5 h-4.5 bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600 rounded-full shadow-xs z-30 opacity-95 pointer-events-none" />

        {/* Dynamic drop shadow on pegboard wall */}
        <div
          className="absolute inset-0 bg-stone-900/18 rounded-3xl blur-xl -z-10 pointer-events-none"
          style={{
            transform: `translateX(${(-targetAngleZ * 1.4).toFixed(1)}px) translateY(14px)`,
            width: `${shadowWidth}px`,
            opacity: shadowOpacity,
            transition: isDragging ? 'none' : 'transform 0.42s ease, width 0.42s ease, opacity 0.42s ease',
            willChange: 'transform, width, opacity',
          }}
        />

        {/* Garment Renderer with Volumetric Side Profile and Front View */}
        <div style={{ transformStyle: 'preserve-3d' }}>
          <GarmentRenderer
            garment={garment}
            isDetailed={false}
            isFrontFacing={isCurrentHovered}
          />
        </div>
      </div>

      {/* Clean caption matching reference image (`Made This Tee — Black`) */}
      <div
        style={{
          transform: `translateX(${targetOffsetX.toFixed(1)}px)`,
          transition: isDragging ? 'none' : 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className={`absolute bottom-[-28px] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-300 z-50 ${
          isCurrentHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        <div className="text-[12px] sm:text-[13px] font-medium text-stone-700 tracking-tight whitespace-nowrap drop-shadow-xs">
          {garment.name} <span className="text-stone-400">—</span> {garment.colorName}
        </div>
        <div className="text-[10px] font-mono text-stone-400 tracking-wider">
          ${garment.price} · Click to inspect
        </div>
      </div>
    </div>
  );
};
