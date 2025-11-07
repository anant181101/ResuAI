import axios from 'axios';
import { getIdToken } from './auth';

const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const baseURL = base.endsWith('/api') ? base : `${base.replace(/\/$/, '')}/api`;
const api = axios.create({ baseURL });

api.interceptors.request.use(async (config) => {
  try {
    const token = await getIdToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export default api;
