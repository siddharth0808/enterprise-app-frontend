import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as CognitoAuth from './CognitoAuth';

interface AuthContextValue {
  isSignedIn: boolean;
  isLoading: boolean;
  ownerId: string | null; // Cognito `sub` claim — the partition key for this owner's data
  signIn: (phoneNumber: string, password: string) => Promise<void>;
  signOut: () => void;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function deriveOwnerId(): Promise<string | null> {
  const token = await CognitoAuth.getIdToken();
  if (!token) return null;
  try {
    return jwtDecode<{ sub: string }>(token).sub;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ownerId, setOwnerId] = useState<string | null>(null);

  // On app launch, check whether a still-valid Cognito session already exists
  // so the user doesn't have to log in again every time they open the app.
  useEffect(() => {
    deriveOwnerId()
      .then((id) => {
        setOwnerId(id);
        setIsSignedIn(!!id);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = useCallback(async (phoneNumber: string, password: string) => {
    await CognitoAuth.signIn(phoneNumber, password);
    setOwnerId(await deriveOwnerId());
    setIsSignedIn(true);
  }, []);

  const signOut = useCallback(() => {
    CognitoAuth.signOut();
    setIsSignedIn(false);
    setOwnerId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isSignedIn, isLoading, ownerId, signIn, signOut, getIdToken: CognitoAuth.getIdToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
