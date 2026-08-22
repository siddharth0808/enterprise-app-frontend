import { env } from '../../config/env';
import { getIdToken } from '../cognito/cognito.service';
import { ApiError, GENERIC_ERROR_MESSAGE } from './apiError';
import type { ApiErrorBody, ApiRequestOptions } from './api.types';

// The single place in the app that calls `fetch`. Repositories call this;
// pages and UI components must never call fetch/axios directly (see spec
// section 12 - API Integration Architecture).
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!options.skipAuth) {
    const token = await getIdToken();
    if (!token) {
      throw new ApiError('Your session has expired. Please sign in again.', 401);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection and try again.');
  }

  if (!response.ok) {
    const errorBody: ApiErrorBody = await response.json().catch(() => ({}));
    throw new ApiError(errorBody.message ?? GENERIC_ERROR_MESSAGE, response.status, errorBody.code);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
