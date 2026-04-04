import type { SharedParams, Projector, CalculationResult, AmbientLight, BrightnessRating } from '@/types';
import { AMBIENT_MULTIPLIERS } from '@/types';

type BrightnessStatus = 'too-dim' | 'dim' | 'ideal' | 'bright' | 'too-bright';

interface BrightnessProfile {
  minimum: number;
  acceptableMin: number;
  idealMin: number;
  idealMax: number;
  acceptableMax: number;
}

interface BrightnessAssessment {
  adjustedFL: number;
  status: BrightnessStatus;
  rating: BrightnessRating;
  profile: BrightnessProfile;
}

const BRIGHTNESS_PROFILES: Record<AmbientLight, BrightnessProfile> = {
  low: {
    minimum: 8,
    acceptableMin: 12,
    idealMin: 16,
    idealMax: 22,
    acceptableMax: 30,
  },
  medium: {
    minimum: 14,
    acceptableMin: 22,
    idealMin: 30,
    idealMax: 50,
    acceptableMax: 65,
  },
  high: {
    minimum: 20,
    acceptableMin: 30,
    idealMin: 45,
    idealMax: 75,
    acceptableMax: 100,
  },
};

const IDEAL_RANGE_PENALTY_FACTOR = 0.25;

/**
 * Calculate screen dimensions from diagonal (16:9 aspect ratio)
 */
export function calculateScreenDimensions(diagonalInches: number): { width: number; height: number; areaSqFt: number } {
  // 16:9 aspect ratio calculations
  const width = diagonalInches * 0.8716;
  const height = diagonalInches * 0.4903;
  const areaSqFt = (width * height) / 144;
  
  return { width, height, areaSqFt };
}

/**
 * Calculate foot-lamberts (fL) - industry standard for projected brightness
 * fL = (Projector Lumens × Screen Gain) / Screen Area (sq ft)
 * Screen Gain = 1.0 (neutral matte screen)
 */
export function calculateFootLamberts(lumens: number, screenSize: number): number {
  const { areaSqFt } = calculateScreenDimensions(screenSize);
  const screenGain = 1.0;
  
  if (areaSqFt <= 0) return 0;
  
  return (lumens * screenGain) / areaSqFt;
}

/**
 * Convert foot-lamberts to nits
 * 1 fL ≈ 3.426 nits
 */
export function footLambertsToNits(footLamberts: number): number {
  return footLamberts * 3.426;
}

/**
 * Calculate visual brightness percentage for CSS rendering
 * visual_brightness = max( (fL × ambient_multiplier) / 18 × 100, 20 )
 * where 18 fL ≈ "perfect" dark-room reference for home theater.
 * No upper clamp — values over 100% mean the projector exceeds the reference.
 */
export function calculateVisualBrightness(
  footLamberts: number, 
  ambientLight: AmbientLight
): number {
  const { multiplier } = AMBIENT_MULTIPLIERS[ambientLight];
  const adjustedFL = footLamberts * multiplier;
  
  // 18 fL is the reference "perfect" brightness
  const visualBrightness = (adjustedFL / 18) * 100;
  
  // Floor at 20% so even very dim setups render something visible
  return Math.max(20, visualBrightness);
}

export function getBrightnessProfile(ambientLight: AmbientLight): BrightnessProfile {
  return BRIGHTNESS_PROFILES[ambientLight];
}

export function assessBrightness(footLamberts: number, ambientLight: AmbientLight): BrightnessAssessment {
  const { multiplier } = AMBIENT_MULTIPLIERS[ambientLight];
  const adjustedFL = footLamberts * multiplier;
  const profile = getBrightnessProfile(ambientLight);

  if (adjustedFL < profile.minimum) {
    return { adjustedFL, status: 'too-dim', rating: 'Poor', profile };
  }

  if (adjustedFL < profile.acceptableMin) {
    return { adjustedFL, status: 'dim', rating: 'Fair', profile };
  }

  if (adjustedFL < profile.idealMin) {
    return { adjustedFL, status: 'dim', rating: 'Good', profile };
  }

  if (adjustedFL <= profile.idealMax) {
    return { adjustedFL, status: 'ideal', rating: 'Excellent', profile };
  }

  if (adjustedFL <= profile.acceptableMax) {
    return { adjustedFL, status: 'bright', rating: 'Good', profile };
  }

  return { adjustedFL, status: 'too-bright', rating: 'Good', profile };
}

/**
 * Get brightness rating based on foot-lamberts and ambient light
 */
export function getBrightnessRating(
  footLamberts: number, 
  ambientLight: AmbientLight
): BrightnessRating {
  return assessBrightness(footLamberts, ambientLight).rating;
}

export function getBrightnessFitScore(footLamberts: number, ambientLight: AmbientLight): number {
  const assessment = assessBrightness(footLamberts, ambientLight);
  const distanceToIdeal =
    assessment.adjustedFL < assessment.profile.idealMin
      ? assessment.profile.idealMin - assessment.adjustedFL
      : assessment.adjustedFL > assessment.profile.idealMax
        ? assessment.adjustedFL - assessment.profile.idealMax
        : Math.abs(assessment.adjustedFL - ((assessment.profile.idealMin + assessment.profile.idealMax) / 2)) * IDEAL_RANGE_PENALTY_FACTOR;

  const baseScore: Record<BrightnessStatus, number> = {
    ideal: 400,
    bright: 300,
    dim: 250,
    'too-bright': 180,
    'too-dim': 100,
  };

  return baseScore[assessment.status] - distanceToIdeal;
}

/**
 * Get recommendation text based on rating
 */
export function getRecommendation(footLamberts: number, ambientLight: AmbientLight): string {
  const ambientLabel = AMBIENT_MULTIPLIERS[ambientLight].label.toLowerCase();
  const { adjustedFL, status, profile } = assessBrightness(footLamberts, ambientLight);

  switch (status) {
    case 'ideal':
      return `Hits the recommended ${profile.idealMin}-${profile.idealMax} fL target for ${ambientLabel} viewing.`;
    case 'bright':
      return `Brighter than the usual ${ambientLabel} target, but still usable if you prefer a punchier image.`;
    case 'too-bright':
      return `Well above the recommended ${profile.idealMin}-${profile.idealMax} fL target for ${ambientLabel} viewing and may feel harsh in darker scenes.`;
    case 'dim':
      return `A bit under the recommended ${profile.idealMin}-${profile.idealMax} fL target for ${ambientLabel} viewing.`;
    case 'too-dim':
      return `Too dim for ${ambientLabel} viewing at roughly ${adjustedFL.toFixed(1)} effective fL.`;
    default:
      return '';
  }
}

/**
 * Main calculation function that returns all results for a projector
 */
export function calculateProjector(
  projector: Projector,
  sharedParams: SharedParams
): CalculationResult {
  const footLamberts = calculateFootLamberts(projector.lumens, sharedParams.screenSize);
  const nits = footLambertsToNits(footLamberts);
  const visualBrightness = calculateVisualBrightness(footLamberts, sharedParams.ambientLight);
  const { contrastReduction } = AMBIENT_MULTIPLIERS[sharedParams.ambientLight];
  const rating = getBrightnessRating(footLamberts, sharedParams.ambientLight);
  const recommendation = getRecommendation(footLamberts, sharedParams.ambientLight);
  
  return {
    footLamberts: Math.round(footLamberts * 10) / 10,
    nits: Math.round(nits * 10) / 10,
    visualBrightness: Math.round(visualBrightness * 10) / 10,
    contrastReduction,
    rating,
    recommendation,
  };
}

/**
 * Format number with units
 */
export function formatFL(value: number): string {
  return `${value.toFixed(1)} fL`;
}

export function formatNits(value: number): string {
  return `${value.toFixed(1)} nits`;
}

export function formatBrightness(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Get throw ratio warning
 * Most standard-throw projectors need ~1.2-2.0:1 throw ratio
 */
export function getThrowRatioWarning(screenSize: number, throwDistance: number): string | null {
  const { width } = calculateScreenDimensions(screenSize);
  const widthFt = width / 12;
  const throwRatio = throwDistance / widthFt;
  
  if (throwRatio < 1.0) {
    return 'Throw ratio is very short. You may need a short-throw projector.';
  }
  if (throwRatio > 2.5) {
    return 'Throw ratio is quite long. Ensure your projector supports this distance.';
  }
  return null;
}
