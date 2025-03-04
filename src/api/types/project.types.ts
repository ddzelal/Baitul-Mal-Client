import { BaseResponseModel } from "./global.types";

export interface CreateProjectRequestBody {
  name: string;
  description?: string;
  sectorId: string;
  assignedCoordinatorIds: string[];
}

export interface CreateProjectResponseBody {
  name: string;
}

export interface Coordinator {
  id: string;
  name: string;
  email: string;
  appointedAt: string;
}

export interface Budget {
  budgetId: string;
  budgetName: string;
  assignedAmount: number;
  unassignedAmount: number;
  reservedAmount: number;
  pendingAmount: number;
  spentAmount: number;
}

export enum ProjectOutcomeType {
  Success = "Success",
  Failed = "Failed",
  PartialSuccess = "PartialSuccess",
  Postoponed = "Postoponed",
  Paused = "Paused",
  Stoped = "Stoped",
  Ongoing = "Ongoing",
  NewlyCreated = "NewlyCreated",
}

export interface IProject extends BaseResponseModel {
  name: string;
  assignedToSectorName: string;
  assignedToSectorId: string;
  currentCoordinators: Coordinator[];
  budget?: Budget;
  outcomeType: ProjectOutcomeType;
  description: string;
}

export interface EditProjectRequestBody {
  name: string | null;
  description: string | null;
  sectorId: string | null;
}

export interface EditProjectResponseBody {
  name: string;
  description: string;
}
