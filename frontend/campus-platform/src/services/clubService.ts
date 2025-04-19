// src/services/clubService.ts
import api from './api';
import {Club} from "@/types";


export const ClubService = {
  getClubs: async (): Promise<any[]> => {
    try {
      const response = await api.get('/clubs/');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch clubs');
    }
  },

  createClub: async (Club: Club): Promise<any> => {
    try {
      const response = await api.post('/clubs/', Club);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create club');
    }
  },

  getClubDetails: async (clubId: string | number): Promise<any> => {
    try {
      const response = await api.get(`/clubs/${clubId}/`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch club details for ID: ${clubId}`);
    }
  }
};
