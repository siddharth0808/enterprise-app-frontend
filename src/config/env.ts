// Centralized, validated access to build-time configuration.
// Nothing in this file may contain a literal URL, pool id, or secret —
// everything must come from import.meta.env (populated from .env* files).

interface AppConfig {
  apiBaseUrl: string;
  awsRegion: string;
  cognitoUserPoolId: string;
  cognitoUserPoolClientId: string;
}

function readEnvVar(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    // Fail loudly at startup rather than producing confusing runtime errors
    // deep inside the Cognito SDK or API client later on.
    throw new Error(
      `Missing required environment variable "${key}". Check your .env file against .env.example.`
    );
  }
  return value;
}

function loadConfig(): AppConfig {
  return {
    apiBaseUrl: readEnvVar('VITE_API_BASE_URL'),
    awsRegion: readEnvVar('VITE_AWS_REGION'),
    cognitoUserPoolId: readEnvVar('VITE_COGNITO_USER_POOL_ID'),
    cognitoUserPoolClientId: readEnvVar('VITE_COGNITO_USER_POOL_CLIENT_ID'),
  };
}

export const env: AppConfig = loadConfig();
