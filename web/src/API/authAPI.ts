import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse } from '../types/AuthResponse';
import { SignUpData } from '../types/SignUpData';
import { SignInData } from '../types/SignInData';
// Create a custom API client
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Custom error class for API errors
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API errors
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw new ApiError(
      error.response?.status || 500,
      error.response?.data?.message || 'An unexpected error occurred',
    );
  }
  throw error;
};

// Authentication service
export const AuthService = {
  async signIn(data: SignInData): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post(
        '/auth/signin',
        data,
      );
      return response;
    } catch (error) {
      console.error('Error signing in:', error);
      throw handleApiError(error);
    }
  },

  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post(
        '/auth/signup',
        data,
      );
      return response.data;
    } catch (error) {
      console.error('Error creating account:', error);
      throw handleApiError(error);
    }
  },
};

export default AuthService;