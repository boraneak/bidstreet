import { IUser } from "./UserInterface";

export interface UserRequest extends Request {
  user?: IUser;
}
