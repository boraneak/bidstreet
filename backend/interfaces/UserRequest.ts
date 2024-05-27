import { IUser } from "./UserInterface";
import { Request } from "express";
export interface UserRequest extends Request {
  user?: IUser;
}
