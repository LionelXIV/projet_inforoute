import axios from 'axios';
import type { LoginCredentials, AuthResponse, User, UpdateProfileData } from '../types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  /**
   * Connexion d'un utilisateur
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login/', credentials);
    return response.data;
  },

  /**
   * Récupérer l'utilisateur actuel
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/auth/user/');
    return response.data;
  },

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put<User>('/api/auth/user/', data);
    return response.data;
  },

  /**
   * Déconnexion (côté client uniquement)
   */
  logout(): void {
    localStorage.removeItem('token');
  },
};

export default api;

