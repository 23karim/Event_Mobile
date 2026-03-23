/*export interface Event {
  id: number;
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  prix: number;
  lieu: string;
  image: string | null;
  admin_id: number;
  admin_nom?: string;
}

export interface EventsResponse {
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
  events: Event[];
}*/
export interface Event {
  id: number;
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  prix: number;
  lieu: string;
  image: string | null;
  admin_id: number;
  admin_nom?: string;
  // 🚀 Ajout du compteur de participants pour l'affichage mobile
  participants_count?: number | string; 
}

export interface EventsResponse {
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
  events: Event[];
}