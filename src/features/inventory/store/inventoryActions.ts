import { createAction } from '@reduxjs/toolkit';

/**
 * Dispatched after a stock transaction is successfully created, so
 * `inventorySlice` (list + detail cache) can update a product's
 * `currentStock` without `transactionSlice` needing to import or reach
 * into `inventorySlice` directly.
 */
export const stockAdjusted = createAction<{ productId: string; newStock: number }>(
  'inventory/stockAdjusted'
);
