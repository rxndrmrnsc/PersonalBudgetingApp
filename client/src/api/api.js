import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // The Authorization header will be dynamically set by App.jsx
  },
});

// Budget Endpoints - now accept userId as a parameter
export const getBudgets = (userId) => apiClient.get(`${userId}/budgets`);
export const getBudgetById = (userId, budgetId) => apiClient.get(`${userId}/budgets/${budgetId}`);
export const createBudget = (userId, data) => apiClient.post(`${userId}/budgets`, data);
export const updateBudget = (userId, budgetId, data) => apiClient.put(`${userId}/budgets/${budgetId}`, data);
export const deleteBudget = (userId, budgetId) => apiClient.delete(`${userId}/budgets/${budgetId}`);