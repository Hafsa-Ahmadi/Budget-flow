// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Expense Types
export type Category = 
  | 'Food' 
  | 'Transport' 
  | 'Shopping' 
  | 'Entertainment' 
  | 'Bills' 
  | 'Healthcare' 
  | 'Other';

export interface SplitDetail {
  userId: string;
  amount: number;
  paid: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
  paidBy: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  splitBetween: {
    userId: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    amount: number;
    paid: boolean;
  }[];
  receiptUrl?: string;
  notes?: string;
  settled: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseData {
  description: string;
  amount: number;
  category: Category;
  date?: string;
  paidBy: string;
  splitBetween: string[];
  notes?: string;
  receiptUrl?: string;
}

export interface UpdateExpenseData {
  description?: string;
  notes?: string;
  category?: Category;
}

export interface ExpenseFilters {
  category?: Category;
  startDate?: string;
  endDate?: string;
  settled?: boolean;
  page?: number;
  limit?: number;
}

export interface ExpensePagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ExpenseStats {
  category: string;
  total: number;
  count: number;
}

// Budget Types
export interface Budget {
  id: string;
  userId: string;
  category: Category;
  limit: number;
  spent: number;
  month: number;
  year: number;
  color: string;
  alertThreshold: number;
  utilizationPercentage: number;
  remaining: number;
  isExceeded: boolean;
  alertTriggered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetData {
  category: Category;
  limit: number;
  month: number;
  year: number;
  color?: string;
  alertThreshold?: number;
}

export interface UpdateBudgetData {
  limit?: number;
  color?: string;
  alertThreshold?: number;
}

export interface BudgetOverview {
  overview: {
    totalBudget: number;
    totalSpent: number;
    totalRemaining: number;
    utilizationPercentage: number;
  };
  alerts: {
    exceededCount: number;
    exceededBudgets: {
      category: string;
      limit: number;
      spent: number;
      excess: number;
    }[];
    alertCount: number;
    alertBudgets: {
      category: string;
      limit: number;
      spent: number;
      percentage: number;
    }[];
  };
}

// Settlement Types
export interface Settlement {
  from: {
    id: string;
    name: string;
  };
  to: {
    id: string;
    name: string;
  };
  amount: number;
}

export interface Balance {
  userId: string;
  userName: string;
  balance: number;
  owes: boolean;
  isOwed: boolean;
}

export interface SettlementResponse {
  settlements: Settlement[];
  balances: Balance[];
}

export interface SettlementSummary {
  summary: {
    totalOwed: number;
    totalOwing: number;
    netBalance: number;
    status: 'owed' | 'owing' | 'settled';
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
}
```