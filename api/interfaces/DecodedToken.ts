export interface IDecodedToken {
  _id: string;
  name: string;
  email: string;
  seller: boolean;
  iat: number;
  exp: number;
}
