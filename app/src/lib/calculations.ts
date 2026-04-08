import type { SharedParams, Projector, CalculationResult, AmbientLight, BrightnessRating } from '@/types';
import { AMBIENT_MULTIPLIERS } from '@/types';

type BrightnessStatus = 'too-dim' | 'dim' | 'good' | 'ideal' | 'reference';

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
  pitch_black: {
    minimum: 15,
    acceptableMin: 25,
    idealMin: 35,
    idealMax: 120,
    acceptableMax: 250,
  },
  dim_living_room: {
    minimum: 25,
    acceptableMin: 45,
    idealMin: 65,
    idealMax: 180,
    acceptableMax: 350,
  },
  bright_room: {
    minimum: 60,
    acceptableMin: 100,
    idealMin: 150,
    idealMax: 300,
    acceptableMax: 600,
  },
};


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
    return { adjustedFL, status: 'good', rating: 'Good', profile };
  }

  if (adjustedFL <= profile.idealMax) {
    return { adjustedFL, status: 'ideal', rating: 'Excellent', profile };
  }

  return { adjustedFL, status: 'reference', rating: 'Excellent', profile };
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
  const { idealMin } = assessment.profile;
  const { adjustedFL } = assessment;

  const baseScore: Record<BrightnessStatus, number> = {
    reference: 500,
    ideal: 450,
    good: 350,
    dim: 200,
    'too-dim': 100,
  };

  // Higher is better, but diminishing returns above idealMin
  const bonus = adjustedFL >= idealMin ? Math.min(50, (adjustedFL - idealMin) / 10) : 0;
  const penalty = adjustedFL < idealMin ? (idealMin - adjustedFL) : 0;

  return baseScore[assessment.status] + bonus - penalty;
}

/**
 * Get recommendation text based on rating
 */
export function getRecommendation(footLamberts: number, ambientLight: AmbientLight): string {
  const ambientLabel = AMBIENT_MULTIPLIERS[ambientLight].label.toLowerCase();
  const { adjustedFL, status, profile } = assessBrightness(footLamberts, ambientLight);

  switch (status) {
    case 'reference':
      return `Outstanding brightness of ${adjustedFL.toFixed(1)} effective fL. This provides incredible HDR punch and clarity even in ${ambientLabel} environments.`;
    case 'ideal':
      return `Excellent fit. Hits the recommended ${profile.idealMin}-${profile.idealMax} fL target for ${ambientLabel} viewing, ensuring a vibrant image.`;
    case 'good':
      return `Good performance. While slightly below the top tier, it provides a solid image for ${ambientLabel} usage.`;
    case 'dim':
      return `Functional but dim. At ${adjustedFL.toFixed(1)} effective fL, the image will look washed out in ${ambientLabel} conditions.`;
    case 'too-dim':
      return `Too dim for ${ambientLabel} viewing. At roughly ${adjustedFL.toFixed(1)} effective fL, you will struggle to see detail.`;
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
