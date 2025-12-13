// Types pour les données de l'API DataQC

export interface Organisation {
  id: number;
  nom: string;
  nom_complet?: string;
  type_organisation: string; // "Ville", "Ministère", "Agence"
  description?: string;
  url?: string;
  nombre_jeux_donnees: number;
  date_creation: string; // ISO date
  date_modification: string; // ISO date
  jeux_donnees?: JeuDonnees[]; // Dans la vue détaillée
}

export interface Categorie {
  id: number;
  nom: string;
  description?: string;
  nombre_jeux_donnees: number;
}

export interface JeuDonnees {
  id: number;
  titre: string;
  description: string;
  organisation: number | Organisation; // ID ou objet complet
  organisation_nom?: string; // Dans la liste
  organisation_type?: string; // Dans la liste
  categories: string; // "Transport; Tourisme" (séparées par ;)
  etiquettes?: string; // "HackQC20; Aménagement" (séparées par ;)
  niveau_acces: string; // "Ouvert", "Privé"
  url_originale?: string;
  ressources?: Ressource[]; // Dans la vue détaillée
  date_creation: string; // ISO date
  date_modification: string; // ISO date
  date_metadata_creation?: string; // ISO date
  date_metadata_modification?: string; // ISO date
}

export interface Ressource {
  id: number;
  nom: string;
  jeu_donnees: number | JeuDonnees; // ID ou objet complet
  jeu_donnees_titre?: string; // Dans la liste
  jeu_donnees_organisation?: string; // Dans la liste
  format_fichier: string; // "CSV", "GeoJSON", "SHP", "JSON", etc.
  type_ressource: string; // "Données", "Documentation", "Carte interactive"
  url: string;
  taille?: number; // en bytes
  description?: string;
  methode_collecte?: string;
  contexte_collecte?: string;
  attributs?: string; // "objectid (integer) : type (char)"
  date_creation: string; // ISO date
  date_modification: string; // ISO date
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface JeuxDonneesParams {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  organisation?: number;
  categories?: string;
}

export interface StatsResponse {
  total_ressources?: number;
  formats?: Record<string, number>;
  types?: Record<string, number>;
  taille_totale?: number;
  statsOrganisations?: number;
  statsJeuxDonnees?: number;
  statsRessources?: number;
}


