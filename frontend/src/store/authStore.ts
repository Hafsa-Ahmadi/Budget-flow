import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUserFromStorage: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setToken: (token) => set({ token }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Login failed'
      });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.register({ name, email, password });
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Registration failed'
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null
    });
  },

  loadUserFromStorage: () => {
    const user = authService.getCurrentUser();
    const token = authService.getToken();
    if (user && token) {
      set({
        user,
        token,
        isAuthenticated: true
      });
    }
  },

  clearError: () => set({ error: null })
}));