import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { resetApplicationState } from '../../../app/store/actions';
import * as businessRepository from '../api/business.repository';
import type { BusinessState, CreateBusinessRequest, UpdateBusinessRequest } from '../types/business.types';

const initialState: BusinessState = {
  business: [],
  status: 'idle',
  isSubmitting: false,
  error: null,
  isChecked: false,
};

export const fetchMyBusiness = createAsyncThunk(
  'business/fetchMine',
  async (_: void, { rejectWithValue }) => {
    try {
      return await businessRepository.getMyBusiness();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load business');
    }
  }
);

export const createBusiness = createAsyncThunk(
  'business/create',
  async (payload: CreateBusinessRequest, { rejectWithValue }) => {
    try {
      return await businessRepository.createBusiness(payload);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create business');
    }
  }
);

export const updateBusiness = createAsyncThunk(
  'business/update',
  async (payload: UpdateBusinessRequest, { rejectWithValue }) => {
    try {
      return await businessRepository.updateMyBusiness(payload);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update business');
    }
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearBusinessError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBusiness.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyBusiness.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.business = action.payload;
        state.isChecked = true;
      })
      .addCase(fetchMyBusiness.rejected, (state, action) => {
        state.status = 'failed';
        state.isChecked = true;
        state.error = (action.payload as string) ?? 'Failed to load business';
      })
      .addCase(createBusiness.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action:any) => {
        state.isSubmitting = false;
        state.business = action.payload ?  [action.payload] :  [];
        state.isChecked = true;
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) ?? 'Failed to create business';
      })
      .addCase(updateBusiness.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action:any) => {
        state.isSubmitting = false;
        state.business = action.payload ?  [action.payload] :  [];
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) ?? 'Failed to update business';
      })
      // Sign out: clear business data completely so the next user never
      // sees a previous session's business.
      .addCase(resetApplicationState, () => initialState);
  },
});

export const { clearBusinessError } = businessSlice.actions;
export default businessSlice.reducer;
