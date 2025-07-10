import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/';
const userId = localStorage.getItem('userId')

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const getGeminiResponse = (body) => apiClient.post(`chat`, body);
export const getPrediction = (body) => apiClient.post(`predict_full_budget`, {user_id: userId});
