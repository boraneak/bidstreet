import { AxiosResponse } from 'axios';
import { AuthResponse } from '@/types';

export const authenticateUser = (
  jwt: AxiosResponse<AuthResponse>,
  callback: () => void,
) => {
  if (typeof window !== 'undefined') {
    const token = jwt.data.token;
    sessionStorage.setItem('jwt', token);
  }
  callback();
};

export const clearUserToken = (callback: () => void) => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('jwt');
  }
  callback();
};
