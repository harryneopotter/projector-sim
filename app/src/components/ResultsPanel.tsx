import type { CalculationResult, AmbientLight } from '@/types';
import { AMBIENT_MULTIPLIERS } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sun, 
  Monitor, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Info,
  TrendingUp,
  Minus
} from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';

interface ResultsPanelProps {
  resultA: CalculationResult;
  resultB: CalculationResult;
  projectorNameA: string;
  projectorNameB: string;
  ambientLight: AmbientLight;
  screenSize: number;
}

export function ResultsPanel({
  resultA,
  resultB,
  projectorNameA,
  projectorNameB,
  ambientLight,
  screenSize,
}: ResultsPanelProps) {
  const ambientInfo = AMBIENT_MULTIPLIERS[ambientLight];
  
  // Calculate comparison
  const brightnessDiff = resultB.footLamberts - resultA.footLamberts;
  const brightnessDiffPercent = resultA.footLamberts > 0 
    ? ((brightnessDiff / resultA.footLamberts) * 100) 
    : 0;
  
  const winner = brightnessDiff > 0 ? 'B' : brightnessDiff < 0 ? 'A' : 'tie';

  const ratingColors = {
    'Excellent': 'bg-green-100 text-green-800 border-green-200',
    'Good': 'bg-blue-100 text-blue-800 border-blue-200',
    'Fair': 'bg-amber-100 text-amber-800 border-amber-200',
    'Poor': 'bg-red-100 text-red-800 border-red-200',
  };

  const ratingIcons = {
    'Excellent': <CheckCircle2 className="w-4 h-4 text-green-600" />,
    'Good': <CheckCircle2 className="w-4 h-4 text-blue-600" />,
    'Fair': <AlertTriangle className="w-4 h-4 text-amber-600" />,
    'Poor': <XCircle className="w-4 h-4 text-red-600" />,
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Results</h2>

        {/* Comparison Summary */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Brightness Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-center py-2">
              {winner === 'tie' ? (
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <Minus className="w-5 h-5" />
                  <span className="text-lg font-medium">Equal Brightness</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    {winner === 'B' ? (
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    )}
                    <span className={`text-lg font-semibold ${winner === 'B' ? 'text-emerald-700' : 'text-blue-700'}`}>
                      {winner === 'B' ? projectorNameB : projectorNameA} is brighter
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {Math.abs(brightnessDiff).toFixed(1)} fL ({Math.abs(brightnessDiffPercent).toFixed(0)}% difference)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Projector A Results */}
        <ProjectorResultCard
          name={projectorNameA}
          result={resultA}
          color="blue"
          ratingColors={ratingColors}
          ratingIcons={ratingIcons}
        />

        {/* Projector B Results */}
        <ProjectorResultCard
          name={projectorNameB}
          result={resultB}
          color="emerald"
          ratingColors={ratingColors}
          ratingIcons={ratingIcons}
        />

        {/* Setup Info */}
        <Card className="border-slate-200 bg-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Current Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Screen Size</span>
                <span className="font-medium text-slate-700">{screenSize}"</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ambient Light</span>
                <div className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${
                    ambientLight === 'low' ? 'bg-slate-700' : ambientLight === 'medium' ? 'bg-amber-500' : 'bg-orange-500'
                  }`}>
                    <Sun className="w-2.5 h-2.5" />
                  </div>
                  <span className="font-medium text-slate-700">{ambientInfo.label}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ambient Multiplier</span>
                <span className="font-medium text-slate-700">×{ambientInfo.multiplier}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reference Guide */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Brightness Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-slate-600"><strong>16+ fL</strong> - Excellent (dark room)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-slate-600"><strong>12-16 fL</strong> - Good (dark room)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-slate-600"><strong>8-12 fL</strong> - Fair (may need adjustment)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-slate-600"><strong>&lt;8 fL</strong> - Poor (too dim)</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Thresholds vary by ambient light. Bright rooms need higher fL values.
            </p>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}

interface ProjectorResultCardProps {
  name: string;
  result: CalculationResult;
  color: 'blue' | 'emerald';
  ratingColors: Record<string, string>;
  ratingIcons: Record<string, React.ReactNode>;
}

function ProjectorResultCard({
  name,
  result,
  color,
  ratingColors,
  ratingIcons,
}: ProjectorResultCardProps) {
  const borderColor = color === 'blue' ? 'border-l-blue-500' : 'border-l-emerald-500';
  const bgColor = color === 'blue' ? 'bg-blue-50/50' : 'bg-emerald-50/50';

  return (
    <Card className={`border-slate-200 border-l-4 ${borderColor} ${bgColor}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-700 truncate">{name}</CardTitle>
          <Badge variant="outline" className={ratingColors[result.rating]}>
            <span className="flex items-center gap-1">
              {ratingIcons[result.rating]}
              {result.rating}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center p-2 bg-white rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 mb-1">Foot-Lamberts</div>
            <div className="text-xl font-bold text-slate-800">{result.footLamberts.toFixed(1)}</div>
            <div className="text-[10px] text-slate-400">fL</div>
          </div>
          <div className="text-center p-2 bg-white rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 mb-1">Nits</div>
            <div className="text-xl font-bold text-slate-800">{result.nits.toFixed(1)}</div>
            <div className="text-[10px] text-slate-400">cd/m²</div>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Visual Brightness</span>
            <span className="font-medium text-slate-700">{Math.round(result.visualBrightness)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, result.visualBrightness)}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs mt-2">
            <span className="text-slate-500">Contrast Reduction</span>
            <span className="font-medium text-slate-700">{result.contrastReduction}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full bg-slate-400"
              style={{ width: `${result.contrastReduction}%` }}
            />
          </div>
        </div>

        <div className="mt-3 p-2 bg-white rounded-lg border border-slate-200">
          <p className="text-xs text-slate-600 leading-relaxed">{result.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
