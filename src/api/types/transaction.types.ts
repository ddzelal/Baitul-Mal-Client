import { transactionSchema } from "@/schemas/transaction.schema";
import { z } from "zod";

export type CreateTransactionRequestBody = z.infer<typeof transactionSchema>;

export type Transaction = z.infer<typeof transactionSchema>;

/**
 * Transaction status enumeration
 */
export enum TransactionStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

/**
 * Text descriptions for transaction statuses
 */
export const TransactionStatusText: Record<TransactionStatus, string> = {
  [TransactionStatus.Pending]: "Pending",
  [TransactionStatus.Approved]: "Approved",
  [TransactionStatus.Rejected]: "Rejected",
};

/**
 * Interface for transaction model from API
 */
export interface ITransaction {
  id: string;
  status: TransactionStatus;
  invoiceId?: string;
  createdById?: string;
  creatorFullName?: string;
  approvedById?: string;
  approverFullName?: string;
  projectId?: string;
  receivedAmount: number;
  promisedAmount?: number;
  currencyName?: string;
  currencyCode?: string;
  donorFullName?: string;
  donorId?: string;
  createdAt?: string;
  approvedAt?: string;
  dueDate?: string;
}

/**
 * Interface for paginated transaction list
 */
export interface ITransactionList {
  items: ITransaction[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}

/**
 * Parameters for transaction queries
 */
export interface TransactionQueryParams {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
  SortBy?: string;
  SortDirection?: "asc" | "desc";
  Status?: TransactionStatus;
  FromDate?: string;
  ToDate?: string;
  ProjectId?: string;
  DonorId?: string;
}
