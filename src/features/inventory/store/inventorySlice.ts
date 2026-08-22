import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { resetApplicationState } from '../../../app/store/actions';
import * as productRepository from '../api/product.repository';
import type { CreateProductRequest, InventoryState } from '../types/product.types';

const initialState: InventoryState = {
  products: [],
  status: 'idle',
  error: null,
  isCreating: false,
  createError: null,
};

export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async (businessId:string, { rejectWithValue }) => {
    try {
      return await productRepository.getProducts(businessId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load products');
    }
  }
);

export const createProduct = createAsyncThunk(
  'inventory/createProduct',
  async (payload: CreateProductRequest, { rejectWithValue }) => {
    try {
      return await productRepository.createProduct(payload);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add product');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearCreateError(state) {
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load products';
      })
      .addCase(createProduct.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isCreating = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = (action.payload as string) ?? 'Failed to add product';
      })
      // Sign out: clear the product list so the next user never sees a
      // previous session's inventory.
      .addCase(resetApplicationState, () => initialState);
  },
});

export const { clearCreateError } = inventorySlice.actions;
export default inventorySlice.reducer;
