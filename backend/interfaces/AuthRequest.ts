import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    seller: boolean;
    iat: number;
    exp: number;
  };
}
