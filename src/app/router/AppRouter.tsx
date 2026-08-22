import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { AuthenticatedRoute } from './AuthenticatedRoute';
import { BusinessSetupRoute } from './BusinessSetupRoute';
import { AppLayout } from '../../components/layout/AppLayout';
import LoginPage from '../../features/auth/pages/LoginPage';
import SignupPage from '../../features/auth/pages/SignupPage';
import EmailVerificationPage from '../../features/auth/pages/EmailVerificationPage';
import BusinessSetupPage from '../../features/business/pages/BusinessSetupPage';
import InventoryListPage from '../../features/inventory/pages/InventoryListPage';
import AddProductPage from '../../features/inventory/pages/AddProductPage';
import ProfilePage from '../../features/profile/pages/ProfilePage';
import { useAppSelector } from '../store/hooks';

/** Sends "/" to the right authenticated destination once we know it. */
function RootRedirect() {
  const business = useAppSelector((state) => state.business.business);
  return <Navigate to={business ? '/inventory' : '/business-setup'} replace />;
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public-only routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-email"
        element={
          <PublicRoute>
            <EmailVerificationPage />
          </PublicRoute>
        }
      />

      {/* Authenticated, business-setup-not-required */}
      <Route
        path="/business-setup"
        element={
          <AuthenticatedRoute>
            <BusinessSetupPage />
          </AuthenticatedRoute>
        }
      />

      {/* Authenticated + business-setup-required, inside the app shell */}
      <Route
        path="/inventory"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <InventoryListPage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />
      <Route
        path="/products/new"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <AddProductPage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />

      <Route
        path="/"
        element={
          <AuthenticatedRoute>
            <RootRedirect />
          </AuthenticatedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
