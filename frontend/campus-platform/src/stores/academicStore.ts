// src/stores/academicStore.ts
import { create } from 'zustand';
import { AcademicService } from '../services/academicService';
import { AcademicPerformance } from '../types';

interface AcademicState {
  performance: AcademicPerformance | null;
  loading: boolean;
  error: string | null;
  fetchPerformance: () => Promise<void>;
}

export const useAcademicStore = create<AcademicState>((set) => ({
  performance: null,
  loading: false,
  error: null,

  fetchPerformance: async () => {
    set({ loading: true, error: null });
    try {
      const performance = await AcademicService.getPerformance();
      set({ performance, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  }
}));
