import { BaseResponseModel } from "./global.types";

export interface IDonor extends BaseResponseModel {
  name: string;
  lastName: string;
  email: string;
  description: string;
  phoneNumber: string;
}
