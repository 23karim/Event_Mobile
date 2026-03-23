import api from './api';
import { Event, EventsResponse } from '../models/event';

export const eventService = {
  /**
   * Récupérer tous les événements (Public)
   * Route: GET /events/all
   */
  getAllEvents: async (page: number = 1, limit: number = 10): Promise<EventsResponse> => {
    try {
      // On passe les paramètres de pagination en Query String
      const { data } = await api.get<EventsResponse>(`/events/all`, {
        params: { page, limit }
      });
      return data;
    } catch (error: any) {
      console.error("Erreur GetAllEvents:", error.response?.data || error.message);
      throw error.response?.data?.message || "Impossible de charger les événements";
    }
  },

  /**
   * Récupérer un événement spécifique par son ID
   * Route: GET /events/:id
   */
  getEventById: async (id: number): Promise<Event> => {
    try {
      const { data } = await api.get<Event>(`/events/${id}`);
      return data;
    } catch (error: any) {
      throw error.response?.data?.message || "Événement introuvable";
    }
  },

  /**
   * Rejoindre un événement (Client seulement)
   * Route: POST /events/:id/join
   */
joinEvent: async (eventId: number): Promise<{ message: string }> => {
    try {
      const { data } = await api.post(`/events/${eventId}/join`);
      return data;
    } catch (error: any) {
      // Capture le message "Vous participez déjà à cet événement !" envoyé par ton back
      throw error.response?.data?.message || "Erreur lors de la participation";
    }
  }
};