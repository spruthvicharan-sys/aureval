import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'https://aureval.onrender.com';

const api = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  res => res.data ?? {},
  err => {
    const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Request failed';
    throw new Error(msg);
  }
);

export const evaluateResponse = (payload) => api.post('/evaluate', payload);
export const generateResponse  = (payload) => api.post('/generate', payload);
export const getHistory        = ()         => api.get('/history');
export const getHistoryItem    = (id)       => api.get(`/history/${id}`);
export const deleteHistoryItem = (id)       => api.delete(`/history/${id}`);
export const clearHistory      = ()         => api.delete('/history/clear');
export const healthCheck       = ()         => axios.get('/health').then(r => r.data);

export default api;
