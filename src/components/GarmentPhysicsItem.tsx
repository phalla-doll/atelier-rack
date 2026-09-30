import React, { useRef, useState, useEffect } from 'react';
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
  onHoverChange: (index: number | null) => void;
  slotSpacing?: number;
  externalImpulse?: number;
  onNeighborImpulse?: (neighborIndex: number, impulse: number) => void;
}

export const GarmentPhysicsItem: React.FC<GarmentPhysicsItemProps> = ({
  garment,
  index,
  totalGarments,
  isSelected,
  onSelect,
  hoveredIndex,
  onHoverChange,
  slotSpacing = 82,
  externalImpulse = 0,
  onNeighborImpulse,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const transformWrapperRef = useRef<HTMLDivElement>(null);
  const clothWrapperRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const isCurrentHovered = hoveredIndex === index;
  const [isHoveredState, setIsHoveredState] = useState<boolean>(false);

  // Full 3D Physics Simulation State in Ref for 60/120fps direct hardware transforms
  const physics = useRef({
    // Y-axis rotation (side vs front swivel)
    angleY: -68,             // default at rest: facing side (-68 deg)
    targetAngleY: -68,
    velocityY: 0,

    // Z-axis rotation (hanger pendulum swing along the rail)
    angleZ: 0,
    velocityZ: 0,

    // X-axis rotation (depth tilt forward/backward)
    angleX: 0,
    targetAngleX: 0,
    velocityX: 0,

    // Horizontal sliding along the chrome rail
    offsetX: 0,
    targetOffsetX: 0,
    velocityOffsetX: 0,

    // Z-depth pull forward out of rack
    translateZ: 0,
    targetTranslateZ: 0,

    // Cloth flex & flutter wave
    clothLagAngle: 0,
    clothVelocity: 0,
    clothFlutter: 0,
    clothFlutterPhase: 0,

    // Interaction & drag state
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartAngleY: -68,
    dragStartAngleZ: 0,
    hasMovedSignificantly: false,
    lastMouseX: 0,
    lastMouseY: 0,
    lastMouseTime: 0,
    mouseSpeedX: 0,
    lastClinkTime: 0,
  });

  // Calculate target positions based on rack hover state (side-facing & rail parting)
  useEffect(() => {
    const p = physics.current;

    if (p.isDragging) return;

    if (hoveredIndex === null) {
      // Rack at rest: all clothes face side (-68 deg) and sit evenly on rod
      p.targetAngleY = -68;
      p.targetTranslateZ = 0;
      p.targetOffsetX = 0;
      p.targetAngleX = 0;
    } else if (hoveredIndex === index) {
      // Currently hovered shirt: swivels to face FRONT (0 deg) and pulls forward in Z
      p.targetAngleY = 0;
      p.targetTranslateZ = 45;
      p.targetOffsetX = 0;
      p.targetAngleX = 2; // subtle forward drape
    } else if (index < hoveredIndex) {
      // Clothes to the left of the hovered shirt: part to the left along the rod
      const dist = hoveredIndex - index;
      const partShift = -48 * Math.exp(-(dist - 1) * 0.75);
      p.targetOffsetX = partShift;
      p.targetAngleY = -72; // angled slightly tighter to show front of hovered item
      p.targetTranslateZ = -5 * Math.exp(-dist);
      p.targetAngleX = 0;
    } else {
      // Clothes to the right of the hovered shirt: part to the right along the rod
      const dist = index - hoveredIndex;
      const partShift = 48 * Math.exp(-(dist - 1) * 0.75);
      p.targetOffsetX = partShift;
      p.targetAngleY = -64; // angled slightly outward
      p.targetTranslateZ = -5 * Math.exp(-dist);
      p.targetAngleX = 0;
    }
  }, [hoveredIndex, index]);

  // Handle external impulses (e.g. from breeze wave)
  useEffect(() => {
    if (externalImpulse !== 0 && !physics.current.isDragging) {
      const p = physics.current;
      p.velocityZ += externalImpulse;
      p.velocityY += externalImpulse * 1.5;
      p.clothVelocity += externalImpulse * 0.8;
    }
  }, [externalImpulse]);

  // Main 60fps/120fps 3D Physics Simulation Loop
  useEffect(() => {
    let animId: number;
    let prevTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - prevTime) / 1000, 0.033);
      prevTime = now;

      const p = physics.current;

      if (!p.isDragging) {
        // --- 1. Y-Axis Swivel Physics (Side to Front with Spring-Damper) ---
        const springKY = 42.0;
        const dampingY = 5.2;
        const diffY = p.targetAngleY - p.angleY;
        const accY = diffY * springKY - p.velocityY * dampingY;
        p.velocityY += accY * dt;
        p.angleY += p.velocityY * dt * 60;

        // --- 2. Z-Axis Pendulum Physics (Hanger Swing on Rail) ---
        const springKZ = 36.0;
        const dampingZ = 3.6;
        const angleZRad = (p.angleZ * Math.PI) / 180;
        const restoringZ = -Math.sin(angleZRad) * springKZ;
        const dampZ = -p.velocityZ * dampingZ;
        p.velocityZ += (restoringZ + dampZ) * dt;
        p.angleZ += p.velocityZ * dt * 60;
        p.angleZ = Math.max(-26, Math.min(26, p.angleZ));

        // --- 3. X-Axis Pitch Tilt Physics (Depth Lean) ---
        const springKX = 38.0;
        const dampingX = 4.8;
        const diffX = p.targetAngleX - p.angleX;
        const accX = diffX * springKX - p.velocityX * dampingX;
        p.velocityX += accX * dt;
        p.angleX += p.velocityX * dt * 60;
        p.angleX = Math.max(-15, Math.min(15, p.angleX));

        // --- 4. Horizontal Rail Sliding (Parting Displacement) ---
        const springOff = 28.0;
        const dampingOff = 4.4;
        const diffOff = p.targetOffsetX - p.offsetX;
        const accOff = diffOff * springOff - p.velocityOffsetX * dampingOff;
        p.velocityOffsetX += accOff * dt;
        p.offsetX += p.velocityOffsetX * dt * 60;

        // --- 5. Z-Depth Pull Forward ---
        p.translateZ += (p.targetTranslateZ - p.translateZ) * 0.18;

        // --- 6. Cloth Drape Lag & Ripple Flutter ---
        // Lag opposes angular motion
        const targetClothLag = -p.velocityZ * 0.22 - p.velocityY * 0.08;
        p.clothVelocity += (targetClothLag - p.clothLagAngle) * 26.0 * dt - p.clothVelocity * 5.0 * dt;
        p.clothLagAngle += p.clothVelocity * dt * 60;
        p.clothLagAngle = Math.max(-6, Math.min(6, p.clothLagAngle));

        // Dynamic flutter wave when moving
        const totalMovement = Math.abs(p.velocityZ) + Math.abs(p.velocityY) + Math.abs(p.velocityOffsetX);
        if (totalMovement > 0.05) {
          p.clothFlutterPhase += dt * 14;
          const targetFlutter = Math.sin(p.clothFlutterPhase) * Math.min(totalMovement * 0.35, 1.8);
          p.clothFlutter += (targetFlutter - p.clothFlutter) * 0.25;
        } else {
          p.clothFlutter *= 0.9;
        }

        // Neighbor collision detection during swing
        if (Math.abs(p.angleZ) > 14 && onNeighborImpulse) {
          const currentTime = performance.now();
          if (currentTime - p.lastClinkTime > 340) {
            p.lastClinkTime = currentTime;
            if (p.angleZ > 0 && index < totalGarments - 1) {
              onNeighborImpulse(index + 1, Math.min(p.velocityZ * 0.32, 2.2));
              soundEngine.playHangerClink(0.25);
            } else if (p.angleZ < 0 && index > 0) {
              onNeighborImpulse(index - 1, Math.max(p.velocityZ * 0.32, -2.2));
              soundEngine.playHangerClink(0.25);
            }
          }
        }
      }

      // --- 7. Direct GPU Hardware-Accelerated 3D Transform Application ---
      if (transformWrapperRef.current) {
        transformWrapperRef.current.style.transform = `
          translateX(${p.offsetX.toFixed(2)}px)
          translateZ(${p.translateZ.toFixed(2)}px)
          rotateY(${p.angleY.toFixed(2)}deg)
          rotateZ(${p.angleZ.toFixed(2)}deg)
          rotateX(${p.angleX.toFixed(2)}deg)
        `;
      }

      if (clothWrapperRef.current) {
        const skew = (-p.clothLagAngle * 0.75).toFixed(2);
        clothWrapperRef.current.style.transform = `
          rotate(${p.clothLagAngle.toFixed(2)}deg)
          skewX(${skew}deg)
        `;
      }

      if (shadowRef.current) {
        // Dynamic drop shadow that widens when facing front and narrows when facing side
        const radY = (p.angleY * Math.PI) / 180;
        const frontFacingFactor = Math.abs(Math.cos(radY)); // 0 when side, 1 when front
        const shadowWidth = (50 + frontFacingFactor * 130).toFixed(0);
        const shadowOpacity = (0.14 + frontFacingFactor * 0.08).toFixed(2);
        const shadowX = (p.offsetX - p.angleZ * 1.4).toFixed(1);

        shadowRef.current.style.transform = `translateX(${shadowX}px) translateY(14px)`;
        shadowRef.current.style.width = `${shadowWidth}px`;
        shadowRef.current.style.opacity = shadowOpacity;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [index, totalGarments, onNeighborImpulse]);

  // Pointer Hover Handlers
  const handlePointerEnter = (e: React.PointerEvent) => {
    setIsHoveredState(true);
    onHoverChange(index);

    const p = physics.current;
    p.lastMouseX = e.clientX;
    p.lastMouseY = e.clientY;
    p.lastMouseTime = performance.now();

    soundEngine.playRodSlide(0.4);
    soundEngine.playClothRustle(0.5);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const p = physics.current;

    if (p.isDragging) {
      const deltaX = e.clientX - p.dragStartX;
      const deltaY = e.clientY - p.dragStartY;

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        p.hasMovedSignificantly = true;
      }

      // Dragging swivels in Y and swings in Z
      const targetY = Math.max(-80, Math.min(45, p.dragStartAngleY + deltaX * 0.38));
      const targetZ = Math.max(-25, Math.min(25, p.dragStartAngleZ + deltaX * 0.22));
      const targetX = Math.max(-12, Math.min(15, -deltaY * 0.15));

      const prevY = p.angleY;
      const prevZ = p.angleZ;

      p.angleY += (targetY - p.angleY) * 0.4;
      p.angleZ += (targetZ - p.angleZ) * 0.4;
      p.angleX += (targetX - p.angleX) * 0.35;

      p.velocityY = (p.angleY - prevY) * 0.7;
      p.velocityZ = (p.angleZ - prevZ) * 0.7;

      p.clothLagAngle = (p.angleZ - prevZ) * -0.4;
      return;
    }

    // While hovering over the front-facing shirt, subtle interactive cursor tracking
    const now = performance.now();
    const dt = Math.max((now - p.lastMouseTime) / 1000, 0.008);
    const deltaX = e.clientX - p.lastMouseX;
    p.lastMouseX = e.clientX;
    p.lastMouseY = e.clientY;
    p.lastMouseTime = now;

    p.mouseSpeedX = p.mouseSpeedX * 0.5 + (deltaX / dt) * 0.5;

    // Organic micro-yaw and gentle sway when moving mouse over shirt
    if (Math.abs(p.mouseSpeedX) > 90) {
      const impulseZ = Math.max(-2.0, Math.min(2.0, (p.mouseSpeedX / 550) * 1.5));
      p.velocityZ += impulseZ * 0.2;
    }
  };

  const handlePointerLeave = () => {
    setIsHoveredState(false);
    onHoverChange(null);
    soundEngine.playClothRustle(0.3);
  };

  // Drag Start (Left Click)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;

    e.preventDefault();
    const p = physics.current;
    p.isDragging = true;
    p.hasMovedSignificantly = false;
    p.dragStartX = e.clientX;
    p.dragStartY = e.clientY;
    p.dragStartAngleY = p.angleY;
    p.dragStartAngleZ = p.angleZ;
    p.velocityY = 0;
    p.velocityZ = 0;

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    soundEngine.playHangerClink(0.4);
  };

  // Drag Release
  const handlePointerUp = (e: React.PointerEvent) => {
    const p = physics.current;
    if (!p.isDragging) return;

    p.isDragging = false;

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (!p.hasMovedSignificantly) {
      // Clean click: pull forward into full detail modal!
      soundEngine.playClothRustle(0.6);
      onSelect(garment);
    } else {
      // Released from drag: clamp release velocities for smooth harmonic settle
      p.velocityY = Math.max(-8, Math.min(8, p.velocityY));
      p.velocityZ = Math.max(-5, Math.min(5, p.velocityZ));
      soundEngine.playHangerClink(0.45);
    }
  };

  // Calculate side-view darkening factor based on angleY
  const angleYRad = (physics.current.angleY * Math.PI) / 180;
  const isFacingSide = Math.abs(Math.sin(angleYRad)); // 1 when side, 0 when front

  return (
    <div
      ref={containerRef}
      style={{
        width: `${slotSpacing}px`,
        perspective: '1200px',
      }}
      className="relative flex flex-col items-center flex-shrink-0 select-none z-10"
    >
      {/* 3D SWINGING & SWIVELING GARMENT ASSEMBLY (Controlled via Ref on GPU) */}
      <div
        ref={transformWrapperRef}
        style={{
          transformOrigin: '50% 12px', // Pivot at top chrome hook
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className={`relative ${
          isSelected ? 'opacity-25 pointer-events-none scale-95' : 'opacity-100'
        } ${isCurrentHovered ? 'z-40' : 'z-10'}`}
      >
        {/* Rod Contact Hook Glider on the Chrome Rod */}
        <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 w-3 h-5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 rounded-full shadow-xs z-30 opacity-90 pointer-events-none" />

        {/* Dynamic drop shadow on pegboard wall */}
        <div
          ref={shadowRef}
          className="absolute inset-0 bg-stone-900/18 rounded-3xl blur-xl -z-10 pointer-events-none transition-all duration-75"
          style={{ willChange: 'transform, width, opacity' }}
        />

        {/* Secondary Cloth Drape & Ripple Wrapper */}
        <div
          ref={clothWrapperRef}
          style={{
            transformOrigin: '50% 80px',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          <GarmentRenderer
            garment={garment}
            isDetailed={false}
            lightingDim={isFacingSide * 0.22}
          />
        </div>
      </div>

      {/* FIXED STATIC HIT-BOX OVERLAY (Follows slot on the rod, perfect stability) */}
      <div
        className="absolute inset-0 top-0 h-[360px] z-50 cursor-grab active:cursor-grabbing touch-none"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      {/* Floating Info Pill when garment swivels to face front */}
      <div
        className={`absolute bottom-[-18px] flex flex-col items-center pointer-events-none transition-all duration-200 z-50 ${
          isCurrentHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
        }`}
      >
        <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-900/90 text-stone-100 backdrop-blur-sm rounded-full text-[11px] font-medium shadow-md whitespace-nowrap">
          <span className="font-semibold">{garment.name}</span>
          <span className="text-stone-400 font-mono">·</span>
          <span className="text-stone-300 font-mono tabular-nums">${garment.price}</span>
        </div>
        <div className="text-[9px] text-stone-500 mt-0.5 uppercase tracking-wider font-mono">
          Click to inspect details
        </div>
      </div>
    </div>
  );
};
