import { Request } from "express";
import { IUser } from "./UserInterface";
export interface AuthRequest extends Request {
  user?: IUser;
}
