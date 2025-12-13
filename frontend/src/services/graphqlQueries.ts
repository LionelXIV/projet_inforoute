import { graphqlClient } from './graphql';
import type { JeuDonnees, Organisation, Categorie, Ressource, StatsResponse } from '../types/data.types';

/**
 * Queries GraphQL pour les jeux de données
 */

// Query pour récupérer tous les jeux de données
const GET_ALL_JEUX_DONNEES = `
  query GetAllJeuxDonnees {
    allJeuxDonnees {
      id
      titre
      description
      organisation {
        id
        nom
        typeOrganisation
      }
      categories
      etiquettes
      niveauAcces
      urlOriginale
      dateCreation
      dateModification
      dateMetadataCreation
      dateMetadataModification
    }
  }
`;

// Query pour récupérer un jeu de données par ID
const GET_JEU_DONNEES_BY_ID = `
  query GetJeuDonneesById($id: Int!) {
    jeuDonnees(id: $id) {
      id
      titre
      description
      organisation {
        id
        nom
        nomComplet
        typeOrganisation
        description
        url
        nombreJeuxDonnees
      }
      categories
      etiquettes
      niveauAcces
      urlOriginale
      dateCreation
      dateModification
      dateMetadataCreation
      dateMetadataModification
    }
  }
`;

// Query pour récupérer toutes les organisations
const GET_ALL_ORGANISATIONS = `
  query GetAllOrganisations {
    allOrganisations {
      id
      nom
      nomComplet
      typeOrganisation
      description
      url
      nombreJeuxDonnees
      dateCreation
      dateModification
    }
  }
`;

// Query pour récupérer une organisation par ID
const GET_ORGANISATION_BY_ID = `
  query GetOrganisationById($id: Int!) {
    organisation(id: $id) {
      id
      nom
      nomComplet
      typeOrganisation
      description
      url
      nombreJeuxDonnees
      dateCreation
      dateModification
    }
  }
`;

// Query pour récupérer toutes les catégories
const GET_ALL_CATEGORIES = `
  query GetAllCategories {
    allCategories {
      id
      nom
      description
      nombreJeuxDonnees
    }
  }
`;

// Query pour récupérer toutes les ressources
const GET_ALL_RESSOURCES = `
  query GetAllRessources {
    allRessources {
      id
      nom
      jeuDonnees {
        id
        titre
        organisation {
          nom
        }
      }
      formatFichier
      typeRessource
      url
      taille
      description
      dateCreation
      dateModification
    }
  }
`;

// Query pour récupérer les statistiques
const GET_STATS = `
  query GetStats {
    statsOrganisations
    statsJeuxDonnees
    statsRessources
  }
`;

/**
 * Service GraphQL pour les données
 */
export const graphqlDataService = {
  /**
   * Récupérer tous les jeux de données via GraphQL
   */
  async getAllJeuxDonnees(): Promise<JeuDonnees[]> {
    const data = await graphqlClient.request<{ allJeuxDonnees: JeuDonnees[] }>(GET_ALL_JEUX_DONNEES);
    // Convertir les noms de champs GraphQL (camelCase) vers les noms de l'API REST (snake_case)
    return data.allJeuxDonnees.map((jeu) => ({
      ...jeu,
      organisation_nom: typeof jeu.organisation === 'object' ? jeu.organisation.nom : undefined,
      organisation_type: typeof jeu.organisation === 'object' ? jeu.organisation.typeOrganisation : undefined,
      organisation: typeof jeu.organisation === 'object' ? jeu.organisation.id : jeu.organisation,
      niveau_acces: (jeu as any).niveauAcces,
      url_originale: (jeu as any).urlOriginale,
      date_creation: (jeu as any).dateCreation,
      date_modification: (jeu as any).dateModification,
      date_metadata_creation: (jeu as any).dateMetadataCreation,
      date_metadata_modification: (jeu as any).dateMetadataModification,
    }));
  },

  /**
   * Récupérer un jeu de données par ID via GraphQL
   */
  async getJeuDonneesById(id: number): Promise<JeuDonnees> {
    const data = await graphqlClient.request<{ jeuDonnees: JeuDonnees }>(GET_JEU_DONNEES_BY_ID, { id });
    const jeu = data.jeuDonnees;
    // Convertir les noms de champs GraphQL vers les noms de l'API REST
    return {
      ...jeu,
      organisation: typeof jeu.organisation === 'object' ? jeu.organisation : jeu.organisation,
      niveau_acces: (jeu as any).niveauAcces,
      url_originale: (jeu as any).urlOriginale,
      date_creation: (jeu as any).dateCreation,
      date_modification: (jeu as any).dateModification,
      date_metadata_creation: (jeu as any).dateMetadataCreation,
      date_metadata_modification: (jeu as any).dateMetadataModification,
    };
  },

  /**
   * Récupérer toutes les organisations via GraphQL
   */
  async getAllOrganisations(): Promise<Organisation[]> {
    const data = await graphqlClient.request<{ allOrganisations: Organisation[] }>(GET_ALL_ORGANISATIONS);
    // Convertir les noms de champs GraphQL vers les noms de l'API REST
    return data.allOrganisations.map((org) => ({
      ...org,
      nom_complet: (org as any).nomComplet,
      type_organisation: (org as any).typeOrganisation,
      nombre_jeux_donnees: (org as any).nombreJeuxDonnees,
      date_creation: (org as any).dateCreation,
      date_modification: (org as any).dateModification,
    }));
  },

  /**
   * Récupérer toutes les catégories via GraphQL
   */
  async getAllCategories(): Promise<Categorie[]> {
    const data = await graphqlClient.request<{ allCategories: Categorie[] }>(GET_ALL_CATEGORIES);
    // Convertir les noms de champs GraphQL vers les noms de l'API REST
    return data.allCategories.map((cat) => ({
      ...cat,
      nombre_jeux_donnees: (cat as any).nombreJeuxDonnees,
    }));
  },

  /**
   * Récupérer les statistiques via GraphQL
   */
  async getStats(): Promise<StatsResponse> {
    const data = await graphqlClient.request<StatsResponse>(GET_STATS);
    return {
      statsOrganisations: (data as any).statsOrganisations,
      statsJeuxDonnees: (data as any).statsJeuxDonnees,
      statsRessources: (data as any).statsRessources,
    };
  },
};

