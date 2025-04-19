// src/stores/resourcesStore.ts
import { create } from 'zustand';
import { ResourceService } from '../services/resourcesService';

interface ResourcesState {
  resources: any[];
  bookings: any[];
  availability: any[];
  loading: boolean;
  error: string | null;
  fetchResources: () => Promise<void>;
  checkAvailability: (resourceId: number, date: Date) => Promise<any>;
  createBooking: (resourceId: number, bookingData: any) => Promise<any>;
}

export const useResourcesStore = create<ResourcesState>((set) => ({
  resources: [],
  bookings: [],
  availability: [],
  loading: false,
  error: null,

  fetchResources: async () => {
    set({ loading: true, error: null });
    try {
      const resources = await ResourceService.getResources();
      set({ resources, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
    }
  },

  checkAvailability: async (resourceId: number, date: Date) => {
    set({ loading: true, error: null });
    try {
        const dateString = date.toISOString().split('T')[0];
      const availability = await ResourceService.getAvailability(resourceId, dateString);
      set({ availability, loading: false });
      return availability;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
      throw error;
    }
  },

  createBooking: async (resourceId: number, bookingData: any) => {
    set({ loading: true, error: null });
    try {
      const newBooking = await ResourceService.createBooking(resourceId, bookingData);
      set((state) => ({
        bookings: [...state.bookings, newBooking],
        loading: false
      }));
      return newBooking;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
      throw error;
    }
  }
}));
