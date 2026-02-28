import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/update', data);

// ─── ACTIVITIES ───────────────────────────────────────────────────────────────

export const getActivities = () => api.get('/activities');
export const createActivity = (data) => api.post('/activities', data);
export const updateActivity = (id, data) => api.put(`/activities/${id}`, data);
export const deleteActivity = (id) => api.delete(`/activities/${id}`);

// ─── LOGS ─────────────────────────────────────────────────────────────────────

export const getLogs = (startDate, endDate) =>
  api.get('/logs', { params: { startDate, endDate } });
export const createLog = (data) => api.post('/logs', data);
export const updateLog = (id, data) => api.put(`/logs/${id}`, data);
export const deleteLog = (id) => api.delete(`/logs/${id}`);

// ─── ANALYTICS ────────────────────────────────────────────────────────────────

export const getAnalyticsSummary = (startDate, endDate) =>
  api.get('/analytics/summary', { params: { startDate, endDate } });
export const getDailyAnalytics = (startDate, endDate) =>
  api.get('/analytics/daily', { params: { startDate, endDate } });
export const getInsights = () => api.get('/analytics/insights');

export default api;
