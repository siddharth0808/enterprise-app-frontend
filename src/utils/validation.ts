const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Loose international phone validation: optional leading +, 7-15 digits.
const PHONE_PATTERN = /^\+?[0-9]{7,15}$/;

export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return PHONE_PATTERN.test(value.trim());
}

export function isNonNegativeNumber(value: string): boolean {
  if (value.trim() === '') return false;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0;
}

/**
 * Runs a map of field validators against a values object and returns only
 * the fields that failed, keyed by field name. An empty object means the
 * form is valid.
 */
export function validateFields<T extends object>(
  values: T,
  validators: Partial<{ [K in keyof T]: (value: T[K], values: T) => string | undefined }>
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};

  (Object.keys(validators) as Array<keyof T>).forEach((field) => {
    const validator = validators[field];
    if (!validator) return;
    const message = validator(values[field], values);
    if (message) {
      errors[field] = message;
    }
  });

  return errors;
}
