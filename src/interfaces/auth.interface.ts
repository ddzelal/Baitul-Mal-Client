import { LoginResponseBody } from "@/api/types/auth.types.ts";
import React from "react";
import { BaseEntityModel } from "@/api/types/global.types.ts";

export interface IUser extends BaseEntityModel {
  name: string;
  lastName: string;
  email: string;
  role: IUserRole;
}

export enum IUserRole {
  Admin = "Admin",
  FinanceLead = "FinanceLead",
  Contributor = "Contributor",
  Unassigned = "Unassigned",
}

export type IAuth = LoginResponseBody;

export interface AuthContextType {
  user: IAuth | null;
  login: (user: IAuth) => void;
  update: (user: IAuth) => void;
  logout: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  userData: IAuth | null;
}
