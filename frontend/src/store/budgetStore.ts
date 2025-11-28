import { create } from 'zustand';
import { Budget, CreateBudgetData, BudgetOverview } from '../types';
import { budgetService } from '../services/budgetService';

interface BudgetState {
  budgets: Budget[];
  overview: BudgetOverview | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchBudgets: (month?: number, year?: number) => Promise<void>;
  fetchBudgetOverview: (month?: number, year?: number) => Promise<void>;
  createBudget: (data: CreateBudgetData) => Promise<void>;
  updateBudget: (id: string, data: any) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  budgets: [],
  overview: null,
  loading: false,
  error: null,

  fetchBudgets: async (month, year) => {
    set({ loading: true, error: null });
    try {
      const budgets = await budgetService.getBudgets({ month, year });
      set({
        budgets,
        loading: false
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to fetch budgets'
      });
    }
  },

  fetchBudgetOverview: async (month, year) => {
    set({ loading: true, error: null });
    try {
      const overview = await budgetService.getBudgetOverview({ month, year });
      set({
        overview,
        loading: false
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to fetch budget overview'
      });
    }
  },

  createBudget: async (data) => {
    set({ loading: true, error: null });
    try {
      const budget = await budgetService.createBudget(data);
      set((state) => ({
        budgets: [...state.budgets.filter(b => b.category !== budget.category), budget],
        loading: false
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to create budget'
      });
      throw error;
    }
  },

  updateBudget: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await budgetService.updateBudget(id, data);
      set((state) => ({
        budgets: state.budgets.map((b) => (b.id === id ? updated : b)),
        loading: false
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to update budget'
      });
      throw error;
    }
  },

  deleteBudget: async (id) => {
    set({ loading: true, error: null });
    try {
      await budgetService.deleteBudget(id);
      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to delete budget'
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));