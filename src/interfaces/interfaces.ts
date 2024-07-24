import { StatusCode } from "./enum";

export interface Message {
    message: string ;
  }


export interface AdminLogin {
  message: string;
  email: string;
  token: string;
}

export interface UserCredentials {
  userId: string;
  role: string;
}
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  message: string;
  name: string;
  refreshToken: string;
  token: string;
  _id: string;
}