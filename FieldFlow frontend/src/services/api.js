import axios from 'axios';

// API URL: Uses VITE_API_URL env var. Set this to your Vercel backend URL in production.
// Locally defaults to http://localhost:5001/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s for Vercel serverless cold starts
});

// Request interceptor to automatically attach authorization headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ff_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error mapping
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Unauthorized: Clear tokens and redirect to login
      localStorage.removeItem('ff_token');
      localStorage.removeItem('ff_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      console.error('Forbidden: Access is denied.');
    } else if (status === 500) {
      console.error('Internal Server Error: Please try again later.');
    } else if (!error.response) {
      console.error('Network Error: Please check your internet connection or that the backend is running on port 5001.');
    }

    return Promise.reject(error);
  }
);

export default api;
