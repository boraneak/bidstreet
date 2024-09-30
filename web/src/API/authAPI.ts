import { AxiosResponse } from 'axios';
import apiClient from '../utils/apiClient';
import { handleApiError } from '../utils/errorUtils';
import { AuthResponse } from '../types/AuthResponse';
import { SignUpData } from '../types/SignUpData';
import { SignInData } from '../types/SignInData';

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
