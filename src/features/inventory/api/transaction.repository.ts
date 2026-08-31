import { apiRequest } from "../../../services/api/apiClient";
import type {
  CreateTransactionRequest,
  InventoryTransaction,
} from "../types/transaction.types";

export function getTransactionHistory(
  productId: string,
): Promise<InventoryTransaction[]> {
  return apiRequest<InventoryTransaction[]>(
    `/inventory/${productId}/transactions`,
  );
}

export function createTransaction(
  productId: string,
  payload: CreateTransactionRequest,
): Promise<InventoryTransaction> {
  return apiRequest<InventoryTransaction>(
    `/inventory/${productId}/transactions`,
    {
      method: "POST",
      body: payload,
    },
  );
}
