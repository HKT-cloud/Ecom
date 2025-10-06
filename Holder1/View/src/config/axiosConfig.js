import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ecomexpress-dn3d.onrender.com', // Updated to your backend URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // Increased timeout to 30 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('temp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[Request] ${config.method.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`[Response] ${response.config.method.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    const status = error.response?.status;
    
    console.error('=== AXIOS ERROR ===');
    console.error('Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status,
      message: errorMessage,
      requestData: error.config?.data,
      responseData: error.response?.data,
      fullError: error
    });

    // Preserve the original error structure but add custom properties
    const customError = new Error(errorMessage);
    customError.response = error.response;
    customError.status = status;
    customError.config = error.config;
    customError.originalError = error;

    return Promise.reject(customError);
  }
);

// Export named API methods
export const login = (data) => api.post('/user/login', data);
export const signup = (data) => api.post('/user/signup', data);
export const sendOTP = (data) => api.post('/otp/send-otp', data);
export const verifyOTP = (data) => api.post('/otp/verify', data);

export default api;
