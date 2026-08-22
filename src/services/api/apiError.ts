// A single, predictable error shape so UI code never has to guess whether
// it received a raw fetch error, a parsed API error body, or a thrown string.
export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// Generic, user-safe fallback copy. Never surface raw stack traces or
// backend internals to the UI layer.
export const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message || GENERIC_ERROR_MESSAGE;
  }
  if (error instanceof Error) {
    return error.message || GENERIC_ERROR_MESSAGE;
  }
  return GENERIC_ERROR_MESSAGE;
}
