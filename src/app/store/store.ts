import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/store/authSlice';
import businessReducer from '../../features/business/store/businessSlice';
import inventoryReducer from '../../features/inventory/store/inventorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    inventory: inventoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
