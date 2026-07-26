import { getIdToken } from '../auth/CognitoAuth';
import { AWS_CONFIG } from '../config/env';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
}

// Every call to the API Gateway routes goes through here, so the JWT authorizer
// on the API side always has a token to validate.
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = await getIdToken();
  if (!token) throw new Error('Not signed in');

  const response = await fetch(`${AWS_CONFIG.API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message ?? `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
