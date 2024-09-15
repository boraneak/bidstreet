import { JwtPayload, jwtDecode } from "jwt-decode";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../components/services/authAPI";

interface User {
  id: string;
  name: string;
  email: string;
  seller: boolean;
}

export const auth = {
  isAuthenticated() {
    if (typeof window === "undefined") {
      return null;
    }
    const token = sessionStorage.getItem("jwt");
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
  },
  authenticate(jwt: AxiosResponse<AuthResponse>, callback: () => void): void {  // Expecting AxiosResponse
    if (typeof window !== "undefined") {
      const token = jwt.data.token; // Extract the token from the AxiosResponse data
      sessionStorage.setItem("jwt", token); // Store the token in sessionStorage
    }
    callback();
  },
  clearJwt(callback: () => void): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("jwt");
    }
    callback();
  },
};
