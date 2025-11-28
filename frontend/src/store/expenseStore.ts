import { create } from 'zustand';
import { Expense, CreateExpenseData, ExpenseFilters } from '../types';
import { expenseService } from '../services/expenseService';

interface ExpenseState {
  expenses: Expense[];
  currentExpense: Expense | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };

  // Actions
  fetchExpenses: (filters?: ExpenseFilters) => Promise<void>;
  fetchExpense: (id: string) => Promise<void>;
  createExpense: (data: CreateExpenseData) => Promise<void>;
  updateExpense: (id: string, data: any) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  settleExpense: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  currentExpense: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },

  fetchExpenses: async (filters) => {
    set({ loading: true, error: null });
    try {
      const data = await expenseService.getExpenses(filters);
      set({
        expenses: data.expenses,
        pagination: data.pagination,
        loading: false
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to fetch expenses'
      });
    }
  },

  fetchExpense: async (id) => {
    set({ loading: true, error: null });
    try {
      const expense = await expenseService.getExpense(id);
      set({
        currentExpense: expense,
        loading: false
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to fetch expense'
      });
    }
  },

  createExpense: async (data) => {
    set({ loading: true, error: null });
    try {
      const expense = await expenseService.createExpense(data);
      set((state) => ({
        expenses: [expense, ...state.expenses],
        loading: false
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to create expense'
      });
      throw error;
    }
  },

  updateExpense: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await expenseService.updateExpense(id, data);
      set((state) => ({
        expenses: state.expenses.map((exp) =>
          exp.id === id ? updated : exp
        ),
        currentExpense: state.currentExpense?.id === id ? updated : state.currentExpense,
        loading: false
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to update expense'
      });
      throw error;
    }
  },

  deleteExpense: async (id) => {
    set({ loading: true, error: null });
    try {
      await expenseService.deleteExpense(id);
      set((state) => ({
        expenses: state.expenses.filter((exp) => exp.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to delete expense'
      });
      throw error;
    }
  },

  settleExpense: async (id) => {
    set({ loading: true, error: null });
    try {
      const updated = await expenseService.settleExpense(id);
      set((state) => ({
        expenses: state.expenses.map((exp) =>
          exp.id === id ? updated : exp
        ),
        loading: false
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to settle expense'
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));