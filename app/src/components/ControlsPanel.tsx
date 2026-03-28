import { 
  Monitor, 
  Ruler, 
  Eye, 
  Sun, 
  Lightbulb, 
  Tag, 
  Info,
  Lock,
  Unlock,
  RotateCcw
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SharedParams, Projector, AmbientLight } from '@/types';
import { AMBIENT_MULTIPLIERS } from '@/types';
import { getThrowRatioWarning } from '@/lib/calculations';

interface ControlsPanelProps {
  sharedParams: SharedParams;
  projectorA: Projector;
  projectorB: Projector;
  isLocked: boolean;
  updateSharedParam: <K extends keyof SharedParams>(key: K, value: SharedParams[K]) => void;
  updateProjectorA: <K extends keyof Projector>(key: K, value: Projector[K]) => void;
  updateProjectorB: <K extends keyof Projector>(key: K, value: Projector[K]) => void;
  setIsLocked: (locked: boolean) => void;
  resetToDefaults: () => void;
}

export function ControlsPanel({
  sharedParams,
  projectorA,
  projectorB,
  isLocked,
  updateSharedParam,
  updateProjectorA,
  updateProjectorB,
  setIsLocked,
  resetToDefaults,
}: ControlsPanelProps) {
  const throwWarning = getThrowRatioWarning(sharedParams.screenSize, sharedParams.throwDistance);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Controls</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLocked(!isLocked)}
              className="flex items-center gap-1.5"
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              {isLocked ? 'Locked' : 'Unlocked'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              className="flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>
        </div>

        <Tabs defaultValue="shared" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shared">Shared</TabsTrigger>
            <TabsTrigger value="projectorA">Projector A</TabsTrigger>
            <TabsTrigger value="projectorB">Projector B</TabsTrigger>
          </TabsList>

          {/* Shared Parameters */}
          <TabsContent value="shared" className="space-y-4 mt-4">
            {/* Screen Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-slate-500" />
                  <Label className="text-sm font-medium text-slate-700">Screen Size</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Diagonal screen size in inches. Larger screens spread the same light over more area, reducing brightness.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={sharedParams.screenSize}
                    onChange={(e) => updateSharedParam('screenSize', Math.max(60, Math.min(200, Number(e.target.value))))}
                    className="w-20 h-8 text-right"
                    min={60}
                    max={200}
                  />
                  <span className="text-sm text-slate-500 w-10">in</span>
                </div>
              </div>
              <Slider
                value={[sharedParams.screenSize]}
                onValueChange={([value]) => updateSharedParam('screenSize', value)}
                min={60}
                max={200}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>60"</span>
                <span>130"</span>
                <span>200"</span>
              </div>
            </div>

            {/* Throw Distance */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-slate-500" />
                  <Label className="text-sm font-medium text-slate-700">Throw Distance</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Distance from projector lens to screen. Used for context and throw ratio calculation.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={sharedParams.throwDistance}
                    onChange={(e) => updateSharedParam('throwDistance', Math.max(5, Math.min(30, Number(e.target.value))))}
                    className="w-20 h-8 text-right"
                    min={5}
                    max={30}
                  />
                  <span className="text-sm text-slate-500 w-10">ft</span>
                </div>
              </div>
              <Slider
                value={[sharedParams.throwDistance]}
                onValueChange={([value]) => updateSharedParam('throwDistance', value)}
                min={5}
                max={30}
                step={0.5}
                className="w-full"
              />
              {throwWarning && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {throwWarning}
                </p>
              )}
            </div>

            {/* Viewing Distance */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-500" />
                  <Label className="text-sm font-medium text-slate-700">Viewing Distance</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Distance from viewer to screen. For context only - does not affect brightness calculations.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={sharedParams.viewingDistance}
                    onChange={(e) => updateSharedParam('viewingDistance', Math.max(6, Math.min(25, Number(e.target.value))))}
                    className="w-20 h-8 text-right"
                    min={6}
                    max={25}
                  />
                  <span className="text-sm text-slate-500 w-10">ft</span>
                </div>
              </div>
              <Slider
                value={[sharedParams.viewingDistance]}
                onValueChange={([value]) => updateSharedParam('viewingDistance', value)}
                min={6}
                max={25}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Ambient Light */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-slate-500" />
                <Label className="text-sm font-medium text-slate-700">Ambient Light</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Room lighting conditions. Higher ambient light washes out the image and reduces perceived contrast.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(AMBIENT_MULTIPLIERS) as AmbientLight[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => updateSharedParam('ambientLight', level)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      sharedParams.ambientLight === level
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                        level === 'low' ? 'bg-slate-700' : level === 'medium' ? 'bg-amber-500' : 'bg-orange-500'
                      }`}>
                        <Sun className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-medium capitalize">{level}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {AMBIENT_MULTIPLIERS[level].label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Projector A */}
          <TabsContent value="projectorA" className="space-y-4 mt-4">
            <ProjectorControls
              projector={projectorA}
              updateProjector={updateProjectorA}
              label="A"
            />
          </TabsContent>

          {/* Projector B */}
          <TabsContent value="projectorB" className="space-y-4 mt-4">
            <ProjectorControls
              projector={projectorB}
              updateProjector={updateProjectorB}
              label="B"
            />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}

interface ProjectorControlsProps {
  projector: Projector;
  updateProjector: <K extends keyof Projector>(key: K, value: Projector[K]) => void;
  label: string;
}

function ProjectorControls({ projector, updateProjector, label }: ProjectorControlsProps) {
  return (
    <div className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-slate-500" />
          <Label className="text-sm font-medium text-slate-700">Projector Name</Label>
        </div>
        <Input
          value={projector.name}
          onChange={(e) => updateProjector('name', e.target.value)}
          placeholder={`Projector ${label}`}
          className="w-full"
        />
      </div>

      {/* Brightness */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-slate-500" />
            <Label className="text-sm font-medium text-slate-700">Brightness</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">ANSI lumens rating of the projector. Higher lumens = brighter image.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={projector.lumens}
              onChange={(e) => updateProjector('lumens', Math.max(500, Math.min(10000, Number(e.target.value))))}
              className="w-24 h-8 text-right"
              min={500}
              max={10000}
            />
            <span className="text-sm text-slate-500 w-14">lumens</span>
          </div>
        </div>
        <Slider
          value={[projector.lumens]}
          onValueChange={([value]) => updateProjector('lumens', value)}
          min={500}
          max={10000}
          step={100}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>500</span>
          <span>5,000</span>
          <span>10,000</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-slate-500 uppercase">Quick Presets</Label>
        <div className="flex flex-wrap gap-2">
          {[1000, 2000, 3000, 3500, 4000, 5000].map((lumens) => (
            <button
              key={lumens}
              onClick={() => updateProjector('lumens', lumens)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                projector.lumens === lumens
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              {lumens.toLocaleString()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
