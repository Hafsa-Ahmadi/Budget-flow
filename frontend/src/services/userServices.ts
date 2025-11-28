import api from './api';
import { ApiResponse, User } from '../types';

export const userService = {
  // Get all users (for selecting expense participants)
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get<ApiResponse<{ users: User[] }>>('/users');
      return response.data.data.users;
    } catch (error) {
      // If endpoint doesn't exist yet, return mock data
      return [];
    }
  },

  // Search users by name or email
  searchUsers: async (query: string): Promise<User[]> => {
    try {
      const response = await api.get<ApiResponse<{ users: User[] }>>(
        `/users/search?q=${query}`
      );
      return response.data.data.users;
    } catch (error) {
      return [];
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>(`/users/${id}`);
    return response.data.data.user;
  }
};