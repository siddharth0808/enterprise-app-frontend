import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { Loader } from '../../components/common/Loader';

interface PublicRouteProps {
  children: JSX.Element;
}

/**
 * Wraps public-only pages (Login, Signup, Email Verification). If an
 * authenticated user lands here, send them onward based on whether they've
 * completed Business Setup instead of showing the auth form again.
 */
export function PublicRoute({ children }: PublicRouteProps): JSX.Element {
  const authStatus = useAppSelector((state) => state.auth.status);
  const business = useAppSelector((state) => state.business.business);
  const isBusinessChecked = useAppSelector((state) => state.business.isChecked);

  if (authStatus === 'authenticated') {
    if (!isBusinessChecked) {
      return <Loader fullPage label="Loading…" />;
    }
    return <Navigate to={business ? '/inventory' : '/business-setup'} replace />;
  }

  return children;
}
