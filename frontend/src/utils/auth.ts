import { User } from "../components/services/auth-api";

export const auth = {
  isAuthenticated(): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    const jwtItem = sessionStorage.getItem("jwt");
    if (jwtItem !== null) {
      return JSON.parse(jwtItem);
    } else {
      return false;
    }
  },
  authenticate(jwt: string, callback: () => void): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("jwt", JSON.stringify(jwt));
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
