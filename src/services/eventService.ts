import { EventsResponse } from '../models/event';
import api from './api';


export const eventService = {

  getAllEvents: async (page: number = 1, limit: number = 10): Promise<EventsResponse> => {
    try {
      const { data } = await api.get<EventsResponse>(`/events/all`, {
        params: { page, limit }
      });
      return data;
    } catch (error: any) {
      console.error("Erreur GetAllEvents:", error.response?.data || error.message);
      throw error.response?.data?.message || "Impossible de charger les événements";
    }
  },

  getEventById: async (id: number): Promise<Event> => {
    try {
      const { data } = await api.get<Event>(`/events/${id}`);
      return data;
    } catch (error: any) {
      throw error.response?.data?.message || "Événement introuvable";
    }
  },

joinEvent: async (eventId: number): Promise<{ message: string }> => {
    try {
      const { data } = await api.post(`/events/${eventId}/join`);
      return data;
    } catch (error: any) {
      throw error.response?.data?.message || "Erreur lors de la participation";
    }
  }
};