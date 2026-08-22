import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { AuthenticatedRoute } from './AuthenticatedRoute';
import { Loader } from '../../components/common/Loader';

interface BusinessSetupRouteProps {
  children: JSX.Element;
}

/**
 * Wraps routes that require both authentication AND a completed Business
 * Setup (Inventory List, Add Product). Composes AuthenticatedRoute so the
 * unauthenticated case is handled in exactly one place.
 */
export function BusinessSetupRoute({ children }: BusinessSetupRouteProps): JSX.Element {
  const isBusinessChecked = useAppSelector((state) => state.business.isChecked);
  const business = useAppSelector((state) => state.business.business);
  const confirmBusiness =  business.length > 0 ? business[0] : null
  return (
    <AuthenticatedRoute>
      <BusinessGate isChecked={isBusinessChecked} hasBusiness={!!confirmBusiness}>
        {children}
      </BusinessGate>
    </AuthenticatedRoute>
  );
}

function BusinessGate({
  isChecked,
  hasBusiness,
  children,
}: {
  isChecked: boolean;
  hasBusiness: boolean;
  children: JSX.Element;
}): JSX.Element {
  if (!isChecked) {
    // Business status is still being fetched by useAppInitialization.
    return <Loader fullPage label="Loading…" />;
  }

  if (!hasBusiness) {
    return <Navigate to="/business-setup" replace />;
  }

  return children;
}
