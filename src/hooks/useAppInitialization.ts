import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { initializeAuth } from '../features/auth/store/authSlice';
import { fetchMyBusiness } from '../features/business/store/businessSlice';

/**
 * Runs once at app startup:
 * 1. Restores an existing Cognito session (or confirms there isn't one).
 * 2. If authenticated, checks whether Business Setup has been completed.
 *
 * The router reads `auth.status` / `business.isChecked` to decide where to
 * send the user, rather than duplicating this sequencing in every guard.
 */
export function useAppInitialization(): void {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.auth.status);
  const isBusinessChecked = useAppSelector((state) => state.business.isChecked);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (authStatus === 'authenticated' && !isBusinessChecked) {
      dispatch(fetchMyBusiness());
    }
  }, [authStatus, isBusinessChecked, dispatch]);
}
