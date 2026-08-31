import { apiRequest } from "../../../services/api/apiClient";
import type {
  CreateTransactionRequest,
  CreateTransactionResponse,
  InventoryTransaction,
} from "../types/transaction.types";

export function getTransactionHistory(
  businessId:string,
  productId: string,
): Promise<InventoryTransaction[]> {
  return apiRequest<InventoryTransaction[]>(
    `/inventory/${businessId}/${productId}/transactions`,
  );
}

export function createTransaction(
  businessId:string,
  productId: string,
  payload: CreateTransactionRequest,
): Promise<InventoryTransaction> {
  return apiRequest<InventoryTransaction>(
    `/inventory/${businessId}/${productId}/transactions`,
    {
      method: "POST",
      body: payload,
    },
  );
}
