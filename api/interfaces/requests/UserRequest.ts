import { IUser } from "../User";
import { Request } from "express";
export interface IUserRequest extends Request {
  user?: IUser;
}
