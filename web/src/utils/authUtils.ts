import { JwtPayload, jwtDecode } from 'jwt-decode';
import { User } from '@/types';

export const getUserFromToken = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const token = sessionStorage.getItem('jwt');
  if (token !== null) {
    const decodedToken: any = jwtDecode<JwtPayload>(token);
    const user: User = {
      id: decodedToken._id,
      seller: decodedToken.seller,
      name: decodedToken.name,
      email: decodedToken.email,
    };
    return user;
  } else {
    return null;
  }
};
