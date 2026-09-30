import { Garment } from '../types.ts';

export const GARMENTS: Garment[] = [
  {
    id: 'tee-monolith',
    name: 'MONOLITH 01',
    subtitle: 'Heavyweight Boxy Graphic Tee',
    category: 't-shirt',
    price: 88,
    edition: 'Edition of 75',
    stock: 14,
    available: true,
    colorName: 'Washed Onyx',
    colorHex: '#1F2022',
    collarHex: '#171819',
    hangerWood: 'walnut',
    fabric: {
      material: '100% Combed Ringspun Cotton',
      weight: '280 GSM Heavy Jersey',
      finish: 'Silicon Enzyme Wash & Carbon Peach',
      origin: 'Wakayama, Japan'
    },
    fit: 'Relaxed drop-shoulder silhouette with wide ribbed collar',
    measurements: {
      chest: '61 cm',
      length: '74 cm',
      shoulder: '55 cm'
    },
    graphicDescription: 'Precision Bauhaus modernist grid layout with structural typographical coordinates.',
    graphicType: 'monolith',
    description: 'Constructed from heavy 280 GSM Japanese combed cotton with a substantial, dry-hand feel. Screen-printed by hand using high-density archival ink that softens naturally with wear.',
    story: 'Designed around architectural Brutalism and modular spatial forms. Each piece is garment-dyed and stone-washed to achieve an authentic vintage patina without sacrificing structural integrity.',
    accentColor: '#E2E8F0'
  },
  {
    id: 'ls-terracotta',
    name: 'TERRA FORM',
    subtitle: 'Artisanal Ribbed Long-Sleeve',
    category: 'long-sleeve',
    price: 110,
    edition: 'Edition of 60',
    stock: 8,
    available: true,
    colorName: 'Terracotta Clay',
    colorHex: '#C86446',
    collarHex: '#B25438',
    hangerWood: 'oak',
    fabric: {
      material: '100% Organic Pima Cotton',
      weight: '260 GSM Dense Knit',
      finish: 'Bio-Polished Pigment Dye',
      origin: 'Lima, Peru'
    },
    fit: 'Tailored drape with extended articulated sleeve cuffs',
    measurements: {
      chest: '57 cm',
      length: '72 cm',
      shoulder: '51 cm'
    },
    graphicDescription: 'Tectonic elevation contours along the left forearm and understated geometric chest mark.',
    graphicType: 'typographic',
    description: 'An earthy, tactile long-sleeve knit dyed with mineral clays. Features flatlock stitching throughout and 2x1 rib knit cuffs that hold their shape season after season.',
    story: 'Formed from geological strata studies and terracotta kiln firings. The mineral pigment yields natural micro-variations across every individual garment.',
    accentColor: '#FBD5C5'
  },
  {
    id: 'tee-botanic',
    name: 'BOTANIC SYSTEM',
    subtitle: 'Relaxed Studio Specimen Tee',
    category: 't-shirt',
    price: 82,
    edition: 'Edition of 90',
    stock: 22,
    available: true,
    colorName: 'Pale Sage',
    colorHex: '#7C8E7E',
    collarHex: '#697B6B',
    hangerWood: 'natural-birch',
    fabric: {
      material: '100% GOTS Certified Organic Cotton',
      weight: '240 GSM Combed Jersey',
      finish: 'Natural Tea Tint Soft Wash',
      origin: 'Porto, Portugal'
    },
    fit: 'Square box cut with relaxed elbow-length sleeves',
    measurements: {
      chest: '59 cm',
      length: '71 cm',
      shoulder: '53 cm'
    },
    graphicDescription: 'Herbarium scientific line engraving paired with minimal botanical classification script.',
    graphicType: 'botanical',
    description: 'Woven with gentle organic yarn in Portugal, offering a smooth, cooling handfeel and effortless drape. The botanical illustration is rendered with ultrafine hairline discharge print.',
    story: 'Inspired by historical 19th-century botanical presses and alpine taxonomy. The botanical specimen depicted is Artemisia Absinthium, drawn by hand in our studio.',
    accentColor: '#D2DDD4'
  },
  {
    id: 'tee-chrome',
    name: 'CHROME HORIZON',
    subtitle: 'Kinetic Wave Streetwear Tee',
    category: 't-shirt',
    price: 94,
    edition: 'Edition of 50',
    stock: 5,
    available: true,
    colorName: 'Cobalt Depth',
    colorHex: '#254EAA',
    collarHex: '#1E3F8C',
    hangerWood: 'walnut',
    fabric: {
      material: '92% Heavy Cotton, 8% Elastane',
      weight: '270 GSM Sculpted Jersey',
      finish: 'Silicone Softened Matte Finish',
      origin: 'Seoul, South Korea'
    },
    fit: 'Oversized boxy streetwear drape with drop shoulders',
    measurements: {
      chest: '63 cm',
      length: '76 cm',
      shoulder: '57 cm'
    },
    graphicDescription: 'Liquid chrome wave typographic abstraction with subtle metallic foil sheen.',
    graphicType: 'abstract',
    description: 'A striking statement piece rendered in intense cobalt dye. The chest artwork employs a duel-technique foil and matte plastisol print for tactile dimension under light.',
    story: 'Exploring the boundary between organic fluidity and digital synthetic materials. The print shifts specular sheen as you move around the garment.',
    accentColor: '#93C5FD'
  },
  {
    id: 'ls-ecru',
    name: 'ATELIER RAW',
    subtitle: 'Selvedge Thermal Long-Sleeve',
    category: 'long-sleeve',
    price: 125,
    edition: 'Edition of 40',
    stock: 3,
    available: true,
    colorName: 'Unbleached Ecru',
    colorHex: '#EDE6D6',
    collarHex: '#DBD2BE',
    hangerWood: 'oak',
    fabric: {
      material: '100% Unbleached Raw Cotton Waffle',
      weight: '330 GSM Heavy Honeycomb Knit',
      finish: 'Raw Seed-Speckled Natural Finish',
      origin: 'Okayama, Japan'
    },
    fit: 'Regular workwear silhouette with reinforced elbows',
    measurements: {
      chest: '56 cm',
      length: '73 cm',
      shoulder: '49 cm'
    },
    graphicDescription: 'Architectural atelier blueprint stamping on front patch pocket with copper thread stitching.',
    graphicType: 'minimal',
    description: 'Constructed from heavy 330 GSM unbleached honeycomb waffle knit with natural cotton seed specks preserved throughout. Raw selvedge binding at the hem and custom copper bar tacks.',
    story: 'A tribute to the traditional Japanese weaving mills of Kurashiki. No chemical bleaches or synthetic softeners are used at any stage of manufacturing.',
    accentColor: '#3A3834'
  },
  {
    id: 'tee-dusk',
    name: 'DUSK GRADIENT',
    subtitle: 'Atmospheric Solstice Tee',
    category: 't-shirt',
    price: 86,
    edition: 'Edition of 80',
    stock: 19,
    available: true,
    colorName: 'Plum Solstice',
    colorHex: '#4E384D',
    collarHex: '#3E2B3D',
    hangerWood: 'natural-birch',
    fabric: {
      material: '100% Combed Compact Cotton',
      weight: '230 GSM Feather-Weight Heavy',
      finish: 'Dip-Spray Gradient Wash',
      origin: 'Milan, Italy'
    },
    fit: 'Clean modern drape with tailored arm openings',
    measurements: {
      chest: '58 cm',
      length: '72 cm',
      shoulder: '52 cm'
    },
    graphicDescription: 'Circular eclipse geometry with delicate radial spectrum lines.',
    graphicType: 'gradient',
    description: 'Dyed in deep Italian plum tones with subtle atmospheric variation. The circular eclipse graphic incorporates micro-perforated ink for breathability.',
    story: 'Capturing the precise light tone of twilight during astronomical twilight in northern Scandinavia.',
    accentColor: '#E9D5E8'
  },
  {
    id: 'ls-carbon',
    name: 'CARBON CIPHER',
    subtitle: 'Technical Micro-Grid Long-Sleeve',
    category: 'long-sleeve',
    price: 118,
    edition: 'Edition of 65',
    stock: 11,
    available: true,
    colorName: 'Carbon Melange',
    colorHex: '#34383D',
    collarHex: '#272A2E',
    hangerWood: 'walnut',
    fabric: {
      material: '70% Cotton, 30% Recycled Technical Poly',
      weight: '280 GSM Interlock Knit',
      finish: 'Durable Anti-Pill Hydrophilic Weave',
      origin: 'Biella, Italy'
    },
    fit: 'Ergonomic raglan cut with articulated thumb loops',
    measurements: {
      chest: '58 cm',
      length: '74 cm',
      shoulder: '50 cm'
    },
    graphicDescription: 'Reflective 3M micro-coordinate cipher print centered across the sternum.',
    graphicType: 'typographic',
    description: 'Technical street knit designed for urban movement. Features concealed thumb slits in the cuffs, seamless underarm gussets, and high-visibility reflective micro-typography.',
    story: 'Engineered for night cyclists and nocturnal flâneurs. The subtle chest cipher reveals luminous silver reflection under direct evening headlights.',
    accentColor: '#94A3B8'
  }
];
