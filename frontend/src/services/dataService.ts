import api from './api';
import type {
  JeuDonnees,
  Ressource,
  Organisation,
  Categorie,
  PaginatedResponse,
  JeuxDonneesParams,
  StatsResponse,
} from '../types/data.types';

/**
 * Service pour récupérer les jeux de données via l'API REST
 */
export const dataService = {
  /**
   * Récupérer tous les jeux de données avec pagination et filtres
   */
  async getAllJeuxDonnees(params?: JeuxDonneesParams): Promise<PaginatedResponse<JeuDonnees>> {
    const response = await api.get<PaginatedResponse<JeuDonnees>>('/api/jeux-donnees/', {
      params,
    });
    return response.data;
  },

  /**
   * Récupérer un jeu de données par son ID (avec ressources incluses)
   */
  async getJeuDonneesById(id: number): Promise<JeuDonnees> {
    const response = await api.get<JeuDonnees>(`/api/jeux-donnees/${id}/`);
    return response.data;
  },

  /**
   * Rechercher des jeux de données
   */
  async searchJeuxDonnees(query: string, params?: Omit<JeuxDonneesParams, 'search'>): Promise<PaginatedResponse<JeuDonnees>> {
    return this.getAllJeuxDonnees({ ...params, search: query });
  },

  /**
   * Récupérer les ressources d'un jeu de données
   */
  async getRessources(jeuDonneesId: number): Promise<Ressource[]> {
    const response = await api.get<Ressource[]>(`/api/jeux-donnees/${jeuDonneesId}/ressources/`);
    return response.data;
  },

  /**
   * Récupérer toutes les organisations
   */
  async getAllOrganisations(params?: {
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Organisation>> {
    const response = await api.get<PaginatedResponse<Organisation>>('/api/organisations/', {
      params,
    });
    return response.data;
  },

  /**
   * Récupérer une organisation par ID
   */
  async getOrganisationById(id: number): Promise<Organisation> {
    const response = await api.get<Organisation>(`/api/organisations/${id}/`);
    return response.data;
  },

  /**
   * Récupérer les jeux de données d'une organisation
   */
  async getJeuxDonneesByOrganisation(organisationId: number): Promise<JeuDonnees[]> {
    const response = await api.get<JeuDonnees[]>(`/api/organisations/${organisationId}/jeux_donnees/`);
    return response.data;
  },

  /**
   * Récupérer toutes les catégories
   */
  async getAllCategories(params?: {
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Categorie>> {
    const response = await api.get<PaginatedResponse<Categorie>>('/api/categories/', {
      params,
    });
    return response.data;
  },

  /**
   * Récupérer les statistiques des ressources
   */
  async getStats(): Promise<StatsResponse> {
    const response = await api.get<StatsResponse>('/api/ressources/statistiques/');
    return response.data;
  },
};


