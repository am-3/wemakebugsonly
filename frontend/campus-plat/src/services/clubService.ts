// src/services/clubService.ts
import api from './api';
import { Club } from '../types';

export const ClubService = {
  getClubs: async (): Promise<Club[]> => {
    const response = await api.get<Club[]>('/clubs/');
    return response.data;
  },

  createClub: async (clubData: Partial<Club>): Promise<Club> => {
    const response = await api.post<Club>('/clubs/', clubData);
    return response.data;
  },

  getClubDetails: async (clubId: number): Promise<Club> => {
    const response = await api.get<Club>(`/clubs/${clubId}/`);
    return response.data;
  },

  updateClub: async (clubId: number, clubData: Partial<Club>): Promise<Club> => {
    const response = await api.put<Club>(`/clubs/${clubId}/`, clubData);
    return response.data;
  },

  deleteClub: async (clubId: number): Promise<void> => {
    await api.delete(`/clubs/${clubId}/`); 
  }
};
