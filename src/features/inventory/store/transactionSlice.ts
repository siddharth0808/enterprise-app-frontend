import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { resetApplicationState } from '../../../app/store/actions';
import * as transactionRepository from '../api/transaction.repository';
import { stockAdjusted } from './inventoryActions';
import type { CreateTransactionRequest, TransactionState } from '../types/transaction.types';

const initialState: TransactionState = {
  historyByProductId: {},
  historyStatus: 'idle',
  historyError: null,
  isAdjusting: false,
  adjustError: null,
};

export const fetchTransactionHistory = createAsyncThunk(
  'transactions/fetchHistory',
  async (params:any, { rejectWithValue }) => {
    try {
      const history = await transactionRepository.getTransactionHistory(params.productId);
      return { productId:params.productId, history };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load history');
    }
  }
);

// Creates a stock transaction (Stock In / Out / Damage / Return /
// Adjustment) and, on success, dispatches `stockAdjusted` so the product's
// currentStock updates everywhere it's shown without a separate refetch.
export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (
    {productId, payload }: {productId: string; payload: CreateTransactionRequest },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await transactionRepository.createTransaction(productId, payload);
      dispatch(stockAdjusted({ productId, newStock: response.newStock, newAmount: response.newAmount }));
      return { productId, transaction: response };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to save the adjustment');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearAdjustError(state) {
      state.adjustError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.historyStatus = 'loading';
        state.historyError = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.historyStatus = 'succeeded';
        state.historyByProductId[action.payload.productId] = action.payload.history;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.historyStatus = 'failed';
        state.historyError = (action.payload as string) ?? 'Failed to load history';
      })
      .addCase(createTransaction.pending, (state) => {
        state.isAdjusting = true;
        state.adjustError = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isAdjusting = false;
        const { productId, transaction } = action.payload;
        const existing = state.historyByProductId[productId];
        if (existing) {
          existing.unshift(transaction);
        }
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isAdjusting = false;
        state.adjustError = (action.payload as string) ?? 'Failed to save the adjustment';
      })
      // Sign out: clear cached history so the next user never sees a
      // previous session's transaction records.
      .addCase(resetApplicationState, () => initialState);
  },
});

export const { clearAdjustError } = transactionSlice.actions;
export default transactionSlice.reducer;
