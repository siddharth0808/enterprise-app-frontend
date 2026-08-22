export const AUTH_ROUTES = {
  login: '/login',
  signup: '/signup',
  verifyEmail: '/verify-email',
} as const;

export const AUTH_ERROR_MESSAGES = {
  genericLoginFailure: 'Invalid email or password. Please try again.',
  genericSignupFailure: 'We could not create your account. Please try again.',
  genericVerificationFailure: 'That code is invalid or has expired. Please try again.',
  sessionExpired: 'Your session has expired. Please sign in again.',
} as const;
