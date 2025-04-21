import { create } from 'zustand';
import { Event } from '../types';
import { eventsService } from '../services/eventsService';

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  createEvent: (event: Partial<Event>) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (eventId: number) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const data = await eventsService.getAllEvents();
      set({ events: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createEvent: async (event) => {
    set({ loading: true, error: null });
    try {
      const newEvent = await eventsService.createEvent(event);
      set(state => ({ events: [...state.events, newEvent], loading: false }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateEvent: async (event) => {
    set({ loading: true, error: null });
    try {
      const updatedEvent = await eventsService.updateEvent(event.id, event);
      set(state => ({
        events: state.events.map(e => (e.id === updatedEvent.id ? updatedEvent : e)),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteEvent: async (eventId) => {
    set({ loading: true, error: null });
    try {
      await eventsService.deleteEvent(eventId);
      set(state => ({
        events: state.events.filter(e => e.id !== eventId),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));
