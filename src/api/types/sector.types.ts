import { BaseResponseModel } from "./global.types";

export interface CreateSectorRequestBody {
  name: string;
  description: string;
  assignedCoordinatorIds: string[];
}

export interface CreateSectorResponseBody {
  id: string;
  name: string;
  description: string;
}

export interface Coordinator {
  id: string;
  userId: string;
  name: string;
  email: string;
  appointedAt: string;
}

export interface Project extends BaseResponseModel {
  name: string;
  assignedToSectorName: string;
  assignedToSectorId: string;
  currentCoordinators: Coordinator[];
  budget?: Budget;
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

export interface Sector extends BaseResponseModel {
  name: string;
  projects: Project[];
  currentCoordinators: Coordinator[];
  budget?: Budget;
}
