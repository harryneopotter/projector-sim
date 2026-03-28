import type { SharedParams, Projector, CalculationResult, AmbientLight } from '@/types';
import { AMBIENT_MULTIPLIERS } from '@/types';

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

/**
 * Get brightness rating based on foot-lamberts and ambient light
 */
export function getBrightnessRating(
  footLamberts: number, 
  ambientLight: AmbientLight
): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
  const { multiplier } = AMBIENT_MULTIPLIERS[ambientLight];
  const adjustedFL = footLamberts * multiplier;
  
  // Thresholds for adjusted fL (raw fL × ambient multiplier).
  // Medium/high values calibrated so that industry-standard lumen
  // recommendations earn the expected rating on a 100" screen:
  //   medium (living room): ~2500 lm → Excellent, ~1200 lm → Good
  //   high (bright room):   ~5000 lm → Excellent, ~3000 lm → Good
  const thresholds = {
    low:    { excellent: 16, good: 12, fair:  8 },
    medium: { excellent: 55, good: 38, fair: 22 },
    high:   { excellent: 100, good: 60, fair: 30 },
  };
  
  const t = thresholds[ambientLight];
  
  if (adjustedFL >= t.excellent) return 'Excellent';
  if (adjustedFL >= t.good) return 'Good';
  if (adjustedFL >= t.fair) return 'Fair';
  return 'Poor';
}

/**
 * Get recommendation text based on rating
 */
export function getRecommendation(rating: string, ambientLight: AmbientLight): string {
  const ambientLabel = AMBIENT_MULTIPLIERS[ambientLight].label.toLowerCase();
  
  switch (rating) {
    case 'Excellent':
      return `Perfect for ${ambientLabel} viewing. Vibrant colors and excellent contrast.`;
    case 'Good':
      return `Great for ${ambientLabel} viewing. Good image quality with solid contrast.`;
    case 'Fair':
      return `Acceptable for ${ambientLabel} viewing. Consider a brighter projector or smaller screen.`;
    case 'Poor':
      return `Too dim for ${ambientLabel} viewing. Recommend brighter projector or smaller screen.`;
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
  const recommendation = getRecommendation(rating, sharedParams.ambientLight);
  
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
