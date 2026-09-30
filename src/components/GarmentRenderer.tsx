import React from 'react';
import { Garment } from '../types.ts';

interface GarmentRendererProps {
  garment: Garment;
  isDetailed?: boolean;
  viewSide?: 'front' | 'back';
  sideRatio?: number;      // 0 = full front view, 1 = volumetric side profile
  clothLagAngle?: number;  // small relative angle (-4 to +4 deg)
  clothSkew?: number;      // small shear factor (-5 to +5 deg)
  clothFlutter?: number;   // dynamic wave displacement for hem
}

export const GarmentRenderer: React.FC<GarmentRendererProps> = ({
  garment,
  isDetailed = false,
  viewSide = 'front',
  sideRatio = 0,
  clothLagAngle = 0,
  clothSkew = 0,
  clothFlutter = 0,
}) => {
  const isLongSleeve = garment.category === 'long-sleeve';

  // Wood hanger color palette
  const hangerWoodColors = {
    walnut: {
      top: '#54321A',
      mid: '#724427',
      bottom: '#3A200E',
      grain: 'rgba(25, 12, 5, 0.3)',
      edge: '#261408',
    },
    oak: {
      top: '#986B44',
      mid: '#B8865A',
      bottom: '#744E2C',
      grain: 'rgba(55, 30, 10, 0.22)',
      edge: '#4D311A',
    },
    'natural-birch': {
      top: '#DEC7A4',
      mid: '#EBD6B6',
      bottom: '#BA9F78',
      grain: 'rgba(100, 75, 45, 0.16)',
      edge: '#876D4B',
    },
  }[garment.hangerWood];

  const hangerId = `hanger-${garment.id}-${isDetailed ? 'detail' : 'rack'}`;
  const clothGradId = `fabric-${garment.id}-${isDetailed ? 'detail' : 'rack'}`;
  const clipId = `clip-${garment.id}-${isDetailed ? 'detail' : 'rack'}`;

  // Flutter wave calculations for bottom hem
  const waveHem1 = clothFlutter * 4;
  const waveHem2 = -clothFlutter * 3.5;

  // Clamp sideRatio
  const clampedSide = Math.max(0, Math.min(1, sideRatio));
  const frontOpacity = Math.max(0, 1 - clampedSide * 1.3);
  const sideOpacity = Math.max(0, Math.min(1, (clampedSide - 0.15) * 1.4));

  return (
    <div
      className={`relative select-none pointer-events-none ${
        isDetailed ? 'w-[380px] sm:w-[440px] md:w-[480px] h-[540px] sm:h-[600px]' : 'w-[230px] h-[340px]'
      }`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <svg
        viewBox="0 0 400 500"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wood hanger gradient */}
          <linearGradient id={`${hangerId}-wood`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={hangerWoodColors.top} />
            <stop offset="45%" stopColor={hangerWoodColors.mid} />
            <stop offset="100%" stopColor={hangerWoodColors.bottom} />
          </linearGradient>

          {/* Chrome hook gradient */}
          <linearGradient id={`${hangerId}-chrome`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#DDE4EC" />
            <stop offset="55%" stopColor="#5B6775" />
            <stop offset="80%" stopColor="#9AA7B6" />
            <stop offset="100%" stopColor="#253242" />
          </linearGradient>

          {/* Fabric lighting gradient for front */}
          <linearGradient id={clothGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
            <stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.09" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.16" />
            <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.26" />
          </linearGradient>

          {/* Side profile lighting gradient (depth volume) */}
          <linearGradient id={`${clothGradId}-side`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.12" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.22" />
            <stop offset="80%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
          </linearGradient>

          {/* Vertical shadow gradient for depth */}
          <linearGradient id={`${clothGradId}-vert`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.14" />
            <stop offset="10%" stopColor="#FFFFFF" stopOpacity="0.0" />
            <stop offset="80%" stopColor="#000000" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
          </linearGradient>

          {/* Subtle tactile weave pattern */}
          <pattern id={`${clothGradId}-weave`} width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="2" height="2" fill="rgba(255,255,255,0.03)" />
            <rect x="2" y="2" width="2" height="2" fill="rgba(0,0,0,0.03)" />
          </pattern>

          {/* Drop shadow filter for hanger */}
          <filter id={`${hangerId}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.35" floodColor="#000" />
          </filter>

          {/* Clip path for front silhouette */}
          <clipPath id={clipId}>
            {isLongSleeve ? (
              <path
                d="M 152 74
                   C 170 82 230 82 248 74
                   C 285 86 335 106 352 136
                   L 378 280
                   C 380 295 368 302 354 298
                   L 334 235
                   L 326 230
                   L 318 475
                   C 260 478 140 478 82 475
                   L 74 230
                   L 66 235
                   L 46 298
                   C 32 302 20 295 22 280
                   L 48 136
                   C 65 106 115 86 152 74 Z"
              />
            ) : (
              <path
                d="M 152 74
                   C 170 82 230 82 248 74
                   C 288 88 340 106 366 142
                   C 370 148 368 158 358 162
                   L 326 174
                   L 318 206
                   L 310 475
                   C 260 478 140 478 90 475
                   L 82 206
                   L 74 174
                   L 42 162
                   C 32 158 30 148 34 142
                   C 60 106 112 88 152 74 Z"
              />
            )}
          </clipPath>
        </defs>

        {/* ========================================================================= */}
        {/* OPTION A: VOLUMETRIC SIDE PROFILE (Visible when on rack facing side)      */}
        {/* Matches the user's reference image with side thickness and folded sleeve! */}
        {/* ========================================================================= */}
        {!isDetailed && sideOpacity > 0.01 && (
          <g id="volumetric-side-profile" opacity={sideOpacity} className="transition-opacity duration-150">
            {/* 1. Chrome Hook for Side Profile */}
            <g id="side-hook">
              <rect x="198" y="44" width="4" height="10" rx="1" fill="#718096" />
              <path
                d="M 200 45 L 200 24 C 200 12 207 4 218 4 C 228 4 234 12 232 22 C 230 28 225 34 220 36"
                fill="none"
                stroke={`url(#${hangerId}-chrome)`}
                strokeWidth="4.2"
                strokeLinecap="round"
              />
              <path
                d="M 201 38 L 201 24 C 201 14 206 6 216 6"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>

            {/* 2. Wooden Hanger Profile in Side View */}
            <g id="side-wood-hanger" filter={`url(#${hangerId}-shadow)`}>
              {/* Wooden neck block */}
              <path
                d="M 188 54 C 194 52 206 52 212 54 L 216 86 C 210 88 190 88 184 86 Z"
                fill={`url(#${hangerId}-wood)`}
              />
              <ellipse cx="200" cy="54" rx="12" ry="4" fill={hangerWoodColors.edge} />
              <circle cx="200" cy="66" r="2.8" fill="#D4AF37" stroke="#785B0D" strokeWidth="0.6" />
            </g>

            {/* 3. Volumetric Torso Body (Front-to-Back Thickness ~65px) */}
            <g
              id="side-torso-body"
              style={{
                transformOrigin: '200px 74px',
                transform: `rotate(${clothLagAngle * 0.8}deg) skewX(${clothSkew * 0.5}deg)`,
              }}
            >
              {/* Back fabric layer (inside/back drape) */}
              <path
                d={`M 172 82
                   C 166 110 162 180 164 280
                   C 166 360 168 420 168 472
                   C 185 475 215 475 232 472
                   C 236 420 238 360 236 280
                   C 234 180 232 110 226 82 Z`}
                fill={garment.collarHex}
                opacity="0.95"
              />

              {/* Main draped side profile body */}
              <path
                d={`M 172 82
                   C 168 110 164 190 166 280
                   C 168 370 170 430 170 472
                   C 186 475 214 475 230 472
                   C 234 430 236 370 234 280
                   C 232 190 228 110 224 82 Z`}
                fill={garment.colorHex}
              />

              {/* Volumetric cylindrical lighting on the side body */}
              <path
                d="M 166 82 L 170 472 C 186 475 214 475 230 472 L 234 82 Z"
                fill={`url(#${clothGradId}-side)`}
              />

              {/* Vertical side fold shadows (creases between front chest and back panel) */}
              <path
                d="M 174 86 Q 170 260 174 468"
                fill="none"
                stroke="rgba(0,0,0,0.3)"
                strokeWidth="4"
                filter="blur(2px)"
              />
              <path
                d="M 226 86 Q 230 260 226 468"
                fill="none"
                stroke="rgba(0,0,0,0.3)"
                strokeWidth="4"
                filter="blur(2px)"
              />

              {/* 4. DRAPED SLEEVE ON THE SIDE (The hallmark of a real clothing rack!) */}
              {isLongSleeve ? (
                // Long Sleeve side drape extending to cuffs
                <g id="side-long-sleeve">
                  {/* Sleeve body hanging along the side */}
                  <path
                    d={`M 178 84
                       C 172 130 170 220 174 340
                       L 176 430
                       C 188 434 212 434 224 430
                       L 226 340
                       C 228 220 226 130 220 84 Z`}
                    fill={garment.colorHex}
                  />
                  {/* Sleeve cylindrical shading */}
                  <path
                    d="M 178 84 C 172 130 170 220 174 340 L 176 430 C 188 434 212 434 224 430 L 226 340 C 228 220 226 130 220 84 Z"
                    fill={`url(#${clothGradId}-side)`}
                  />
                  {/* Sleeve front fold crease */}
                  <path
                    d="M 198 86 Q 196 260 200 426"
                    fill="none"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="3"
                    filter="blur(1px)"
                  />
                  {/* Long sleeve ribbed cuff */}
                  <rect x="176" y="426" width="48" height="18" rx="2" fill={garment.collarHex} stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
                  <line x1="184" y1="428" x2="184" y2="442" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  <line x1="192" y1="428" x2="192" y2="442" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  <line x1="200" y1="428" x2="200" y2="442" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  <line x1="208" y1="428" x2="208" y2="442" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  <line x1="216" y1="428" x2="216" y2="442" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                </g>
              ) : (
                // Short Sleeve side drape ending at mid-torso with folded sleeve cuff
                <g id="side-short-sleeve">
                  {/* Sleeve hanging over the upper torso */}
                  <path
                    d={`M 176 84
                       C 168 116 166 170 170 236
                       C 184 242 216 242 230 236
                       C 232 170 230 116 222 84 Z`}
                    fill={garment.colorHex}
                  />
                  {/* Sleeve 3D lighting */}
                  <path
                    d="M 176 84 C 168 116 166 170 170 236 C 184 242 216 242 230 236 C 232 170 230 116 222 84 Z"
                    fill={`url(#${clothGradId}-side)`}
                  />
                  {/* Sleeve center fold crease */}
                  <path
                    d="M 198 84 Q 196 160 200 234"
                    fill="none"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="3.5"
                    filter="blur(1.5px)"
                  />
                  {/* Sleeve hem cuff fold */}
                  <path
                    d="M 170 232 C 184 238 216 238 230 232 L 230 237 C 216 243 184 243 170 237 Z"
                    fill={garment.collarHex}
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="0.8"
                  />
                  {/* Shadow cast by sleeve cuff onto body below */}
                  <path
                    d="M 172 238 C 186 244 214 244 228 238 C 220 252 180 252 172 238 Z"
                    fill="rgba(0,0,0,0.35)"
                    filter="blur(3px)"
                  />
                </g>
              )}

              {/* Hem bottom fold in side view */}
              <ellipse cx="200" cy="472" rx="30" ry="3.5" fill="rgba(0,0,0,0.3)" />
              <path
                d="M 170 470 C 184 473 216 473 230 470"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.2"
                strokeDasharray="3 2"
              />
            </g>
          </g>
        )}

        {/* ========================================================================= */}
        {/* OPTION B: FULL FRONT VIEW (Visible when hovered, pulled forward, detailed) */}
        {/* Wide spread boxy cut with chest artwork and collar ribbing               */}
        {/* ========================================================================= */}
        {(isDetailed || frontOpacity > 0.01) && (
          <g
            id="full-front-view"
            opacity={isDetailed ? 1 : frontOpacity}
            className="transition-opacity duration-150"
          >
            {/* 1. CHROME HANGER HOOK */}
            <g id="chrome-hook" className="chrome-hook">
              <circle cx="200" cy="52" r="5.5" fill={`url(#${hangerId}-chrome)`} />
              <rect x="198" y="48" width="4" height="8" rx="1.5" fill="#94A3B8" />
              <path
                d="M 200 48 
                   L 200 32 
                   C 200 18 208 8 222 8 
                   C 236 8 242 20 240 30 
                   C 238 38 232 44 227 46"
                fill="none"
                stroke={`url(#${hangerId}-chrome)`}
                strokeWidth="4.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 201 44 L 201 32 C 201 20 207 10 220 10"
                fill="none"
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>

            {/* 2. WOODEN HANGER BODY */}
            <g id="wood-hanger" filter={`url(#${hangerId}-shadow)`}>
              <path
                d="M 200 50
                   C 222 52 288 68 342 100
                   L 338 106
                   C 285 74 220 58 200 56
                   C 180 58 115 74 62 106
                   L 58 100
                   C 112 68 178 52 200 50 Z"
                fill={hangerWoodColors.edge}
                opacity="0.8"
              />
              <path
                d="M 200 52
                   C 220 54 285 70 338 102
                   C 342 104 340 114 334 116
                   C 305 110 230 84 200 84
                   C 170 84 95 110 66 116
                   C 60 114 58 104 62 102
                   C 115 70 180 54 200 52 Z"
                fill={`url(#${hangerId}-wood)`}
              />
              <path
                d="M 120 86 C 160 70 240 70 280 86"
                fill="none"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1.2"
              />
              <path
                d="M 80 104 C 140 80 260 80 320 104"
                fill="none"
                stroke={hangerWoodColors.grain}
                strokeWidth="1.2"
              />
              <circle cx="200" cy="68" r="3.2" fill="#D4AF37" stroke="#997A15" strokeWidth="0.8" />
              <circle cx="200" cy="68" r="1.2" fill="#5A4008" />
            </g>

            {/* 3. FRONT GARMENT SILHOUETTE */}
            <g
              id="garment-main-silhouette"
              style={{
                transformOrigin: '200px 74px',
                transform: `rotate(${clothLagAngle}deg) skewX(${clothSkew}deg)`,
                transition: 'transform 0.04s linear',
              }}
            >
              {isLongSleeve ? (
                <path
                  d={`M 152 74
                     C 170 82 230 82 248 74
                     C 285 86 335 106 352 136
                     L 378 280
                     C 380 295 368 302 354 298
                     L 334 235
                     L 326 230
                     L 318 475
                     C ${260 + waveHem1} 478 ${140 + waveHem2} 478 82 475
                     L 74 230
                     L 66 235
                     L 46 298
                     C 32 302 20 295 22 280
                     L 48 136
                     C 65 106 115 86 152 74 Z`}
                  fill={garment.colorHex}
                />
              ) : (
                <path
                  d={`M 152 74
                     C 170 82 230 82 248 74
                     C 288 88 340 106 366 142
                     C 370 148 368 158 358 162
                     L 326 174
                     L 318 206
                     L 310 475
                     C ${260 + waveHem1} 478 ${140 + waveHem2} 478 90 475
                     L 82 206
                     L 74 174
                     L 42 162
                     C 32 158 30 148 34 142
                     C 60 106 112 88 152 74 Z`}
                  fill={garment.colorHex}
                />
              )}

              {/* Shading, Texture & Highlights inside the clip */}
              <g clipPath={`url(#${clipId})`}>
                <rect x="0" y="0" width="400" height="500" fill={`url(#${clothGradId})`} />
                <rect x="0" y="0" width="400" height="500" fill={`url(#${clothGradId}-vert)`} />
                <rect x="0" y="0" width="400" height="500" fill={`url(#${clothGradId}-weave)`} />

                {/* Natural cloth fold shadows & ripples */}
                <path
                  d={`M 160 84 Q 175 240 ${165 + waveHem1} 470`}
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.18)"
                  strokeWidth="12"
                  filter="blur(5px)"
                />
                <path
                  d={`M 240 84 Q 225 240 ${235 + waveHem2} 470`}
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.18)"
                  strokeWidth="12"
                  filter="blur(5px)"
                />
                <path
                  d={`M 172 88 Q 185 240 ${178 + waveHem1} 460`}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.14)"
                  strokeWidth="6"
                  filter="blur(3px)"
                />
                <path
                  d={`M 228 88 Q 215 240 ${222 + waveHem2} 460`}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.14)"
                  strokeWidth="6"
                  filter="blur(3px)"
                />

                <path
                  d="M 94 200 C 110 215 130 220 150 230"
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.24)"
                  strokeWidth="4"
                  filter="blur(2px)"
                />
                <path
                  d="M 306 200 C 290 215 270 220 250 230"
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.24)"
                  strokeWidth="4"
                  filter="blur(2px)"
                />

                <path
                  d="M 88 462 Q 200 466 312 462"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                />
                <path
                  d="M 88 466 Q 200 470 312 466"
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.22)"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                />

                {isLongSleeve && (
                  <>
                    <path d="M 346 270 L 372 278" fill="none" stroke="rgba(0, 0, 0, 0.22)" strokeWidth="2" />
                    <path d="M 54 270 L 28 278" fill="none" stroke="rgba(0, 0, 0, 0.22)" strokeWidth="2" />
                  </>
                )}

                {/* GRAPHIC ARTWORK / PRINT */}
                {viewSide === 'front' ? (
                  <g id="garment-chest-artwork">
                    {garment.graphicType === 'monolith' && (
                      <g className="mix-blend-luminosity">
                        <rect x="145" y="150" width="110" height="135" fill="none" stroke={garment.accentColor} strokeWidth="1.5" opacity="0.85" />
                        <line x1="145" y1="185" x2="255" y2="185" stroke={garment.accentColor} strokeWidth="1" opacity="0.5" />
                        <line x1="200" y1="185" x2="200" y2="285" stroke={garment.accentColor} strokeWidth="1" opacity="0.5" />
                        <rect x="155" y="195" width="35" height="35" fill={garment.accentColor} opacity="0.9" />
                        <circle cx="228" cy="235" r="18" fill="none" stroke={garment.accentColor} strokeWidth="2" opacity="0.9" />
                        <text x="150" y="172" fill={garment.accentColor} fontFamily="Space Mono, monospace" fontSize="10" fontWeight="700" letterSpacing="2">
                          ARCHIVE / 01
                        </text>
                        <text x="150" y="275" fill={garment.accentColor} fontFamily="Space Mono, monospace" fontSize="7" opacity="0.75" letterSpacing="1">
                          LAT 35.6762° N // 280 GSM
                        </text>
                      </g>
                    )}

                    {garment.graphicType === 'typographic' && garment.id === 'ls-terracotta' && (
                      <g>
                        <polygon points="185,155 215,155 200,185" fill={garment.accentColor} opacity="0.9" />
                        <line x1="175" y1="192" x2="225" y2="192" stroke={garment.accentColor} strokeWidth="1.5" opacity="0.7" />
                        <text x="200" y="208" textAnchor="middle" fill={garment.accentColor} fontFamily="Syne, sans-serif" fontSize="11" fontWeight="800" letterSpacing="3">
                          TERRA FORM
                        </text>
                        <text x="200" y="222" textAnchor="middle" fill={garment.accentColor} fontFamily="Space Mono, monospace" fontSize="7.5" opacity="0.8" letterSpacing="1.5">
                          STRATA STUDY 04
                        </text>
                        <path d="M 52 205 L 42 255 M 58 200 L 48 250" stroke={garment.accentColor} strokeWidth="1.5" opacity="0.7" />
                      </g>
                    )}

                    {garment.graphicType === 'botanical' && (
                      <g opacity="0.92">
                        <path d="M 200 150 Q 195 195 200 250 Q 202 275 198 290" fill="none" stroke={garment.accentColor} strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M 200 170 Q 180 160 175 175 Q 188 180 200 175" fill={garment.accentColor} opacity="0.85" />
                        <path d="M 200 185 Q 220 175 225 190 Q 212 195 200 190" fill={garment.accentColor} opacity="0.85" />
                        <path d="M 199 210 Q 178 205 174 220 Q 186 224 199 216" fill={garment.accentColor} opacity="0.85" />
                        <path d="M 200 230 Q 222 225 226 240 Q 214 244 200 236" fill={garment.accentColor} opacity="0.85" />
                        <rect x="155" y="260" width="90" height="26" fill="rgba(255,255,255,0.12)" stroke={garment.accentColor} strokeWidth="0.8" />
                        <text x="200" y="272" textAnchor="middle" fill={garment.accentColor} fontFamily="serif" fontStyle="italic" fontSize="8.5">
                          Artemisia Absinthium
                        </text>
                        <text x="200" y="281" textAnchor="middle" fill={garment.accentColor} fontFamily="Space Mono, monospace" fontSize="6.5" opacity="0.75">
                          PLATE NO. 82 // ATELIER BOTANICA
                        </text>
                      </g>
                    )}

                    {garment.graphicType === 'abstract' && (
                      <g>
                        <defs>
                          <linearGradient id="waveChrome" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="35%" stopColor="#93C5FD" />
                            <stop offset="65%" stopColor="#1E3A8A" />
                            <stop offset="100%" stopColor="#E0F2FE" />
                          </linearGradient>
                        </defs>
                        <path d="M 135 180 C 165 150 185 220 215 180 C 235 150 255 210 265 180" fill="none" stroke="url(#waveChrome)" strokeWidth="6" strokeLinecap="round" />
                        <path d="M 140 195 C 170 165 190 235 220 195 C 240 165 260 225 260 195" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" />
                        <text x="200" y="225" textAnchor="middle" fill="#FFFFFF" fontFamily="Syne, sans-serif" fontSize="13" fontWeight="800" letterSpacing="4">
                          CHROME 26
                        </text>
                        <text x="200" y="238" textAnchor="middle" fill="#93C5FD" fontFamily="Space Mono, monospace" fontSize="7" letterSpacing="2">
                          KINETIC RESONANCE FREQ.
                        </text>
                      </g>
                    )}

                    {garment.graphicType === 'minimal' && (
                      <g>
                        <path d="M 155 170 L 210 170 L 210 230 L 182.5 245 L 155 230 Z" fill="#E2D9C5" stroke="#8C7F6E" strokeWidth="1" strokeDasharray="2.5 2" />
                        <rect x="153" y="169" width="4" height="2" fill="#B87333" />
                        <rect x="208" y="169" width="4" height="2" fill="#B87333" />
                        <text x="162" y="186" fill="#3D372E" fontFamily="Space Mono, monospace" fontSize="6.5" fontWeight="700">
                          LOT: 04-RAW
                        </text>
                        <text x="162" y="198" fill="#5E5549" fontFamily="Space Mono, monospace" fontSize="5.5">
                          330 GSM WAFFLE
                        </text>
                        <line x1="162" y1="205" x2="202" y2="205" stroke="#7A6F5F" strokeWidth="0.75" />
                        <text x="162" y="218" fill="#5E5549" fontFamily="Space Mono, monospace" fontSize="5">
                          SELVEDGE GRADE A
                        </text>
                      </g>
                    )}

                    {garment.graphicType === 'gradient' && (
                      <g>
                        <circle cx="200" cy="205" r="42" fill="none" stroke="rgba(233, 213, 232, 0.25)" strokeWidth="1" />
                        <circle cx="200" cy="205" r="32" fill="none" stroke={garment.accentColor} strokeWidth="2.5" />
                        <path d="M 200 175 A 30 30 0 0 1 200 235 A 25 25 0 0 0 200 175" fill={garment.accentColor} opacity="0.85" />
                        <text x="200" y="260" textAnchor="middle" fill={garment.accentColor} fontFamily="Syne, sans-serif" fontSize="9.5" fontWeight="700" letterSpacing="3">
                          SOLSTICE
                        </text>
                        <text x="200" y="272" textAnchor="middle" fill="rgba(233, 213, 232, 0.7)" fontFamily="Space Mono, monospace" fontSize="6.5" letterSpacing="1.5">
                          NORTHERN DAWN 2026
                        </text>
                      </g>
                    )}

                    {garment.graphicType === 'typographic' && garment.id === 'ls-carbon' && (
                      <g>
                        <rect x="140" y="180" width="120" height="42" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="4 3" />
                        <text x="200" y="198" textAnchor="middle" fill="#FFFFFF" fontFamily="Space Mono, monospace" fontSize="10.5" fontWeight="700" letterSpacing="2">
                          [CIPHER-X]
                        </text>
                        <text x="200" y="212" textAnchor="middle" fill="#94A3B8" fontFamily="Space Mono, monospace" fontSize="7" letterSpacing="1">
                          70/30 MODAL-POLY // 3M REFLECT
                        </text>
                      </g>
                    )}
                  </g>
                ) : (
                  // BACK VIEW
                  <g id="garment-back-artwork">
                    <circle cx="200" cy="130" r="14" fill="none" stroke={garment.accentColor} strokeWidth="1.2" opacity="0.6" />
                    <text x="200" y="133" textAnchor="middle" fill={garment.accentColor} fontFamily="Space Mono, monospace" fontSize="7" fontWeight="700">
                      AR
                    </text>
                    <text x="200" y="160" textAnchor="middle" fill={garment.accentColor} fontFamily="Space Mono, monospace" fontSize="6.5" opacity="0.75" letterSpacing="2">
                      ATELIER RACK EDITION
                    </text>
                    <path d="M 120 120 Q 200 128 280 120" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5" />
                  </g>
                )}
              </g>

              {/* COLLAR RIBBING & INTERIOR NECK LABEL */}
              <path d="M 152 74 C 172 90 228 90 248 74 C 235 66 165 66 152 74 Z" fill={garment.collarHex} />
              <g>
                <rect x="187" y="70" width="26" height="14" rx="1" fill="#FFFFFF" opacity="0.9" />
                <text x="200" y="78" textAnchor="middle" fill="#1A1A1A" fontFamily="Space Mono, monospace" fontSize="4.5" fontWeight="700">
                  ATELIER
                </text>
                <text x="200" y="82.5" textAnchor="middle" fill="#666666" fontFamily="Space Mono, monospace" fontSize="3.5">
                  SIZE L
                </text>
              </g>

              <path
                d="M 152 74
                   C 168 96 232 96 248 74
                   C 238 88 162 88 152 74 Z"
                fill={garment.collarHex}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="0.8"
              />
              <path d="M 154 77 C 170 93 230 93 246 77" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
