import { useState } from 'react';
import type { Preset } from '@/types';
import { PRESETS } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Bookmark, 
  ChevronDown, 
  Monitor, 
  Sun, 
  Lightbulb,
  Check
} from 'lucide-react';

interface PresetsPanelProps {
  onApplyPreset: (preset: Preset) => void;
}

export function PresetsPanel({ onApplyPreset }: PresetsPanelProps) {
  const [appliedPreset, setAppliedPreset] = useState<string | null>(null);

  const handleApplyPreset = (preset: Preset) => {
    onApplyPreset(preset);
    setAppliedPreset(preset.name);
    
    // Clear the applied indicator after 2 seconds
    setTimeout(() => setAppliedPreset(null), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Presets</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bookmark className="w-5 h-5" />
              Quick Start Presets
            </DialogTitle>
            <DialogDescription>
              Choose a preset configuration to quickly compare common projector setups.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 mt-4">
            {PRESETS.map((preset) => (
              <PresetCard
                key={preset.name}
                preset={preset}
                onApply={() => handleApplyPreset(preset)}
                isApplied={appliedPreset === preset.name}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <span>Quick Apply</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {PRESETS.map((preset) => (
            <DropdownMenuItem
              key={preset.name}
              onClick={() => handleApplyPreset(preset)}
              className="flex items-center justify-between"
            >
              <span>{preset.name}</span>
              {appliedPreset === preset.name && (
                <Check className="w-4 h-4 text-green-600 ml-2" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface PresetCardProps {
  preset: Preset;
  onApply: () => void;
  isApplied: boolean;
}

function PresetCard({ preset, onApply, isApplied }: PresetCardProps) {
  const ambientLabels = {
    low: 'Dark Room',
    medium: 'Living Room',
    high: 'Bright Room',
  };

  const ambientColors = {
    low: 'bg-slate-700',
    medium: 'bg-amber-500',
    high: 'bg-orange-500',
  };

  return (
    <Card className="border-slate-200 hover:border-blue-300 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">{preset.name}</CardTitle>
            <p className="text-sm text-slate-500 mt-1">{preset.description}</p>
          </div>
          <Button
            onClick={onApply}
            size="sm"
            className={isApplied ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {isApplied ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Applied
              </>
            ) : (
              'Apply'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Screen Size */}
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
            <Monitor className="w-4 h-4 text-slate-500" />
            <div>
              <div className="text-xs text-slate-500">Screen</div>
              <div className="text-sm font-medium">{preset.shared.screenSize}"</div>
            </div>
          </div>

          {/* Ambient Light */}
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${ambientColors[preset.shared.ambientLight]}`}>
              <Sun className="w-2.5 h-2.5" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Ambient</div>
              <div className="text-sm font-medium">{ambientLabels[preset.shared.ambientLight]}</div>
            </div>
          </div>

          {/* Projector A */}
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
            <Lightbulb className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-xs text-blue-600">{preset.projectorA.name}</div>
              <div className="text-sm font-medium text-blue-800">{preset.projectorA.lumens.toLocaleString()} lm</div>
            </div>
          </div>

          {/* Projector B */}
          <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-100">
            <Lightbulb className="w-4 h-4 text-emerald-500" />
            <div>
              <div className="text-xs text-emerald-600">{preset.projectorB.name}</div>
              <div className="text-sm font-medium text-emerald-800">{preset.projectorB.lumens.toLocaleString()} lm</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
