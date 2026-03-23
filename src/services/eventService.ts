import { EventsResponse, Event } from '../models/event';
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
  },

  getMyParticipations: async (): Promise<{ count: number, events: Event[] }> => {
    try {
      const { data } = await api.get(`/events/my-participations`);
      return data;
    } catch (error: any) {
      throw error.response?.data?.message || "Erreur lors de la récupération de vos événements";
    }
  },
  getEventParticipants: async (eventId: number, page: number = 1): Promise<any> => {
    try {
      const { data } = await api.get(`/events/${eventId}/participants`, {
        params: { page }
      });
      return data;
    } catch (error: any) {
      throw error.response?.data?.message || "Erreur lors de la récupération des participants";
    }
  },
  leaveEvent: async (eventId: number): Promise<{ message: string }> => {
    try {
      const { data } = await api.delete<{ message: string }>(`/events/${eventId}/leave`);
      return data;
    } catch (error: any) {
      console.error("Erreur LeaveEvent:", error.response?.data || error.message);
      throw error.response?.data?.message || "Erreur lors de la désinscription";
    }
  },
};