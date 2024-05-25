export interface DecodedToken {
  _id: string;
  name: string;
  email: string;
  seller: boolean;
  iat: number;
  exp: number;
}
