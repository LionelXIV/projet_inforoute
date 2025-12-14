import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dataService } from '../../services/dataService';
import { graphqlDataService } from '../../services/graphqlQueries';
import type {
  JeuDonnees,
  Organisation,
  Categorie,
  JeuxDonneesParams,
} from '../../types/data.types';

interface DataState {
  // Jeux de données
  jeuxDonnees: JeuDonnees[];
  currentJeuDonnees: JeuDonnees | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  loading: boolean;
  error: string | null;

  // Filtres
  filters: JeuxDonneesParams;

  // Organisations et catégories (pour les filtres)
  organisations: Organisation[];
  categories: Categorie[];
  loadingOrganisations: boolean;
  loadingCategories: boolean;
}

const initialState: DataState = {
  jeuxDonnees: [],
  currentJeuDonnees: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
  loading: false,
  error: null,
  filters: {},
  organisations: [],
  categories: [],
  loadingOrganisations: false,
  loadingCategories: false,
};

/**
 * Thunk pour récupérer les jeux de données via REST
 */
export const fetchJeuxDonnees = createAsyncThunk(
  'data/fetchJeuxDonnees',
  async (params?: JeuxDonneesParams) => {
    const response = await dataService.getAllJeuxDonnees(params);
    return response;
  }
);

/**
 * Thunk pour récupérer les jeux de données via GraphQL
 */
export const fetchJeuxDonneesGraphQL = createAsyncThunk(
  'data/fetchJeuxDonneesGraphQL',
  async () => {
    const jeux = await graphqlDataService.getAllJeuxDonnees();
    return {
      count: jeux.length,
      next: null,
      previous: null,
      results: jeux,
    };
  }
);

/**
 * Thunk pour récupérer un jeu de données par ID via REST
 */
export const fetchJeuDonneesById = createAsyncThunk(
  'data/fetchJeuDonneesById',
  async (id: number) => {
    const jeu = await dataService.getJeuDonneesById(id);
    return jeu;
  }
);

/**
 * Thunk pour récupérer un jeu de données par ID via GraphQL
 */
export const fetchJeuDonneesByIdGraphQL = createAsyncThunk(
  'data/fetchJeuDonneesByIdGraphQL',
  async (id: number) => {
    const jeu = await graphqlDataService.getJeuDonneesById(id);
    return jeu;
  }
);

/**
 * Thunk pour rechercher des jeux de données
 */
export const searchJeuxDonnees = createAsyncThunk(
  'data/searchJeuxDonnees',
  async ({ query, params }: { query: string; params?: Omit<JeuxDonneesParams, 'search'> }) => {
    const response = await dataService.searchJeuxDonnees(query, params);
    return response;
  }
);

/**
 * Thunk pour récupérer les organisations (pour les filtres)
 */
export const fetchOrganisations = createAsyncThunk(
  'data/fetchOrganisations',
  async () => {
    const response = await dataService.getAllOrganisations({ page_size: 100 });
    return response.results;
  }
);

/**
 * Thunk pour récupérer les catégories (pour les filtres)
 */
export const fetchCategories = createAsyncThunk(
  'data/fetchCategories',
  async () => {
    const response = await dataService.getAllCategories({ page_size: 100 });
    return response.results;
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<JeuxDonneesParams>) => {
      // Réinitialiser la page à 1 lors de l'application de nouveaux filtres (sauf si page est explicitement fournie)
      const newFilters = { ...action.payload };
      if (!newFilters.page) {
        newFilters.page = 1;
      }
      state.filters = newFilters;
      // Réinitialiser les jeux de données pour forcer le rechargement
      state.jeuxDonnees = [];
    },
    clearFilters: (state) => {
      state.filters = {};
      // Réinitialiser les jeux de données pour forcer le rechargement
      state.jeuxDonnees = [];
    },
    setCurrentJeuDonnees: (state, action: PayloadAction<JeuDonnees | null>) => {
      state.currentJeuDonnees = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchJeuxDonnees
    builder
      .addCase(fetchJeuxDonnees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJeuxDonnees.fulfilled, (state, action) => {
        state.loading = false;
        state.jeuxDonnees = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(fetchJeuxDonnees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la récupération des jeux de données';
      });

    // fetchJeuxDonneesGraphQL
    builder
      .addCase(fetchJeuxDonneesGraphQL.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJeuxDonneesGraphQL.fulfilled, (state, action) => {
        state.loading = false;
        state.jeuxDonnees = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(fetchJeuxDonneesGraphQL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la récupération des jeux de données';
      });

    // fetchJeuDonneesById
    builder
      .addCase(fetchJeuDonneesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJeuDonneesById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJeuDonnees = action.payload;
      })
      .addCase(fetchJeuDonneesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la récupération du jeu de données';
      });

    // fetchJeuDonneesByIdGraphQL
    builder
      .addCase(fetchJeuDonneesByIdGraphQL.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJeuDonneesByIdGraphQL.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJeuDonnees = action.payload;
      })
      .addCase(fetchJeuDonneesByIdGraphQL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la récupération du jeu de données';
      });

    // searchJeuxDonnees
    builder
      .addCase(searchJeuxDonnees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJeuxDonnees.fulfilled, (state, action) => {
        state.loading = false;
        state.jeuxDonnees = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(searchJeuxDonnees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la recherche';
      });

    // fetchOrganisations
    builder
      .addCase(fetchOrganisations.pending, (state) => {
        state.loadingOrganisations = true;
      })
      .addCase(fetchOrganisations.fulfilled, (state, action) => {
        state.loadingOrganisations = false;
        state.organisations = action.payload;
      })
      .addCase(fetchOrganisations.rejected, (state) => {
        state.loadingOrganisations = false;
      });

    // fetchCategories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loadingCategories = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loadingCategories = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loadingCategories = false;
      });
  },
});

export const { setFilters, clearFilters, setCurrentJeuDonnees, clearError } = dataSlice.actions;
export default dataSlice.reducer;


