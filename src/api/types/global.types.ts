export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  itemCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginationParams {
  PageNumber?: number;
  PageSize?: number;
}

type SortParams = {
  SortByField?: string;
  SortOrder?: "asc" | "desc";
};

type FilterParams<T> = {
  [P in keyof T]?: T[P];
} & {
  SearchTerm?: string;
};

interface CommonQueryParams {
  IncludeDeleted?: boolean;
}

export type QueryParams<T> = PaginationParams &
  SortParams &
  FilterParams<T> &
  CommonQueryParams;

export interface BaseEntityModel {
  id: string;
  createdAt: string;
  modifiedAt: string | null;
  deletedAt: string | null;
  isDeleted: boolean;
}

export interface BaseResponseModel {
  id: string;
  createdAt: string;
  modifiedAt: string | null;
  deletedAt: string | null;
  isDeleted: boolean;
}

export interface ApiErrorResponse {
  Message: string;
  ErrorCode: string;
  Details: string;
  StackTrace: string;
}
