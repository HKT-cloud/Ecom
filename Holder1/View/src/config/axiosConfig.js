import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ecomexpress-dn3d.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000 // Increased timeout to 15 seconds
});

// Export named API methods
export const login = (data) => api.post('/user/login', data);
export const signup = (data) => api.post('/user/signup', data);
export const sendOTP = (data) => api.post('/otp/send-otp', data);
export const verifyOTP = (data) => api.post('/user/otp/verify', data);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add Authorization token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the request for debugging
    console.log('[API Request]', {
      method: config.method.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers,
      data: config.data
    });

    return config;
  },
  (error) => {
    console.error('Request error:', {
      message: error.message,
      config: error.config,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

// ✅ Clean single response interceptor
api.interceptors.response.use(
  (response) => response,
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
