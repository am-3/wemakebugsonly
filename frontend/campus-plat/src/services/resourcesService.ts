// src/services/ResourcesService.ts
import api from './api';
import { Resource } from '../types';

// Fetch all campus resources
export const ResourceService = {
  getResources: async (): Promise<Resource[]> => {
    const response = await api.get<Resource[]>('/resources/');
    return response.data;
  },

  getResourceDetails: async (resourceId: number): Promise<Resource> => {
    const response = await api.get<Resource>(`/resources/${resourceId}/`);
    return response.data;
  },

  getAvailability: async (resourceId: number, date: string): Promise<any> => {
    const response = await api.get(`/resources/${resourceId}/availability/`, {
      params: { date },
    });
    return response.data;
  },

  createBooking: async (
    resourceId: number,
    bookingData: {
      start_time: string;
      end_time: string;
      purpose: string;
      num_attendees: number;
    }
  ): Promise<any> => {
    const response = await api.post(`/resources/${resourceId}/bookings/`, bookingData);
    return response.data;
  },

  getBookings: async (): Promise<any[]> => {
    const response = await api.get('/bookings/');
    return response.data;
  },

  // Add more methods as needed for approve/reject/cancel, etc.
};
