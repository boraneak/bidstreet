import { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axiosInstance';
import { AuthResponse, RegisterData } from '@/types';

export const register = async (
  data: RegisterData,
): Promise<AuthResponse | undefined> => {
  try {
    const axios = await axiosInstance();
    const response: AxiosResponse<AuthResponse> = await axios.post(
      '/auth/register',
      data,
    );
    return response.data;
  } catch (error) {
    console.error('Error creating account:', error);
  }
};
