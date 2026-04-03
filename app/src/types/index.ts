export type AmbientLight = 'low' | 'medium' | 'high';

export interface SharedParams {
  screenSize: number; // inches
  throwDistance: number; // feet
  viewingDistance: number; // feet
  ambientLight: AmbientLight;
}

export interface Projector {
  id: 'A' | 'B';
  name: string;
  lumens: number;
}

export type BrightnessRating = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export interface CalculationResult {
  footLamberts: number;
  nits: number;
  visualBrightness: number; // percentage for CSS filter
  contrastReduction: number; // percentage
  rating: BrightnessRating;
  recommendation: string;
}

export interface Preset {
  name: string;
  description: string;
  shared: SharedParams;
  projectorA: Projector;
  projectorB: Projector;
}

export const AMBIENT_MULTIPLIERS: Record<AmbientLight, { multiplier: number; contrastReduction: number; label: string; description: string }> = {
  low: { 
    multiplier: 1.0, 
    contrastReduction: 0, 
    label: 'Dark Room',
    description: 'Dedicated theater room with light control'
  },
  medium: { 
    multiplier: 0.85, 
    contrastReduction: 15, 
    label: 'Living Room',
    description: 'Typical room with some ambient light'
  },
  high: { 
    multiplier: 0.60, 
    contrastReduction: 40, 
    label: 'Bright Room',
    description: 'Daylight or well-lit room'
  },
};

export const DEFAULT_SHARED: SharedParams = {
  screenSize: 100,
  throwDistance: 12,
  viewingDistance: 12,
  ambientLight: 'low',
};

export const DEFAULT_PROJECTOR_A: Projector = {
  id: 'A',
  name: 'Projector A',
  lumens: 2000,
};

export const DEFAULT_PROJECTOR_B: Projector = {
  id: 'B',
  name: 'Projector B',
  lumens: 3500,
};

export const PRESETS: Preset[] = [
  {
    name: 'Dark Room Theater',
    description: '100" screen in dedicated theater room',
    shared: {
      screenSize: 100,
      throwDistance: 12,
      viewingDistance: 12,
      ambientLight: 'low',
    },
    projectorA: { id: 'A', name: 'Entry Level', lumens: 2000 },
    projectorB: { id: 'B', name: 'Mid Range', lumens: 3500 },
  },
  {
    name: 'Living Room Setup',
    description: '120" screen with some ambient light',
    shared: {
      screenSize: 120,
      throwDistance: 14,
      viewingDistance: 10,
      ambientLight: 'medium',
    },
    projectorA: { id: 'A', name: 'Budget Option', lumens: 2500 },
    projectorB: { id: 'B', name: 'Premium Option', lumens: 4000 },
  },
  {
    name: 'Bright Room Challenge',
    description: '150" screen in bright room',
    shared: {
      screenSize: 150,
      throwDistance: 16,
      viewingDistance: 12,
      ambientLight: 'high',
    },
    projectorA: { id: 'A', name: 'Standard', lumens: 3000 },
    projectorB: { id: 'B', name: 'High Brightness', lumens: 5000 },
  },
];
