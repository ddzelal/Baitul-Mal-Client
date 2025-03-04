import { LoginRequestBody, LoginResponseBody } from "@/api/types/auth.types.ts";
import axios from "axios";

async function login(data: LoginRequestBody): Promise<LoginResponseBody> {
  const res = await axios.post<LoginResponseBody>("/auth/login", data);
  return res.data;
}

async function getMe(): Promise<LoginResponseBody> {
  const res = await axios.get<LoginResponseBody>("/auth/me");
  return res.data;
}

export const AuthRequests = {
  login,
  getMe,
};
