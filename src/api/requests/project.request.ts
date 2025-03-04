import {
  CreateProjectRequestBody,
  CreateProjectResponseBody,
  IProject,
  EditProjectRequestBody,
  EditProjectResponseBody,
} from "@/api/types/project.types.ts";
import axios from "axios";
import { PaginatedResponse, QueryParams } from "@/api/types/global.types.ts";

async function create(
  data: CreateProjectRequestBody
): Promise<CreateProjectResponseBody> {
  const res = await axios.post<CreateProjectResponseBody>(
    `/sectors/${data.sectorId}/projects`,
    data
  );
  return res.data;
}

async function getAll(
  params?: QueryParams<IProject>
): Promise<PaginatedResponse<IProject>> {
  const res = await axios.get("/projects", { params });
  return res.data;
}

async function getById(projectId: string): Promise<IProject> {
  const res = await axios.get<IProject>(`/projects/${projectId}`);
  return res.data;
}

async function editProject(
  sectorId: string,
  projectId: string,
  data: EditProjectRequestBody
): Promise<EditProjectResponseBody> {
  const res = await axios.put<EditProjectResponseBody>(
    `/sectors/${sectorId}/projects/update/${projectId}`,
    data
  );
  return res.data;
}

export const ProjectRequest = {
  create,
  getById,
  getAll,
  editProject,
};
