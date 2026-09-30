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
  rackSpacing = 142,
  onNeighborImpulse,
  externalImpulse = 0,
}) => {
  // DOM Refs for direct hardware-accelerated transforms (no React re-render thrashing)
  const slotRef = useRef<HTMLDivElement>(null);
  const swingWrapperRef = useRef<HTMLDivElement>(null);
  const clothWrapperRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  // Hover state only for UI pill
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Physics simulation state (kept strictly in refs for 60/120fps fluid simulation)
  const physicsRef = useRef({
    angle: 0,              // Current angle in degrees
    velocity: 0,           // Angular velocity in deg/frame
    clothAngle: 0,         // Secondary cloth lag angle
    clothVelocity: 0,      // Cloth lag velocity
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartAngle: 0,
    hasMovedSignificantly: false,
    lastMouseX: 0,
    lastMouseTime: 0,
    mouseSpeed: 0,
    lastNeighborTriggerTime: 0,
    active: true,
  });

  // Handle external impulses (e.g. from breeze wave or neighbor collision)
  useEffect(() => {
    if (externalImpulse !== 0 && !physicsRef.current.isDragging) {
      physicsRef.current.velocity += externalImpulse;
      physicsRef.current.active = true;
    }
  }, [externalImpulse]);

  // Main 60fps / 120fps Physics Animation Loop
  useEffect(() => {
    let animId: number;
    let prevTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - prevTime) / 1000, 0.033); // clamp dt to max 33ms
      prevTime = now;

      const p = physicsRef.current;

      if (!p.isDragging) {
        // --- 1. Damped Harmonic Pendulum Equation ---
        // Torque = - (g / L) * sin(theta) - damping * velocity
        const springK = 38.0;   // Spring return frequency
        const damping = 3.2;    // Damping resistance

        const angleRad = (p.angle * Math.PI) / 180;
        const restoringAcc = -Math.sin(angleRad) * springK;
        const dampingAcc = -p.velocity * damping;

        // Semi-implicit Euler integration for perfect numerical stability
        p.velocity += (restoringAcc + dampingAcc) * dt;
        p.angle += p.velocity * dt * 60;

        // Clamp maximum angle to prevent unnatural over-rotation
        if (p.angle > 24) {
          p.angle = 24;
          p.velocity = -Math.abs(p.velocity) * 0.4;
        } else if (p.angle < -24) {
          p.angle = -24;
          p.velocity = Math.abs(p.velocity) * 0.4;
        }

        // --- 2. Secondary Cloth Drape Inertia ---
        // Cloth bottom lags behind the hanger motion smoothly
        const targetClothAngle = -p.velocity * 0.16;
        const clothSpring = 24.0;
        const clothDamping = 4.5;
        const clothAcc = (targetClothAngle - p.clothAngle) * clothSpring - p.clothVelocity * clothDamping;
        p.clothVelocity += clothAcc * dt;
        p.clothAngle += p.clothVelocity * dt * 60;
        p.clothAngle = Math.max(-5, Math.min(5, p.clothAngle));

        // Neighbor collision detection (when swinging wide)
        if (Math.abs(p.angle) > 13.5 && onNeighborImpulse) {
          const currentTime = performance.now();
          if (currentTime - p.lastNeighborTriggerTime > 320) {
            p.lastNeighborTriggerTime = currentTime;
            if (p.angle > 0 && index < totalGarments - 1) {
              onNeighborImpulse(index + 1, Math.min(p.velocity * 0.35, 2.5));
              soundEngine.playHangerClink(0.28);
            } else if (p.angle < 0 && index > 0) {
              onNeighborImpulse(index - 1, Math.max(p.velocity * 0.35, -2.5));
              soundEngine.playHangerClink(0.28);
            }
          }
        }

        // Energy sleep check to stop idle CPU usage
        if (Math.abs(p.angle) < 0.04 && Math.abs(p.velocity) < 0.04 && Math.abs(p.clothAngle) < 0.04) {
          p.angle = 0;
          p.velocity = 0;
          p.clothAngle = 0;
          p.clothVelocity = 0;
        }
      }

      // --- 3. Direct Hardware Transform Application ---
      if (swingWrapperRef.current) {
        swingWrapperRef.current.style.transform = `rotate(${p.angle.toFixed(2)}deg)`;
      }

      if (clothWrapperRef.current) {
        const skew = (-p.clothAngle * 0.8).toFixed(2);
        clothWrapperRef.current.style.transform = `rotate(${p.clothAngle.toFixed(2)}deg) skewX(${skew}deg)`;
      }

      if (shadowRef.current) {
        const shadowX = (-p.angle * 1.5).toFixed(1);
        shadowRef.current.style.transform = `translateX(${shadowX}px) translateY(12px)`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [index, totalGarments, onNeighborImpulse]);

  // --- Steady Hit Box Mouse Handlers (NO jitter/re-triggering) ---
  const handlePointerEnter = (e: React.PointerEvent) => {
    setIsHovered(true);
    const p = physicsRef.current;
    p.lastMouseX = e.clientX;
    p.lastMouseTime = performance.now();
    soundEngine.playClothRustle(0.3);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const p = physicsRef.current;

    if (p.isDragging) {
      // DRAGGING PHYSICS
      const deltaX = e.clientX - p.dragStartX;
      if (Math.abs(deltaX) > 4) {
        p.hasMovedSignificantly = true;
      }

      // Compute angle directly from horizontal pull relative to hanger pivot (~240px drop)
      const targetAngle = Math.max(-28, Math.min(28, p.dragStartAngle + deltaX * 0.22));
      const prevAngle = p.angle;
      p.angle += (targetAngle - p.angle) * 0.35; // Smooth spring lag
      p.velocity = (p.angle - prevAngle) * 0.8;  // Store release velocity

      p.clothAngle = Math.max(-6, Math.min(6, (p.angle - targetAngle) * 0.4));
      return;
    }

    // HOVER SWAY PHYSICS
    const now = performance.now();
    const dt = Math.max((now - p.lastMouseTime) / 1000, 0.008);
    const deltaX = e.clientX - p.lastMouseX;
    p.lastMouseX = e.clientX;
    p.lastMouseTime = now;

    // Calculate smoothed mouse speed across the garment
    const instantSpeed = deltaX / dt; // px per second
    p.mouseSpeed = p.mouseSpeed * 0.6 + instantSpeed * 0.4;

    // Apply gentle, bounded brush impulse in the direction of the cursor movement
    if (Math.abs(p.mouseSpeed) > 120) {
      const impulse = Math.max(-2.2, Math.min(2.2, (p.mouseSpeed / 600) * 1.8));
      // Only inject if moving in same direction or adding gentle push
      if (Math.sign(impulse) === Math.sign(p.mouseSpeed) && Math.abs(p.velocity) < 6) {
        p.velocity += impulse * 0.25;
      }
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    const p = physicsRef.current;
    p.mouseSpeed = 0;
  };

  // --- Pointer Drag Start ---
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Left click only

    e.preventDefault();
    const p = physicsRef.current;
    p.isDragging = true;
    p.hasMovedSignificantly = false;
    p.dragStartX = e.clientX;
    p.dragStartY = e.clientY;
    p.dragStartAngle = p.angle;
    p.velocity = 0;

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    soundEngine.playHangerClink(0.35);
  };

  // --- Pointer Drag Release ---
  const handlePointerUp = (e: React.PointerEvent) => {
    const p = physicsRef.current;
    if (!p.isDragging) return;

    p.isDragging = false;

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // If it was a clean click without significant drag, open detail view
    if (!p.hasMovedSignificantly) {
      soundEngine.playClothRustle(0.5);
      onSelect(garment);
    } else {
      // Released from drag: clamp release velocity for natural swing
      p.velocity = Math.max(-5.5, Math.min(5.5, p.velocity));
      soundEngine.playHangerClink(0.4);
    }
  };

  return (
    <div
      ref={slotRef}
      style={{ width: `${rackSpacing}px` }}
      className="relative flex flex-col items-center flex-shrink-0 select-none"
    >
      {/* Rod Contact Hook Glider on the Chrome Rod */}
      <div className="absolute -top-[14px] w-3 h-5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 rounded-full shadow-xs z-30 opacity-90 pointer-events-none" />

      {/* SWINGING ASSEMBLY LAYER (Hardware-accelerated transform via Ref) */}
      <div
        ref={swingWrapperRef}
        style={{
          transformOrigin: '50% 12px', // Pivot at top of hook
          willChange: 'transform',
        }}
        className={`relative garment-rack-shadow ${
          isSelected ? 'opacity-25 pointer-events-none scale-95' : 'opacity-100'
        }`}
      >
        {/* Dynamic drop shadow on pegboard wall */}
        <div
          ref={shadowRef}
          className="absolute inset-0 bg-stone-900/18 rounded-3xl blur-xl -z-10 pointer-events-none"
          style={{ willChange: 'transform' }}
        />

        {/* Render Garment with dedicated cloth wrapper for drape lag */}
        <div ref={clothWrapperRef} style={{ transformOrigin: '50% 80px', willChange: 'transform' }}>
          <GarmentRenderer garment={garment} isDetailed={false} />
        </div>
      </div>

      {/* STATIC INVISIBLE HIT-BOX OVERLAY (Prevents mouse event jitter during swings) */}
      <div
        className="absolute inset-0 top-0 h-[360px] z-40 cursor-grab active:cursor-grabbing touch-none"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      {/* Floating Info Pill on Hover */}
      <div
        className={`absolute bottom-[-16px] flex flex-col items-center pointer-events-none transition-all duration-200 z-50 ${
          isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
        }`}
      >
        <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-900/90 text-stone-100 backdrop-blur-sm rounded-full text-[11px] font-medium shadow-md whitespace-nowrap">
          <span className="font-semibold">{garment.name}</span>
          <span className="text-stone-400 font-mono">·</span>
          <span className="text-stone-300 font-mono tabular-nums">${garment.price}</span>
        </div>
        <div className="text-[9px] text-stone-500 mt-0.5 uppercase tracking-wider font-mono">
          Click to inspect
        </div>
      </div>
    </div>
  );
};
