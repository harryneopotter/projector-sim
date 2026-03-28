import { useState } from 'react';
import type { CalculationResult, AmbientLight } from '@/types';
import { AMBIENT_MULTIPLIERS } from '@/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sun, Image as ImageIcon, Film } from 'lucide-react';

interface VisualizationProps {
  resultA: CalculationResult;
  resultB: CalculationResult;
  ambientLight: AmbientLight;
  projectorNameA: string;
  projectorNameB: string;
}

type SampleImage = 'landscape' | 'movie';

export function Visualization({
  resultA,
  resultB,
  ambientLight,
  projectorNameA,
  projectorNameB,
}: VisualizationProps) {
  const [sampleImage, setSampleImage] = useState<SampleImage>('landscape');

  const ambientInfo = AMBIENT_MULTIPLIERS[ambientLight];

  // Normalize both projectors relative to whichever is brighter so the
  // side-by-side preview shows a meaningful visual difference.
  // Without this, typical projectors (>27 adjusted fL) both hit 150% and
  // the two preview images look completely identical.
  const mult = AMBIENT_MULTIPLIERS[ambientLight].multiplier;
  const adjA = resultA.footLamberts * mult;
  const adjB = resultB.footLamberts * mult;
  const maxAdj = Math.max(adjA, adjB);
  // Apply gamma correction (^0.45 ≈ 1/2.2 sRGB) so the CSS filter matches
  // perceptual brightness rather than linear light output. Without this,
  // a projector at 29% linear looks nearly black even if it's fine to watch.
  const normBrightnessA = maxAdj > 0 ? Math.max(10, Math.pow(adjA / maxAdj, 0.45) * 100) : 10;
  const normBrightnessB = maxAdj > 0 ? Math.max(10, Math.pow(adjB / maxAdj, 0.45) * 100) : 10;

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
        <div className="flex items-center gap-3">
          <Tabs value={sampleImage} onValueChange={(v) => setSampleImage(v as SampleImage)}>
            <TabsList className="h-8">
              <TabsTrigger value="landscape" className="text-xs px-3">
                <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                Landscape
              </TabsTrigger>
              <TabsTrigger value="movie" className="text-xs px-3">
                <Film className="w-3.5 h-3.5 mr-1.5" />
                Movie
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Ambient indicator */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
          ambientLight === 'low' ? 'bg-slate-700' : ambientLight === 'medium' ? 'bg-amber-500' : 'bg-orange-500'
        }`}>
          <Sun className="w-3.5 h-3.5" />
        </div>
        <span className="font-medium">{ambientInfo.label}</span>
        <span className="text-slate-400">•</span>
        <span className="text-slate-500">{ambientInfo.description}</span>
      </div>

      {/* Split screen comparison */}
      <div className="grid grid-cols-2 gap-4">
        <ProjectorPreview
          name={projectorNameA}
          result={resultA}
          normBrightness={normBrightnessA}
          sampleImage={sampleImage}
          color="blue"
        />
        <ProjectorPreview
          name={projectorNameB}
          result={resultB}
          normBrightness={normBrightnessB}
          sampleImage={sampleImage}
          color="emerald"
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>{projectorNameA}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>{projectorNameB}</span>
        </div>
      </div>
    </div>
  );
}

interface ProjectorPreviewProps {
  name: string;
  result: CalculationResult;
  normBrightness: number;
  sampleImage: SampleImage;
  color: 'blue' | 'emerald';
}

function ProjectorPreview({
  name,
  result,
  normBrightness,
  sampleImage,
  color,
}: ProjectorPreviewProps) {
  const brightness = normBrightness / 100;
  const contrast = 1 - (result.contrastReduction / 100);

  const ratingColors = {
    'Excellent': 'bg-green-500/25 text-green-200 border-green-400/40',
    'Good':      'bg-blue-500/25 text-blue-200 border-blue-400/40',
    'Fair':      'bg-amber-500/25 text-amber-200 border-amber-400/40',
    'Poor':      'bg-red-500/25 text-red-200 border-red-400/40',
  };

  const borderColor = color === 'blue' ? 'border-blue-500' : 'border-emerald-500';
  const dotColor   = color === 'blue' ? 'bg-blue-400'    : 'bg-emerald-400';

  return (
    <div className={`rounded-xl overflow-hidden border-2 ${borderColor} shadow-lg`}>
      {/* Entire card is the image — stats live as HUD overlays */}
      <div className="relative aspect-video lg:aspect-[16/10] bg-black overflow-hidden">
        {/* Base image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{
            backgroundImage: `url(${sampleImage === 'landscape'
              ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
              : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80'
            })`,
            filter: `brightness(${brightness}) contrast(${contrast})`,
          }}
        />

        {/* Top HUD: name (left) + rating (right) */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-3 pt-2.5 pb-6 bg-gradient-to-b from-black/65 to-transparent pointer-events-none">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${dotColor} shadow-sm`} />
            <span className="font-semibold text-white text-sm drop-shadow truncate">{name}</span>
          </div>
          <Badge variant="outline" className={ratingColors[result.rating]}>
            {result.rating}
          </Badge>
        </div>

        {/* Bottom HUD: fL · nits (left) + visual brightness % (right) */}
        <div className="absolute bottom-0 inset-x-0 flex items-center gap-2 px-3 pb-2.5 pt-6 bg-gradient-to-t from-black/65 to-transparent pointer-events-none">
          <span className="text-white text-xs font-medium drop-shadow">{result.footLamberts.toFixed(1)} fL</span>
          <span className="text-white/50 text-xs">·</span>
          <span className="text-white/80 text-xs drop-shadow">{result.nits.toFixed(1)} nits</span>
          {result.contrastReduction > 0 && (
            <>
              <span className="text-white/50 text-xs">·</span>
              <span className="text-amber-300 text-xs drop-shadow">−{result.contrastReduction}% contrast</span>
            </>
          )}
          <span className="ml-auto text-white/70 text-xs tabular-nums">{Math.round(normBrightness)}%</span>
        </div>

        {/* Bezel shadow */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]" />

        {/* Corner markers — inset from HUD bars */}
        <div className="absolute top-9 left-2 w-4 h-4 border-l-2 border-t-2 border-white/25" />
        <div className="absolute top-9 right-2 w-4 h-4 border-r-2 border-t-2 border-white/25" />
        <div className="absolute bottom-9 left-2 w-4 h-4 border-l-2 border-b-2 border-white/25" />
        <div className="absolute bottom-9 right-2 w-4 h-4 border-r-2 border-b-2 border-white/25" />
      </div>
    </div>
  );
}
