import axios from 'axios';
import { USERNAME, PASSWORD } from './secrets';

const API_BASE_URL = 'http://localhost:8080/api/';

// Encode to Base64 for Basic Auth
const token = btoa(`${USERNAME}:${PASSWORD}`);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${token}`,
  },
});

// Budget Endpoints
export const getBudgets = (userId) => apiClient.get(`${userId}/budgets`);
export const getBudgetById = (userId, budgetId) => apiClient.get(`${userId}/budgets/${budgetId}`);
export const createBudget = (userId, data) => apiClient.post(`${userId}/budgets`, data);
export const updateBudget = (userId, budgetId, data) => apiClient.put(`${userId}/budgets/${budgetId}`, data);
export const deleteBudget = (userId, budgetId) => apiClient.delete(`${userId}/budgets/${budgetId}`);

// Optional: Add auth header token setup if needed
// apiClient.interceptors.request.use(config => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
