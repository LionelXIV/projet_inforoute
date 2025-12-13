import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import dataSlice from './slices/dataSlice';
import statsSlice from './slices/statsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    data: dataSlice,
    stats: statsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


