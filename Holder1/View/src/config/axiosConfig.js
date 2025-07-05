import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/user', // ✅ This matches backend routing
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    // ❌ DO NOT include 'Origin' header manually
  },
  timeout: 5000
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(  
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        return Promise.reject(error);
    }
);

export default api;
