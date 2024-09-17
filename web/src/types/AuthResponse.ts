import { User } from "./User";
export interface AuthResponse {
  token: string;
  user: User;
}
