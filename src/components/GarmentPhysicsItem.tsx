import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Garment } from '../types.ts';
import { GarmentRenderer } from './GarmentRenderer.tsx';
import { soundEngine } from '../utils/audio.ts';

interface GarmentPhysicsItemProps {
  garment: Garment;
  index: number;
  totalGarments: number;
  isSelected: boolean;
  onSelect: (garment: Garment) => void;
  rackSpacing?: number;
  onNeighborImpulse?: (neighborIndex: number, impulse: number) => void;
  externalImpulse?: number;
}

export const GarmentPhysicsItem: React.FC<GarmentPhysicsItemProps> = ({
  garment,
  index,
  totalGarments,
  isSelected,
  onSelect,
  rackSpacing = 135,
  onNeighborImpulse,
  externalImpulse = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Physics state
  const [angle, setAngle] = useState<number>(0); // in degrees
  const [clothBend, setClothBend] = useState<number>(0); // -1 to 1 lag factor
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [slideOffset, setSlideOffset] = useState<number>(0); // small slide along rod

  // Refs for animation frame loop
  const angleRef = useRef<number>(0);
  const angularVelocityRef = useRef<number>(0);
  const clothBendRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startAngle: number; startSlide: number }>({
    mouseX: 0,
    mouseY: 0,
    startAngle: 0,
    startSlide: 0,
  });
  const prevMouseXRef = useRef<number>(0);
  const mouseVelocityRef = useRef<number>(0);
  const lastClinkTimeRef = useRef<number>(0);

  // Apply external impulse (e.g. from neighboring garments clinking or wind/CTA)
  useEffect(() => {
    if (externalImpulse !== 0 && !isDraggingRef.current) {
      angularVelocityRef.current += externalImpulse;
      const now = Date.now();
      if (now - lastClinkTimeRef.current > 350) {
        soundEngine.playHangerClink(Math.abs(externalImpulse) * 0.08);
        lastClinkTimeRef.current = now;
      }
    }
  }, [externalImpulse]);

  // Main physics animation loop (60fps requestAnimationFrame)
  useEffect(() => {
    let animId: number;

    const updatePhysics = () => {
      if (!isDraggingRef.current) {
        // Gravity pendulum equation: d^2(theta)/dt^2 = - (g/L) * sin(theta) - damping * d(theta)/dt
        const gravityFactor = 0.048; // Spring return force
        const damping = 0.942; // Air resistance damping

        const restoringTorque = -Math.sin((angleRef.current * Math.PI) / 180) * 180 * gravityFactor;
        angularVelocityRef.current = (angularVelocityRef.current + restoringTorque) * damping;
        angleRef.current += angularVelocityRef.current;

        // Slide return spring
        setSlideOffset((prev) => prev * 0.92);

        // Cloth inertia lag: cloth bend opposes angular acceleration and velocity
        const targetBend = Math.max(-0.8, Math.min(0.8, -angularVelocityRef.current * 0.12));
        clothBendRef.current += (targetBend - clothBendRef.current) * 0.22;

        // If movement is very small, sleep to save cycles
        if (Math.abs(angularVelocityRef.current) < 0.005 && Math.abs(angleRef.current) < 0.05) {
          angleRef.current = 0;
          angularVelocityRef.current = 0;
          clothBendRef.current = 0;
        }

        setAngle(angleRef.current);
        setClothBend(clothBendRef.current);
      } else {
        // During dragging, cloth lags behind the hand motion
        const targetBend = Math.max(-0.9, Math.min(0.9, -mouseVelocityRef.current * 0.04));
        clothBendRef.current += (targetBend - clothBendRef.current) * 0.35;
        setClothBend(clothBendRef.current);
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Mouse hover sway
  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    prevMouseXRef.current = e.clientX;
    soundEngine.playClothRustle(0.4);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) return;

    const currentX = e.clientX;
    const deltaX = currentX - prevMouseXRef.current;
    prevMouseXRef.current = currentX;

    // Apply gentle sweep impulse if cursor is moving fast across rack
    if (Math.abs(deltaX) > 2) {
      const impulse = Math.max(-4, Math.min(4, deltaX * 0.35));
      angularVelocityRef.current += impulse;

      // Ripple to neighbors
      if (Math.abs(impulse) > 1.8 && onNeighborImpulse) {
        if (deltaX > 0 && index < totalGarments - 1) {
          onNeighborImpulse(index + 1, impulse * 0.45);
        } else if (deltaX < 0 && index > 0) {
          onNeighborImpulse(index - 1, impulse * 0.45);
        }
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Pointer Drag Handling
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only left click
    if (e.button !== 0) return;

    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startAngle: angleRef.current,
      startSlide: slideOffset,
    };
    prevMouseXRef.current = e.clientX;
    mouseVelocityRef.current = 0;

    soundEngine.playHangerClink(0.4);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.mouseX;
    const mouseVel = e.clientX - prevMouseXRef.current;
    mouseVelocityRef.current = mouseVel;
    prevMouseXRef.current = e.clientX;

    // Pendulum angle based on horizontal pull from pivot (pivot length ~ 240px)
    const newAngle = Math.max(-42, Math.min(42, dragStartRef.current.startAngle + deltaX * 0.28));
    angleRef.current = newAngle;
    setAngle(newAngle);

    // Minor sliding along rod
    const newSlide = Math.max(-28, Math.min(28, dragStartRef.current.startSlide + deltaX * 0.15));
    setSlideOffset(newSlide);

    // Ripple clink to neighbors if pushed wide
    if (Math.abs(newAngle) > 18 && onNeighborImpulse) {
      const now = Date.now();
      if (now - lastClinkTimeRef.current > 260) {
        if (newAngle > 0 && index < totalGarments - 1) {
          onNeighborImpulse(index + 1, (newAngle / 40) * 2.5);
        } else if (newAngle < 0 && index > 0) {
          onNeighborImpulse(index - 1, (newAngle / 40) * 2.5);
        }
        soundEngine.playHangerClink(0.3);
        lastClinkTimeRef.current = now;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const wasDragging = Math.abs(e.clientX - dragStartRef.current.mouseX) > 5;
    isDraggingRef.current = false;
    setIsDragging(false);

    // Impart release momentum based on recent velocity
    angularVelocityRef.current = Math.max(-9, Math.min(9, mouseVelocityRef.current * 0.65));

    // If it was just a clean click without significant drag, open detail view
    if (!wasDragging) {
      soundEngine.playClothRustle(0.6);
      onSelect(garment);
    } else {
      soundEngine.playHangerClink(0.5);
    }
  };

  // Quick manual nudge
  const triggerNudge = useCallback((direction: number) => {
    angularVelocityRef.current += direction * 3.5;
    soundEngine.playHangerClink(0.35);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: `${rackSpacing}px`,
        transform: `translateX(${slideOffset}px)`,
      }}
      className="relative flex flex-col items-center flex-shrink-0 cursor-grab active:cursor-grabbing select-none group"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Rod Contact Hook Glider */}
      <div className="absolute -top-[14px] w-3 h-5 bg-gradient-to-b from-slate-200 to-slate-400 rounded-full shadow-sm z-30 opacity-90 pointer-events-none" />

      {/* Main Swinging Garment Assembly */}
      <div
        style={{
          transformOrigin: '50% 12px', // Pivoting right at the top of the chrome hook
          transform: `rotate(${angle}deg)`,
          transition: isDragging ? 'none' : 'box-shadow 0.2s ease',
        }}
        className={`relative garment-rack-shadow transition-transform duration-75 ease-linear ${
          isSelected ? 'opacity-20 pointer-events-none scale-95' : 'opacity-100'
        }`}
      >
        <GarmentRenderer garment={garment} isDetailed={false} clothBend={clothBend} />

        {/* Dynamic drop shadow on the wall that moves with angle */}
        <div
          style={{
            transform: `translateX(${-angle * 1.4}px) translateY(12px) scale(${1 - Math.abs(angle) * 0.005})`,
            opacity: 0.16 + (isHovered ? 0.08 : 0),
          }}
          className="absolute inset-0 bg-stone-900 rounded-3xl blur-xl -z-10 pointer-events-none transition-all duration-100"
        />
      </div>

      {/* Floating Info Pill on Hover / Drag */}
      <div
        className={`absolute bottom-[-18px] flex flex-col items-center pointer-events-none transition-all duration-200 ${
          isHovered || isDragging ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
        }`}
      >
        <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-900/90 text-stone-100 backdrop-blur-sm rounded-full text-[11px] font-medium shadow-lg whitespace-nowrap">
          <span className="font-semibold">{garment.name}</span>
          <span className="text-stone-400 font-mono">·</span>
          <span className="text-stone-300 font-mono tabular-nums">${garment.price}</span>
        </div>
        <div className="text-[10px] text-stone-600 mt-1 uppercase tracking-wider font-mono">
          Click to inspect
        </div>
      </div>
    </div>
  );
};
