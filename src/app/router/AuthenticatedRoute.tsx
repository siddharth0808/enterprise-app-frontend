import type { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { Loader } from '../../components/common/Loader';

interface AuthenticatedRouteProps {
  children: JSX.Element;
}

/** Wraps any route that requires a signed-in user (Business Setup, Profile, Inventory, Add Product). */
export function AuthenticatedRoute({ children }: AuthenticatedRouteProps): JSX.Element {
  const authStatus = useAppSelector((state) => state.auth.status);
  const location = useLocation();

  if (authStatus === 'initializing') {
    return <Loader fullPage label="Loading…" />;
  }

  if (authStatus === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
