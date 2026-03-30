import type { CalculationResult, AmbientLight } from '@/types';
import { AMBIENT_MULTIPLIERS } from '@/types';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy,
  TrendingUp,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ResultsPanelProps {
  resultA: CalculationResult;
  resultB: CalculationResult;
  projectorNameA: string;
  projectorNameB: string;
  ambientLight: AmbientLight;
  screenSize: number;
}

/**
 * Render a recommendation panel comparing two projector measurement results and highlighting a top pick.
 *
 * Renders a "Recommendation" section that identifies the brighter projector, shows the brightness difference and ratio, displays the selected recommendation text for the winner, and provides a checklist of pass/warn indicators.
 *
 * @param resultA - Measurement and recommendation data for projector A
 * @param resultB - Measurement and recommendation data for projector B
 * @param projectorNameA - Display name for projector A
 * @param projectorNameB - Display name for projector B
 * @param ambientLight - Ambient light level key used to look up labels (e.g., 'low', 'medium', 'high')
 * @param screenSize - Screen diagonal size in inches
 * @returns The rendered React element containing the recommendation, key comparison, and checklist UI
 */
export function ResultsPanel({
  resultA,
  resultB,
  projectorNameA,
  projectorNameB,
  ambientLight,
  screenSize,
}: ResultsPanelProps) {
  const winner = resultA.footLamberts > resultB.footLamberts ? 'A' : 'B';
  const winnerName = winner === 'A' ? projectorNameA : projectorNameB;
  const diff = Math.abs(resultA.footLamberts - resultB.footLamberts);
  const diffPercent = Math.round((diff / Math.min(resultA.footLamberts, resultB.footLamberts)) * 100);

  const ambientLabel = AMBIENT_MULTIPLIERS[ambientLight].label;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight uppercase tracking-tighter">Recommendation</h2>
      </div>

      {/* Winner Spotlight */}
      <div className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3">
           <Sparkles className="w-4 h-4 text-blue-500/20" />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Top Pick</p>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight truncate mb-2">{winnerName}</h3>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-blue-600 text-white border-none text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
              Winner
            </Badge>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{diffPercent}% Brighter
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {winner === 'A' ? resultA.recommendation : resultB.recommendation}
          </p>
        </div>
      </div>

      {/* Detailed comparison */}
      <div className="space-y-4 pt-4 border-t dark:border-slate-800">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Comparison</h4>
        
        <div className="space-y-3">
           <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Difference</span>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-none">
                {diff.toFixed(1)} <span className="text-[10px] text-slate-400">fL</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Ratio</span>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-none">
                {(Math.min(resultA.footLamberts, resultB.footLamberts) > 0
                  ? (Math.max(resultA.footLamberts, resultB.footLamberts) / Math.min(resultA.footLamberts, resultB.footLamberts)).toFixed(2)
                  : '∞')}x
              </p>
            </div>
          </div>

          <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-blue-800 dark:text-blue-300 leading-normal font-medium">
              On a <strong>{screenSize}" screen</strong> in a <strong>{ambientLabel}</strong>, the difference between these units is <strong>highly visible</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3 pt-4 border-t dark:border-slate-800">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checklist</h4>
        <div className="space-y-2">
          <CheckItem label="Brightness Goal" status={Math.max(resultA.footLamberts, resultB.footLamberts) >= 16 ? 'pass' : 'warn'} />
          <CheckItem label="Ambient Contrast" status={ambientLight === 'low' ? 'pass' : 'warn'} />
          <CheckItem label="Visual Comfort" status="pass" />
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a single checklist row with a label and a status icon.
 *
 * Displays `label` on the left and an icon on the right indicating `status`:
 * - `pass`: green check circle
 * - `warn`: amber warning triangle
 * - `fail`: red warning triangle
 *
 * @param label - Text shown for the checklist item
 * @param status - One of `'pass' | 'warn' | 'fail'` that selects icon and color
 * @returns A JSX element containing the labeled status row
 */
function CheckItem({ label, status }: { label: string; status: 'pass' | 'warn' | 'fail' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">{label}</span>
      {status === 'pass' ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
      ) : status === 'warn' ? (
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
      ) : (
        <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
      )}
    </div>
  );
}
