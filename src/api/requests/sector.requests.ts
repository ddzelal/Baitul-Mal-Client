import axios from "axios";
import {
  CreateSectorRequestBody,
  CreateSectorResponseBody,
  Sector,
} from "@/api/types/sector.types";
import { PaginatedResponse, QueryParams } from "@/api/types/global.types.ts";

async function getAll(
  params?: QueryParams<Sector>
): Promise<PaginatedResponse<Sector>> {
  const res = await axios.get("/sectors", { params });
  return res.data;
}

async function createSector(
  data: CreateSectorRequestBody
): Promise<CreateSectorResponseBody> {
  const res = await axios.post<CreateSectorResponseBody>("/sectors", data);
  return res.data;
}

async function getById(id: string): Promise<Sector> {
  const res = await axios.get(`/sectors/${id}`);
  return res.data;
}

export const SectorRequests = {
  createSector,
  getAll,
  getById,
};
