import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const createClient = (baseURL: string): AxiosInstance =>
  axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

const apiClient = createClient(process.env.REACT_APP_API_BASE_URL!);
const csrfApiClient = createClient(process.env.REACT_APP_CSRF_BASE_URL!);

const getCsrfToken = async (): Promise<string> => {
  const { data } = await csrfApiClient.get('/csrf-token');
  return data.csrfToken;
};

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (
      ['post', 'put', 'delete', 'patch'].includes(
        config.method?.toLowerCase() || '',
      )
    ) {
      config.headers['X-CSRF-Token'] = await getCsrfToken();
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
