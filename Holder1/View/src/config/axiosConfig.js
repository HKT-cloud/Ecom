import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ecomexpress-dn3d.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 5000,
  // Ensure we always use the full URL
  transformRequest: [(data, headers) => {
    return data;
  }]
});

// ✅ Clean single request interceptor
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
      fullUrl: config.baseURL + config.url,
      headers: config.headers,
      data: config.data
    });

    // Ensure we always use the full URL
    config.url = config.baseURL + config.url;
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
