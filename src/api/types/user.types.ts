import { IUserRole } from "@/interfaces/auth.interface";

export interface CreateUserRequestBody {
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: IUserRole | null;
}

export interface CreateUserResponseBody {
  id: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: IUserRole | null;
  modifiedAt: string | null;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  jwt: string;
}

export interface GetUserResponseBody {
  id: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: IUserRole;
}

export interface EditUserRequestBody {
  name?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: IUserRole | "";
}

export interface EditUserResponseBody {
  id: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: IUserRole;
}

export interface UpdateUserStatusRequestBody {
  status: UserStatus;
}

export enum UserStatus {
  Enabled = "Enabled",
  Disabled = "Disabled",
}
