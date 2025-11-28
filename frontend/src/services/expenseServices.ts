import api from './api';
import {
  ApiResponse,
  Expense,
  CreateExpenseData,
  UpdateExpenseData,
  ExpenseFilters,
  ExpensePagination,
  ExpenseStats
} from '../types';

export const expenseService = {
  // Get all expenses with optional filters
  getExpenses: async (filters?: ExpenseFilters): Promise<{
    expenses: Expense[];
    pagination: ExpensePagination;
  }> => {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.settled !== undefined) params.append('settled', String(filters.settled));
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await api.get<ApiResponse<{
      expenses: Expense[];
      pagination: ExpensePagination;
    }>>(`/expenses?${params.toString()}`);

    return response.data.data;
  },

  // Get single expense by ID
  getExpense: async (id: string): Promise<Expense> => {
    const response = await api.get<ApiResponse<{ expense: Expense }>>(
      `/expenses/${id}`
    );
    return response.data.data.expense;
  },

  // Create new expense
  createExpense: async (data: CreateExpenseData): Promise<Expense> => {
    const response = await api.post<ApiResponse<{ expense: Expense }>>(
      '/expenses',
      data
    );
    return response.data.data.expense;
  },

  // Update expense
  updateExpense: async (id: string, data: UpdateExpenseData): Promise<Expense> => {
    const response = await api.put<ApiResponse<{ expense: Expense }>>(
      `/expenses/${id}`,
      data
    );
    return response.data.data.expense;
  },

  // Delete expense
  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },

  // Mark expense as settled
  settleExpense: async (id: string): Promise<Expense> => {
    const response = await api.put<ApiResponse<{ expense: Expense }>>(
      `/expenses/${id}/settle`
    );
    return response.data.data.expense;
  },

  // Get expense statistics
  getExpenseStats: async (filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ExpenseStats[]> => {
    const params = new URLSearchParams();
    
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await api.get<ApiResponse<{ stats: ExpenseStats[] }>>(
      `/expenses/stats?${params.toString()}`
    );
    return response.data.data.stats;
  }
};