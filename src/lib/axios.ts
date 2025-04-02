import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    if (config.url !== '/api/login') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message || 'Unknown error';

      switch (status) {
        case 401:
          console.error('Unauthorized:', message);
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('token');
          // router.push('/'); // Redirect using router
          break;

        case 403:
          console.error('Forbidden:', message);
          toast.error('You don’t have permission to access this resource.');
          break;

        case 404:
          console.error('Not Found:', message);
          toast.error('Requested resource not found.');
          break;

        case 500:
          console.error('Server Error:', message);
          toast.error('Something went wrong on the server. Please try again later.');
          break;

        default:
          console.error('API Error:', message);
          toast.error(`Error: ${message}`);
          break;
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Timeout Error:', error.message);
      toast.error('Request timed out. Please try again.');
    } else if (error.message.includes('Network Error')) {
      console.error('Network Error:', error.message);
      toast.error('Unable to connect to the server. Please check your internet connection.');
    } else if (error.code === 'ERR_CONNECTION_REFUSED') {
      console.error('Connection Refused:', error.message);
      toast.error('Failed to connect to the server. Please try again later.');
    } else {
      console.error('Unexpected Error:', error.message);
      toast.error(`Error: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

export default api;
