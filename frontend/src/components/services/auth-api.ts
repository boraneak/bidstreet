import axios, { AxiosResponse } from "axios";
import config from "../../utils/config";

export interface User {
  name?: string;
  email: string;
  password: string;
}

export const signin = async (user: User): Promise<AxiosResponse<any>> => {
  try {
    const response = await axios.post(`${config.BASE_URL}/auth/signin/`, user, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signup = async (user: User): Promise<AxiosResponse<any>> => {
  try {
    const response = await axios.post(`${config.BASE_URL}/users/create`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
