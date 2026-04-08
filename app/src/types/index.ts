export type AmbientLight = 'pitch_black' | 'dim_living_room' | 'bright_room';

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
  pitch_black: {
    multiplier: 1.0, 
    contrastReduction: 0, 
    label: 'Pitch Black',
    description: '0 light dark room'
  },
  dim_living_room: {
    multiplier: 0.85, 
    contrastReduction: 15, 
    label: 'Dim Living Room',
    description: 'Living room with low lights'
  },
  bright_room: {
    multiplier: 0.60, 
    contrastReduction: 40, 
    label: 'Bright Room',
    description: 'Day time usage with windows open'
  },
};

export const DEFAULT_SHARED: SharedParams = {
  screenSize: 100,
  throwDistance: 12,
  viewingDistance: 12,
  ambientLight: 'pitch_black',
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
      ambientLight: 'pitch_black',
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
      ambientLight: 'dim_living_room',
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
      ambientLight: 'bright_room',
    },
    projectorA: { id: 'A', name: 'Standard', lumens: 3000 },
    projectorB: { id: 'B', name: 'High Brightness', lumens: 5000 },
  },
];
