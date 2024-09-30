import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Create a custom API client
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const csrfApiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:9000',
  withCredentials: true,
});

// Function to get CSRF token
const getCsrfToken = async (): Promise<string> => {
  const response = await csrfApiClient.get('/csrf-token');
  return response.data.csrfToken;
};

// Interceptor to add CSRF token to relevant requests
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (
      config.method &&
      ['post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase())
    ) {
      const token = await getCsrfToken();
      config.headers['X-CSRF-Token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
