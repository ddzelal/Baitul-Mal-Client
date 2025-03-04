import { IUserRole } from "@/interfaces/auth.interface.ts";

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponseBody {
  id: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: IUserRole;
  jwt: string;
}
