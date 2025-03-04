import axios from "axios";
import { PaginatedResponse, QueryParams } from "@/api/types/global.types.ts";
import {
  CreateUserRequestBody,
  CreateUserResponseBody,
  EditUserRequestBody,
  EditUserResponseBody,
  GetUserResponseBody,
  UpdateUserStatusRequestBody,
} from "@/api/types/user.types";
import { IUser } from "@/interfaces/auth.interface.ts";

async function getAll(
  params?: QueryParams<IUser>
): Promise<PaginatedResponse<IUser>> {
  const res = await axios.get("/users", { params });
  return res.data;
}

async function getUser(userId: string): Promise<GetUserResponseBody> {
  const res = await axios.get<GetUserResponseBody>(`/users/${userId}`);
  return res.data;
}

async function createUser(
  data: CreateUserRequestBody
): Promise<CreateUserResponseBody> {
  const res = await axios.post<CreateUserResponseBody>("/users", data);
  return res.data;
}

async function editUser(
  userId: string,
  data: EditUserRequestBody
): Promise<EditUserResponseBody> {
  const res = await axios.put<EditUserResponseBody>(`/users/${userId}`, data);
  return res.data;
}

async function updateUserStatus(
  userId: string,
  data: UpdateUserStatusRequestBody
): Promise<void> {
  await axios.put(`/users/${userId}/update-status`, data);
}

export const UserRequests = {
  createUser,
  getAll,
  getUser,
  editUser,
  updateUserStatus,
};
