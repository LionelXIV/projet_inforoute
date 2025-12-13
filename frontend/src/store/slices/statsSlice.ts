import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dataService } from '../../services/dataService';
import { graphqlDataService } from '../../services/graphqlQueries';
import type { StatsResponse } from '../../types/data.types';

interface StatsState {
  stats: StatsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  stats: null,
  loading: false,
  error: null,
};

/**
 * Thunk pour récupérer les statistiques via REST
 */
export const fetchStats = createAsyncThunk('stats/fetchStats', async () => {
  const stats = await dataService.getStats();
  return stats;
});

/**
 * Thunk pour récupérer les statistiques via GraphQL
 */
export const fetchStatsGraphQL = createAsyncThunk('stats/fetchStatsGraphQL', async () => {
  const stats = await graphqlDataService.getStats();
  return stats;
});

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchStats
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la récupération des statistiques';
      });

    // fetchStatsGraphQL
    builder
      .addCase(fetchStatsGraphQL.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatsGraphQL.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStatsGraphQL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la récupération des statistiques';
      });
  },
});

export const { clearError } = statsSlice.actions;
export default statsSlice.reducer;


