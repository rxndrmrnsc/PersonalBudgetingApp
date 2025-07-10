import axios from 'axios';
//import { USERNAME, PASSWORD } from './secrets';

const API_BASE_URL = 'http://localhost:8080/api/';

const username = localStorage.getItem('username')
const password = localStorage.getItem('password')
const userId = localStorage.getItem('userId')
// Encode to Base64 for Basic Auth
const token = btoa(`${username}:${password}`);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${token}`,
  },
});

// Budget Endpoints
export const getBudgets = () => apiClient.get(`${userId}/budgets`);
export const getBudgetById = (budgetId) => apiClient.get(`${userId}/budgets/${budgetId}`);
export const createBudget = (data) => apiClient.post(`${userId}/budgets`, data);
export const updateBudget = (budgetId, data) => apiClient.put(`${userId}/budgets/${budgetId}`, data);
export const deleteBudget = (budgetId) => apiClient.delete(`${userId}/budgets/${budgetId}`);