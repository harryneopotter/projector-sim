import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lock,
  Unlock,
  RotateCcw,
  Monitor, 
  Ruler, 
  Eye, 
  Sun,
  Lightbulb,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import type { SharedParams, Projector, AmbientLight } from '@/types';
import { AMBIENT_MULTIPLIERS } from '@/types';

interface ControlsPanelProps {
  sharedParams: SharedParams;
  projectorA: Projector;
  projectorB: Projector;
  isLocked: boolean;
  updateSharedParam: <K extends keyof SharedParams>(key: K, value: SharedParams[K]) => void;
  updateProjectorA: <K extends keyof Projector>(key: K, value: Projector[K]) => void;
  updateProjectorB: <K extends keyof Projector>(key: K, value: Projector[K]) => void;
  setIsLocked: (isLocked: boolean) => void;
  resetToDefaults: () => void;
}

/**
 * Render the configuration UI for shared parameters and two projector-specific control panels.
 *
 * @param sharedParams - Current shared configuration (screen size, ambient light, distances, etc.)
 * @param projectorA - Projector A state (name, lumens, etc.)
 * @param projectorB - Projector B state (name, lumens, etc.)
 * @param isLocked - Whether controls are locked from editing
 * @param updateSharedParam - Callback to update a shared parameter: (key, value) => void
 * @param updateProjectorA - Callback to update a Projector A field: (key, value) => void
 * @param updateProjectorB - Callback to update a Projector B field: (key, value) => void
 * @param setIsLocked - Callback to set the locked state: (isLocked) => void
 * @param resetToDefaults - Callback to reset all parameters to their default values
 * @returns The rendered controls panel element containing Setup, Proj A, and Proj B tabs
 */
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

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configuration</h2>
          <div className="flex gap-1">
             <Button
              variant="ghost"
              size="icon"
              onClick={resetToDefaults}
              className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Reset to Defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant={isLocked ? "default" : "outline"}
              size="icon"
              onClick={() => setIsLocked(!isLocked)}
              className="h-8 w-8"
              title={isLocked ? "Unlock Parameters" : "Lock Parameters"}
            >
              {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3 dark:bg-slate-800">
            <TabsTrigger value="setup" className="text-xs">Setup</TabsTrigger>
            <TabsTrigger value="projectorA" className="text-xs">Proj A</TabsTrigger>
            <TabsTrigger value="projectorB" className="text-xs">Proj B</TabsTrigger>
          </TabsList>

          {/* Setup Parameters */}
          <TabsContent value="setup" className="space-y-6 mt-4">
            {/* Screen Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-slate-500" />
                  <Label className="text-sm font-semibold dark:text-slate-300">Screen Size</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={sharedParams.screenSize}
                    onChange={(e) => updateSharedParam('screenSize', Math.max(60, Math.min(200, Number(e.target.value))))}
                    className="w-20 h-8 text-right dark:bg-slate-800 dark:border-slate-700"
                    min={60}
                    max={200}
                  />
                  <span className="text-xs text-slate-500 w-8">in</span>
                </div>
              </div>
              <Slider
                value={[sharedParams.screenSize]}
                onValueChange={([value]) => updateSharedParam('screenSize', value)}
                min={60}
                max={200}
                step={1}
              />
            </div>

            {/* Ambient Light */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-slate-500" />
                <Label className="text-sm font-semibold dark:text-slate-300">Ambient Light</Label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(AMBIENT_MULTIPLIERS) as AmbientLight[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => updateSharedParam('ambientLight', level)}
                    className={`p-2 rounded-xl border-2 transition-all text-left ${
                      sharedParams.ambientLight === level
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                        level === 'low' ? 'bg-slate-700' : level === 'medium' ? 'bg-amber-500' : 'bg-orange-500'
                      }`}>
                        <Sun className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-tighter dark:text-slate-300">{level}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Distances (Advanced) */}
            <div className="space-y-4 pt-2 border-t dark:border-slate-800">
               <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-medium dark:text-slate-400">Throw Distance</span>
                  </div>
                  <span className="dark:text-slate-400">{sharedParams.throwDistance} ft</span>
                </div>
                <Slider
                  value={[sharedParams.throwDistance]}
                  onValueChange={([value]) => updateSharedParam('throwDistance', value)}
                  min={5}
                  max={30}
                  step={0.5}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-medium dark:text-slate-400">Viewing Distance</span>
                  </div>
                  <span className="dark:text-slate-400">{sharedParams.viewingDistance} ft</span>
                </div>
                <Slider
                  value={[sharedParams.viewingDistance]}
                  onValueChange={([value]) => updateSharedParam('viewingDistance', value)}
                  min={6}
                  max={25}
                  step={0.5}
                />
              </div>
            </div>
          </TabsContent>

          {/* Projector A */}
          <TabsContent value="projectorA" className="space-y-4 mt-4">
            <ProjectorControls
              projector={projectorA}
              updateProjector={updateProjectorA}
              label="A"
              color="blue"
            />
          </TabsContent>

          {/* Projector B */}
          <TabsContent value="projectorB" className="space-y-4 mt-4">
            <ProjectorControls
              projector={projectorB}
              updateProjector={updateProjectorB}
              label="B"
              color="emerald"
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
  color: 'blue' | 'emerald';
}

/**
 * Render controls for a single projector's name and brightness, including quick lumens presets.
 *
 * The component displays an editable name input, a numeric brightness input with a mirrored slider,
 * and preset buttons for common lumen values. Brightness values are constrained to the range 500–10000.
 *
 * @param projector - The projector data object whose `name` and `lumens` are shown and edited.
 * @param updateProjector - Callback invoked to update a single projector field; called as `(key, value)` with `key` typically `'name'` or `'lumens'`.
 * @param label - Short label used for placeholders/identification (e.g., "A" or "B").
 * @param color - Accent color choice (`'blue'` or `'emerald'`) that determines styling.
 * @returns The rendered React element for the projector controls.
 */
function ProjectorControls({ projector, updateProjector, label, color }: ProjectorControlsProps) {
  const accentColor = color === 'blue' ? 'text-blue-600' : 'text-emerald-600';
  const inputBg = 'dark:bg-slate-800 dark:border-slate-700';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Tag className={`w-4 h-4 ${accentColor}`} />
          <Label className="text-sm font-semibold dark:text-slate-300">Name</Label>
        </div>
        <Input
          value={projector.name}
          onChange={(e) => updateProjector('name', e.target.value)}
          placeholder={`Projector ${label}`}
          className={`w-full ${inputBg}`}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className={`w-4 h-4 ${accentColor}`} />
            <Label className="text-sm font-semibold dark:text-slate-300">Brightness</Label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={projector.lumens}
              onChange={(e) => updateProjector('lumens', Math.max(500, Math.min(10000, Number(e.target.value))))}
              className={`w-24 h-8 text-right ${inputBg}`}
              min={500}
              max={10000}
            />
            <span className="text-xs text-slate-500">lm</span>
          </div>
        </div>
        <Slider
          value={[projector.lumens]}
          onValueChange={([value]) => updateProjector('lumens', value)}
          min={500}
          max={10000}
          step={100}
        />
      </div>

      <div className="space-y-2 pt-2 border-t dark:border-slate-800">
        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Presets</Label>
        <div className="flex flex-wrap gap-2">
          {[1000, 2000, 3000, 3500, 4000, 5000].map((lumens) => (
            <button
              key={lumens}
              onClick={() => updateProjector('lumens', lumens)}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                projector.lumens === lumens
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
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
