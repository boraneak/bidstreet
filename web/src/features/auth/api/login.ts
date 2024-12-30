import { AxiosResponse } from 'axios';
import axios from '@/utils/axiosInstance';
import { AuthResponse, LoginData } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const login = async (
  data: LoginData,
): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const axios = await axiosInstance();
    const response: AxiosResponse<AuthResponse> = await axios.post(
      '/auth/login',
      data,
    );
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return undefined as unknown as AxiosResponse<AuthResponse>;
  }
};
