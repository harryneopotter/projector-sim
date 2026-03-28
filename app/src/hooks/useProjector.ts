import { useState, useCallback, useMemo } from 'react';
import type { SharedParams, Projector } from '@/types';
import { DEFAULT_SHARED, DEFAULT_PROJECTOR_A, DEFAULT_PROJECTOR_B } from '@/types';
import { calculateProjector } from '@/lib/calculations';

export interface UseProjectorReturn {
  sharedParams: SharedParams;
  projectorA: Projector;
  projectorB: Projector;
  resultsA: ReturnType<typeof calculateProjector>;
  resultsB: ReturnType<typeof calculateProjector>;
  isLocked: boolean;
  setSharedParams: (params: SharedParams) => void;
  setProjectorA: (projector: Projector) => void;
  setProjectorB: (projector: Projector) => void;
  updateSharedParam: <K extends keyof SharedParams>(key: K, value: SharedParams[K]) => void;
  updateProjectorA: <K extends keyof Projector>(key: K, value: Projector[K]) => void;
  updateProjectorB: <K extends keyof Projector>(key: K, value: Projector[K]) => void;
  setIsLocked: (locked: boolean) => void;
  resetToDefaults: () => void;
  applyPreset: (preset: { shared: SharedParams; projectorA: Projector; projectorB: Projector }) => void;
}

export function useProjector(): UseProjectorReturn {
  const [sharedParams, setSharedParams] = useState<SharedParams>(DEFAULT_SHARED);
  const [projectorA, setProjectorA] = useState<Projector>(DEFAULT_PROJECTOR_A);
  const [projectorB, setProjectorB] = useState<Projector>(DEFAULT_PROJECTOR_B);
  const [isLocked, setIsLocked] = useState(true);

  const resultsA = useMemo(() => 
    calculateProjector(projectorA, sharedParams),
    [projectorA, sharedParams]
  );

  const resultsB = useMemo(() => 
    calculateProjector(projectorB, sharedParams),
    [projectorB, sharedParams]
  );

  const updateSharedParam = useCallback(<K extends keyof SharedParams>(
    key: K, 
    value: SharedParams[K]
  ) => {
    setSharedParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateProjectorA = useCallback(<K extends keyof Projector>(
    key: K, 
    value: Projector[K]
  ) => {
    setProjectorA(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateProjectorB = useCallback(<K extends keyof Projector>(
    key: K, 
    value: Projector[K]
  ) => {
    setProjectorB(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSharedParams(DEFAULT_SHARED);
    setProjectorA(DEFAULT_PROJECTOR_A);
    setProjectorB(DEFAULT_PROJECTOR_B);
  }, []);

  const applyPreset = useCallback((preset: { 
    shared: SharedParams; 
    projectorA: Projector; 
    projectorB: Projector 
  }) => {
    setSharedParams(preset.shared);
    setProjectorA(preset.projectorA);
    setProjectorB(preset.projectorB);
  }, []);

  return {
    sharedParams,
    projectorA,
    projectorB,
    resultsA,
    resultsB,
    isLocked,
    setSharedParams,
    setProjectorA,
    setProjectorB,
    updateSharedParam,
    updateProjectorA,
    updateProjectorB,
    setIsLocked,
    resetToDefaults,
    applyPreset,
  };
}
