export const TRANSACTION_TYPE_OPTIONS = [
  { value: 'STOCK_IN', label: 'Stock In', sign: 1 },
  { value: 'STOCK_OUT', label: 'Stock Out', sign: -1 },
  { value: 'DAMAGE', label: 'Damage', sign: -1 },
  { value: 'RETURN', label: 'Return', sign: 1 },
  { value: 'ADJUSTMENT', label: 'Adjustment', sign: 1 },
] as const;

export type TransactionType = (typeof TRANSACTION_TYPE_OPTIONS)[number]['value'];

export function getTransactionSign(type: TransactionType): 1 | -1 {
  const match = TRANSACTION_TYPE_OPTIONS.find((option) => option.value === type);
  return (match?.sign ?? 1) as 1 | -1;
}

export function getTransactionLabel(type: TransactionType): string {
  return TRANSACTION_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}

export function getTransactionTone(type: TransactionType): 'success' | 'neutral' | 'danger' {
  switch (type) {
    case 'STOCK_IN':
    case 'RETURN':
      return 'success';
    case 'DAMAGE':
      return 'danger';
    default:
      return 'neutral';
  }
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  type: TransactionType;
  /** Signed - positive for additions (Stock In/Return), negative for reductions (Stock Out/Damage). */
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  createdBy?: string;
  createdAt: string;
}

export interface CreateTransactionRequest {
  type: TransactionType;
  /** Always a positive magnitude - the sign is derived from `type` server-side and in the preview. */
  quantity: number;
  reason?: string;
}

/** Response from creating a transaction: the new ledger entry plus the product's updated stock. */
export interface CreateTransactionResponse {
  transaction: InventoryTransaction;
  product: {
    id: string;
    currentStock: number;
  };
}

export interface TransactionState {
  /** Transaction history, keyed by productId, so switching products doesn't refetch unnecessarily. */
  historyByProductId: Record<string, InventoryTransaction[]>;
  historyStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  historyError: string | null;
  isAdjusting: boolean;
  adjustError: string | null;
}
