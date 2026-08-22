export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  /** Skip attaching the Cognito bearer token, e.g. for public endpoints. */
  skipAuth?: boolean;
}

export interface ApiErrorBody {
  message?: string;
  code?: string;
}
