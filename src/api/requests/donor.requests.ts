import axios from "axios";
import { PaginatedResponse, QueryParams } from "../types/global.types";
import { IDonor } from "../types/donor.types";

async function getAll(
  params?: QueryParams<IDonor>
): Promise<PaginatedResponse<IDonor>> {
  const res = await axios.get("/donorinfo", { params });
  return res.data;
}

export const DonorRequests = {
  getAll,
};
