import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { AWS_CONFIG } from '../config/env';

const userPool = new CognitoUserPool({
  UserPoolId: AWS_CONFIG.USER_POOL_ID,
  ClientId: AWS_CONFIG.USER_POOL_CLIENT_ID,
});

export function signUp(params: {
  phoneNumber: string; // must be E.164 format, e.g. +919876543210
  email: string;
  password: string;
  fullName: string;
  role: 'owner' | 'customer';
}): Promise<void> {
  const attributes = [
    new CognitoUserAttribute({ Name: 'phone_number', Value: params.phoneNumber }),
    new CognitoUserAttribute({ Name: 'email', Value: params.email }),
    new CognitoUserAttribute({ Name: 'name', Value: params.fullName }),
    new CognitoUserAttribute({ Name: 'custom:role', Value: params.role }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(params.email, params.password, attributes, [], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// Confirms the sign-up with the code Cognito sends via SMS/email.
export function confirmSignUp(email: string, code: string): Promise<void> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export function signIn(email: string, password: string): Promise<CognitoUserSession> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const authDetails = new AuthenticationDetails({ Username: email, Password: password });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
    });
  });
}

export function signOut(): void {
  userPool.getCurrentUser()?.signOut();
}

// Returns the current, still-valid JWT id token — refreshes silently if expired.
// This is the token attached as `Authorization: Bearer <token>` on every API call.
export function getIdToken(): Promise<string | null> {
  const user = userPool.getCurrentUser();
  if (!user) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session) return resolve(null);
      if (!session.isValid()) return resolve(null);
      resolve(session.getIdToken().getJwtToken());
    });
  });
}
