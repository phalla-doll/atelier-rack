export type GarmentCategory = 't-shirt' | 'long-sleeve';

export interface Garment {
  id: string;
  name: string;
  subtitle: string;
  category: GarmentCategory;
  price: number;
  edition: string;
  stock: number;
  available: boolean;
  colorName: string;
  colorHex: string;
  collarHex: string;
  hangerWood: 'walnut' | 'oak' | 'natural-birch';
  fabric: {
    material: string;
    weight: string;
    finish: string;
    origin: string;
  };
  fit: string;
  measurements: {
    chest: string;
    length: string;
    shoulder: string;
  };
  graphicDescription: string;
  graphicType: 'typographic' | 'botanical' | 'abstract' | 'minimal' | 'monolith' | 'gradient';
  description: string;
  story: string;
  accentColor: string;
}

export interface PhysicsState {
  angle: number; // in radians or degrees
  angularVelocity: number;
  clothBend: number; // sway distortion factor
  isDragging: boolean;
  offsetX: number; // sliding on rod
  targetOffsetX: number;
}
