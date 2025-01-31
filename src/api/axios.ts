import axios from 'axios';

const api = axios.create({
  baseURL: process.env.React_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure headers exist before setting Authorization
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
