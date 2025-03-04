import axios from "axios";
import {
  CreateTransactionRequestBody,
  ITransaction,
} from "@/api/types/transaction.types";
import { QueryParams } from "../types/global.types";
import { PaginatedResponse } from "../types/global.types";

async function create(data: CreateTransactionRequestBody) {
  const response = await axios.post("/transactions", data);
  return response.data;
}

async function getAll(
  params?: QueryParams<ITransaction>
): Promise<PaginatedResponse<ITransaction>> {
  const res = await axios.get("/transactions", { params });
  return res.data;
}

export const TransactionRequests = {
  create,
  getAll,
};
