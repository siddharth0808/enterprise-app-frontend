import { apiRequest } from '../../../services/api/apiClient';
import { ApiError } from '../../../services/api/apiError';
import type { Business, CreateBusinessRequest, UpdateBusinessRequest } from '../types/business.types';

/**
 * Returns the authenticated user's business, or null if they have not
 * completed Business Setup yet (backend responds 404 in that case).
 */
export async function getMyBusiness(): Promise<Business[] | []> {
  try {
    return await apiRequest<Business[]>('/business');
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return [];
    }
    throw error;
  }
}

export function createBusiness(payload: CreateBusinessRequest): Promise<Business> {
  return apiRequest<Business>('/business', { method: 'POST', body: payload });
}

export function updateMyBusiness(payload: UpdateBusinessRequest): Promise<Business> {
  return apiRequest<Business>('/business', { method: 'PATCH', body: payload });
}
