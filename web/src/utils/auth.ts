import { getUserFromToken } from './authUtils';
import { authenticateUser, clearUserToken } from './authActions';
import { AxiosResponse } from 'axios';
import { AuthResponse, User } from '@/types';

export const auth = {
  isAuthenticated() {
    return getUserFromToken();
  },
  authenticate(jwt: AxiosResponse<AuthResponse>, callback: () => void) {
    authenticateUser(jwt, callback);
  },
  logout(callback: () => void) {
    clearUserToken(callback);
  },
};
