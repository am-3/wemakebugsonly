import axios from 'axios';
import { Event } from '../types';
import api from './api';


export const  eventsService =  {

  getAllEvents: async (): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events/');
    return response.data;
  },

  async getEventById(id: string): Promise<Event> {
    const response = await api.get(`'/events/'${id}`);
    return response.data;
  },

  async createEvent(event: Partial<Event>): Promise<Event> {
    const response = await api.post('/events/', event);
    return response.data;
  },

  async updateEvent(id: number, event: Partial<Event>): Promise<Event> {
    const response = await api.put(`'/events/'${id}`, event);
    return response.data;
  },

  async deleteEvent(eventId:number): Promise<void> {
    await api.delete(`'/events/'${eventId}`);
  },
}

