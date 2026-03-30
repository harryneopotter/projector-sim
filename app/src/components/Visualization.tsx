import { useState, useRef, useEffect, type MouseEvent, type TouchEvent } from 'react';
import type { CalculationResult, AmbientLight } from '@/types';
import { AMBIENT_MULTIPLIERS } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Sun, MoveHorizontal } from 'lucide-react';

interface VisualizationProps {
  resultA: CalculationResult;
  resultB: CalculationResult;
  ambientLight: AmbientLight;
  projectorNameA: string;
  projectorNameB: string;
}

type SampleImage = 'landscape' | 'movie';

const SCENES: { id: SampleImage; label: string; url: string }[] = [
  {
    id: 'landscape',
    label: 'Landscape',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
  },
  {
    id: 'movie',
    label: 'Movie',
    url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80',
  },
];

/**
 * Renders an interactive side-by-side projector comparison view with a draggable vertical split, scene selector, ambient-light context, and per-projector stats.
 *
 * Displays projector B as the background and projector A clipped to the left by the slider. Shows ambient lighting label/description, clickable scene thumbnails to change the background, persistent corner badges for projector names, and a two-panel stats summary. The split position is driven by pointer/touch movement and the component tracks its container width to align the clipped left layer.
 *
 * @param resultA - Measurement and rating data for projector A
 * @param resultB - Measurement and rating data for projector B
 * @param ambientLight - Ambient lighting preset key used to adjust displayed brightness and label/description
 * @param projectorNameA - Display name for projector A (left)
 * @param projectorNameB - Display name for projector B (right)
 * @returns The rendered projector comparison visualization element
 */
export function Visualization({
  resultA,
  resultB,
  ambientLight,
  projectorNameA,
  projectorNameB,
}: VisualizationProps) {
  const [sampleImage, setSampleImage] = useState<SampleImage>('landscape');
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const ambientInfo = AMBIENT_MULTIPLIERS[ambientLight];

  const mult = AMBIENT_MULTIPLIERS[ambientLight].multiplier;
  const adjA = resultA.footLamberts * mult;
  const adjB = resultB.footLamberts * mult;
  const maxAdj = Math.max(adjA, adjB);

  const normBrightnessA = maxAdj > 0 ? Math.max(10, Math.pow(adjA / maxAdj, 0.45) * 100) : 10;
  const normBrightnessB = maxAdj > 0 ? Math.max(10, Math.pow(adjB / maxAdj, 0.45) * 100) : 10;

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const pos = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, pos)));
  };

  const scene = SCENES.find(s => s.id === sampleImage) || SCENES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Projector Comparison</h2>
          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
            <Sun className="w-4 h-4" />
            <span>{ambientInfo.label}</span>
            <span>•</span>
            <span>{ambientInfo.description}</span>
          </div>
        </div>

        {/* Scene Selector */}
        <div className="flex items-center gap-2">
          {SCENES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSampleImage(s.id)}
              className={`group relative w-20 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                sampleImage === s.id
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <img src={s.url} alt={s.label} className="absolute inset-0 w-full h-full object-cover" />
              <div className={`absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors ${
                sampleImage === s.id ? 'bg-black/10' : ''
              }`}>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{s.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Comparison Hero */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-2xl overflow-hidden border-4 border-slate-200 dark:border-slate-800 shadow-2xl cursor-col-resize group select-none"
        onMouseMove={handleMove}
        onTouchMove={handleMove}
      >
        {/* Projector B (Right Side / Background) */}
        <div className="absolute inset-0">
          <ProjectorLayer
            result={resultB}
            normBrightness={normBrightnessB}
            sceneUrl={scene.url}
            side="right"
          />
        </div>

        {/* Projector A (Left Side / Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden border-r border-white/50 z-10"
          style={{ width: `${sliderPos}%` }}
        >
          <div
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: containerWidth }}
          >
             <ProjectorLayer
              result={resultA}
              normBrightness={normBrightnessA}
              sceneUrl={scene.url}
              side="left"
            />
          </div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center z-20"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center -ml-0.5 border-2 border-slate-200">
            <MoveHorizontal className="w-4 h-4 text-slate-600" />
          </div>
          {/* Tooltip hint */}
          <div className="absolute top-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Drag to compare
          </div>
        </div>

        {/* Labels HUD - Persistent on corners */}
        <div className="absolute inset-x-0 top-0 p-4 flex justify-between pointer-events-none z-30">
          <Badge variant="secondary" className="bg-blue-600 text-white border-none shadow-lg backdrop-blur-md">
            {projectorNameA}
          </Badge>
          <Badge variant="secondary" className="bg-emerald-600 text-white border-none shadow-lg backdrop-blur-md">
            {projectorNameB}
          </Badge>
        </div>
      </div>

      {/* Quick Stats Legend */}
      <div className="grid grid-cols-2 gap-4">
        <StatsSummary projectorName={projectorNameA} result={resultA} color="blue" />
        <StatsSummary projectorName={projectorNameB} result={resultB} color="emerald" />
      </div>
    </div>
  );
}

/**
 * Renders a projector visual layer showing the scene background, adjusted image filters, and a HUD with rating and luminance.
 *
 * @param result - Calculation result containing display metrics; expects `footLamberts`, `contrastReduction`, and `rating`
 * @param normBrightness - Normalized brightness (0–100) used to compute the layer's CSS brightness
 * @param sceneUrl - URL of the background scene image for this layer
 * @param side - Side for HUD and bezel placement; either `'left'` or `'right'`
 * @returns The rendered projector visual layer element
 */
function ProjectorLayer({
  result,
  normBrightness,
  sceneUrl,
  side
}: {
  result: CalculationResult;
  normBrightness: number;
  sceneUrl: string;
  side: 'left' | 'right';
}) {
  const brightness = normBrightness / 100;
  const contrast = 1 - (result.contrastReduction / 100);

  const ratingColors = {
    'Excellent': 'text-green-400',
    'Good':      'text-blue-400',
    'Fair':      'text-amber-400',
    'Poor':      'text-red-400',
  };

  return (
    <div className="relative w-full h-full bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${sceneUrl})`,
          filter: `brightness(${brightness}) contrast(${contrast})`,
        }}
      />

      {/* HUD Info Overlay */}
      <div className={`absolute bottom-0 ${side === 'left' ? 'left-0' : 'right-0'} p-4 sm:p-6 pointer-events-none`}>
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-2 sm:p-3 rounded-xl shadow-2xl">
          <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
             <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${ratingColors[result.rating]}`}>
               {result.rating}
             </span>
          </div>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-xl sm:text-2xl font-black text-white">{result.footLamberts.toFixed(1)}</span>
            <span className="text-[10px] sm:text-xs font-bold text-white/60 uppercase">fL</span>
          </div>
        </div>
      </div>

      {/* Aesthetic Bezel Corner */}
      <div className={`absolute ${side === 'left' ? 'top-10 left-6 border-l-2' : 'top-10 right-6 border-r-2'} w-8 h-8 border-t-2 border-white/20 pointer-events-none`} />
    </div>
  );
}

/**
 * Renders a compact stats panel showing a projector label, its measured foot-lamberts, and nits.
 *
 * The panel's accent colors are selected by `color` and the layout adapts for small screens
 * (hiding the nits value on narrow viewports).
 *
 * @param projectorName - Display name shown in the panel header (uppercase).
 * @param result - Measurement results used to display `footLamberts` and `nits`.
 * @param color - Accent color theme for the panel; controls background, text, and dot colors.
 * @returns A JSX element containing the styled stats summary for the specified projector.
 */
function StatsSummary({ projectorName, result, color }: { projectorName: string; result: CalculationResult; color: 'blue' | 'emerald' }) {
  const bgColor = color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-emerald-50 dark:bg-emerald-900/10';
  const textColor = color === 'blue' ? 'text-blue-700 dark:text-blue-300' : 'text-emerald-700 dark:text-emerald-300';
  const dotColor = color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500';

  return (
    <div className={`p-3 rounded-xl ${bgColor} border border-transparent dark:border-white/5`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span className={`text-[10px] font-bold uppercase tracking-wider ${textColor}`}>{projectorName}</span>
      </div>
      <div className="flex justify-between items-end">
        <span className="text-lg font-bold dark:text-white">{result.footLamberts} <span className="text-[10px] text-slate-500">fL</span></span>
        <span className="hidden sm:inline text-xs text-slate-500">{result.nits} nits</span>
      </div>
    </div>
  );
}
