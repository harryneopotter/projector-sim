import { useEffect, useState } from 'react';
import { useProjector } from '@/hooks/useProjector';
import { ControlsPanel } from '@/components/ControlsPanel';
import { Visualization } from '@/components/Visualization';
import { ResultsPanel } from '@/components/ResultsPanel';
import { PresetsPanel } from '@/components/PresetsPanel';
import { ExportPanel } from '@/components/ExportPanel';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Monitor, 
  HelpCircle, 
  Menu,
  Info,
  Lightbulb
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

/**
 * Root application component that renders the projector comparison UI, synchronizes select URL query parameters on mount, and manages global UI state (help dialog and mobile controls).
 *
 * @returns The root React element for the ProjSim application.
 */
function App() {
  const {
    sharedParams,
    projectorA,
    projectorB,
    resultsA,
    resultsB,
    isLocked,
    updateSharedParam,
    updateProjectorA,
    updateProjectorB,
    setIsLocked,
    applyPreset,
    resetToDefaults,
  } = useProjector();

  const [showHelp, setShowHelp] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);

  // Sync URL params on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const size = params.get('size');
    const ambient = params.get('ambient');
    const nameA = params.get('nameA');
    const lumensA = params.get('lumensA');
    const nameB = params.get('nameB');
    const lumensB = params.get('lumensB');

    if (size) updateSharedParam('screenSize', Number(size));
    if (ambient) updateSharedParam('ambientLight', ambient as any);
    if (nameA) updateProjectorA('name', nameA);
    if (lumensA) updateProjectorA('lumens', Number(lumensA));
    if (nameB) updateProjectorB('name', nameB);
    if (lumensB) updateProjectorB('lumens', Number(lumensB));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">ProjSim</h1>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Simulator</p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <PresetsPanel onApplyPreset={applyPreset} />
              <ExportPanel
                sharedParams={sharedParams}
                projectorA={projectorA}
                projectorB={projectorB}
                resultA={resultsA}
                resultB={resultsB}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelp(true)}
                className="flex items-center gap-2 dark:text-slate-300"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <Sheet open={showMobileControls} onOpenChange={setShowMobileControls}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="dark:bg-slate-800 dark:border-slate-700">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:w-96 p-0 dark:bg-slate-900 dark:border-slate-800">
                  <div className="h-full overflow-y-auto p-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold dark:text-white">Configuration</h2>
                    </div>
                    <ControlsPanel
                      sharedParams={sharedParams}
                      projectorA={projectorA}
                      projectorB={projectorB}
                      isLocked={isLocked}
                      updateSharedParam={updateSharedParam}
                      updateProjectorA={updateProjectorA}
                      updateProjectorB={updateProjectorB}
                      setIsLocked={setIsLocked}
                      resetToDefaults={resetToDefaults}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Actions Bar */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 transition-colors duration-300">
        <div className="flex items-center justify-between gap-3">
          <PresetsPanel onApplyPreset={applyPreset} />
          <ExportPanel
            sharedParams={sharedParams}
            projectorA={projectorA}
            projectorB={projectorB}
            resultA={resultsA}
            resultB={resultsB}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelp(true)}
            className="dark:text-slate-300"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel - Controls (Desktop) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors duration-300">
              <ControlsPanel
                sharedParams={sharedParams}
                projectorA={projectorA}
                projectorB={projectorB}
                isLocked={isLocked}
                updateSharedParam={updateSharedParam}
                updateProjectorA={updateProjectorA}
                updateProjectorB={updateProjectorB}
                setIsLocked={setIsLocked}
                resetToDefaults={resetToDefaults}
              />
            </div>
          </div>

          {/* Center Panel - Visualization (HERO) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1 shadow-sm transition-colors duration-300 overflow-hidden">
              <Visualization
                resultA={resultsA}
                resultB={resultsB}
                ambientLight={sharedParams.ambientLight}
                projectorNameA={projectorA.name}
                projectorNameB={projectorB.name}
              />
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-3 sticky top-24">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors duration-300">
              <ResultsPanel
                resultA={resultsA}
                resultB={resultsB}
                projectorNameA={projectorA.name}
                projectorNameB={projectorB.name}
                ambientLight={sharedParams.ambientLight}
                screenSize={sharedParams.screenSize}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-white">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              How to Use ProjSim
            </DialogTitle>
            <DialogDescription className="dark:text-slate-400">
              Learn how to compare projector brightness with our simulator.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Quick Start */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                Quick Start
              </h3>
              <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal list-inside">
                <li>Set your <strong>screen size</strong> (diagonal in inches)</li>
                <li>Choose your <strong>room lighting</strong> (dark, medium, or bright)</li>
                <li>Enter the <strong>brightness</strong> (lumens) for each projector</li>
                <li>Compare the visual preview and numerical results</li>
              </ol>
            </section>

            {/* Understanding the Numbers */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Understanding the Numbers
              </h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <p><strong>Foot-Lamberts (fL):</strong> The industry standard for measuring projected brightness. Higher is better.</p>
                <p><strong>Nits:</strong> Another brightness unit, commonly used for displays. 1 fL ≈ 3.426 nits.</p>
                <p><strong>Visual Brightness:</strong> A percentage representing how bright the image appears relative to a reference (18 fL).</p>
              </div>
            </section>

            {/* Brightness Guidelines */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Brightness Guidelines</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900/50">
                  <div className="font-medium text-green-800 dark:text-green-400">16+ fL</div>
                  <div className="text-green-600 dark:text-green-500/70">Excellent (dark room)</div>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-900/50">
                  <div className="font-medium text-blue-800 dark:text-blue-400">12-16 fL</div>
                  <div className="text-blue-600 dark:text-blue-500/70">Good (dark room)</div>
                </div>
                <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-900/50">
                  <div className="font-medium text-amber-800 dark:text-amber-400">8-12 fL</div>
                  <div className="text-amber-600 dark:text-amber-500/70">Fair (may need adjustment)</div>
                </div>
                <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-900/50">
                  <div className="font-medium text-red-800 dark:text-red-400">&lt;8 fL</div>
                  <div className="text-red-600 dark:text-red-500/70">Poor (too dim)</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Note: Bright rooms need 20-30+ fL for good results.
              </p>
            </section>

            {/* Tips */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Pro Tips</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Use the <strong>Lock</strong> button to keep shared parameters synced</li>
                <li>Try <strong>Presets</strong> for common scenarios</li>
                <li>Share your comparison via the <strong>Share</strong> button</li>
                <li>Use the <strong>Comparison Slider</strong> in the preview to see differences side-by-side</li>
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
