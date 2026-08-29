import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/store/authSlice';
import businessReducer from '../../features/business/store/businessSlice';
import inventoryReducer from '../../features/inventory/store/inventorySlice';
import transactionReducer from '../../features/inventory/store/transactionSlice';
import importReducer from '../../features/import/store/importSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    inventory: inventoryReducer,
    transactions: transactionReducer,
    import: importReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
