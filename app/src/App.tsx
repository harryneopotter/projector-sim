import { useEffect, useState } from 'react';
import { useProjector } from '@/hooks/useProjector';
import { ControlsPanel } from '@/components/ControlsPanel';
import { Visualization } from '@/components/Visualization';
import { ResultsPanel } from '@/components/ResultsPanel';
import { PresetsPanel } from '@/components/PresetsPanel';
import { ExportPanel } from '@/components/ExportPanel';
import { Button } from '@/components/ui/button';
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
    resetToDefaults,
    applyPreset,
  } = useProjector();

  const [showHelp, setShowHelp] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);

  // Check for URL params on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const screenSize = params.get('screen');
    const throwDistance = params.get('throw');
    const viewingDistance = params.get('view');
    const ambientLight = params.get('ambient');
    const nameA = params.get('nameA');
    const lumensA = params.get('lumensA');
    const nameB = params.get('nameB');
    const lumensB = params.get('lumensB');

    if (screenSize) updateSharedParam('screenSize', Number(screenSize));
    if (throwDistance) updateSharedParam('throwDistance', Number(throwDistance));
    if (viewingDistance) updateSharedParam('viewingDistance', Number(viewingDistance));
    if (ambientLight && ['low', 'medium', 'high'].includes(ambientLight)) {
      updateSharedParam('ambientLight', ambientLight as 'low' | 'medium' | 'high');
    }
    if (nameA) updateProjectorA('name', nameA);
    if (lumensA) updateProjectorA('lumens', Number(lumensA));
    if (nameB) updateProjectorB('name', nameB);
    if (lumensB) updateProjectorB('lumens', Number(lumensB));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Monitor className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">ProjSim</h1>
                <p className="text-[10px] text-slate-500 leading-tight">Projector Brightness Simulator</p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
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
                className="flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="flex md:hidden items-center gap-2">
              <Sheet open={showMobileControls} onOpenChange={setShowMobileControls}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:w-96 p-0">
                  <div className="h-full overflow-y-auto p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">Controls</h2>
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
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2">
        <div className="flex items-center justify-between gap-2">
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
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Controls (Desktop) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-20">
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

          {/* Center Panel - Visualization */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
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
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-20">
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              How to Use ProjSim
            </DialogTitle>
            <DialogDescription>
              Learn how to compare projector brightness with our simulator.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Quick Start */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                Quick Start
              </h3>
              <ol className="text-sm text-slate-600 space-y-1.5 list-decimal list-inside">
                <li>Set your <strong>screen size</strong> (diagonal in inches)</li>
                <li>Choose your <strong>room lighting</strong> (dark, medium, or bright)</li>
                <li>Enter the <strong>brightness</strong> (lumens) for each projector</li>
                <li>Compare the visual preview and numerical results</li>
              </ol>
            </section>

            {/* Understanding the Numbers */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Understanding the Numbers
              </h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Foot-Lamberts (fL):</strong> The industry standard for measuring projected brightness. Higher is better.</p>
                <p><strong>Nits:</strong> Another brightness unit, commonly used for displays. 1 fL ≈ 3.426 nits.</p>
                <p><strong>Visual Brightness:</strong> A percentage representing how bright the image appears relative to a reference (18 fL).</p>
              </div>
            </section>

            {/* Brightness Guidelines */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Brightness Guidelines</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-green-50 rounded border border-green-200">
                  <div className="font-medium text-green-800">16+ fL</div>
                  <div className="text-green-600">Excellent (dark room)</div>
                </div>
                <div className="p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="font-medium text-blue-800">12-16 fL</div>
                  <div className="text-blue-600">Good (dark room)</div>
                </div>
                <div className="p-2 bg-amber-50 rounded border border-amber-200">
                  <div className="font-medium text-amber-800">8-12 fL</div>
                  <div className="text-amber-600">Fair (may need adjustment)</div>
                </div>
                <div className="p-2 bg-red-50 rounded border border-red-200">
                  <div className="font-medium text-red-800">&lt;8 fL</div>
                  <div className="text-red-600">Poor (too dim)</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Note: Bright rooms need 20-30+ fL for good results.
              </p>
            </section>

            {/* Tips */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Pro Tips</h3>
              <ul className="text-sm text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Use the <strong>Lock</strong> button to keep shared parameters synced</li>
                <li>Try <strong>Presets</strong> for common scenarios</li>
                <li>Share your comparison via the <strong>Share</strong> button</li>
                <li>Toggle between Landscape and Movie scenes to see contrast differences</li>
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
