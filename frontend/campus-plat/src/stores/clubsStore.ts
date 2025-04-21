// src/stores/clubsStore.js
import { create } from 'zustand';
import { ClubService } from '../services/clubService';
import { Club } from '../types';

interface ClubsState {
  clubs: Club[];
  currentClub: Club | null;
  loading: boolean;
  error: string | null;
  fetchClubs: () => Promise<void>;
  createClub: (clubData: Partial<Club>) => Promise<Club>;
  getClubDetails: (clubId: number) => Promise<Club>;
  updateClub: (clubId: number, clubData: Partial<Club>) => Promise<Club>;
  deleteClub: (clubData: Partial<Club>) => Promise<void>;
}

export const useClubsStore = create<ClubsState>((set, get) => ({
  clubs: [],
  currentClub: null,
  loading: false,
  error: null,

  fetchClubs: async () => {
    set({ loading: true, error: null });
    try {
      const clubs = await ClubService.getClubs();
      set({ clubs, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
    }
  },

  createClub: async (clubData) => {
    set({ loading: true, error: null });
    try {
      const newClub = await ClubService.createClub(clubData);
      set((state) => ({
        clubs: [...state.clubs, newClub],
        loading: false,
        error: null
      }));
      return newClub;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  getClubDetails: async (clubId) => {
    set({ loading: true, error: null });
    try {
      const club = await ClubService.getClubDetails(clubId);
      set({ currentClub: club, loading: false, error: null });
      return club;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  updateClub: async (clubId, clubData) => {
    set({ loading: true, error: null });
    try {
      const updatedClub = await ClubService.updateClub(clubId, clubData);
      set((state) => ({
        clubs: state.clubs.map(club => club.id === clubId ? updatedClub : club),
        currentClub: state.currentClub?.id === clubId ? updatedClub : state.currentClub,
        loading: false,
        error: null
      }));
      return updatedClub;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  deleteClub: async (clubData) => {
    set({ loading: true, error: null });
    try {
      await ClubService.deleteClub(clubData.name!);
      set((state) => ({
        clubs: state.clubs.filter(club => club.id !== clubData.id),
        currentClub: state.currentClub?.id === clubData.id ? null : state.currentClub,
        loading: false,
        error: null
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  }
}));
