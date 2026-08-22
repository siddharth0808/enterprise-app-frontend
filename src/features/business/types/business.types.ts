export const BUSINESS_TYPE_OPTIONS = [
  'Grocery',
  'Medical',
  'Electronics',
  'Clothing',
  'Hardware',
  'Restaurant',
  'Other',
] as const;

export type BusinessType = (typeof BUSINESS_TYPE_OPTIONS)[number];

export interface Business {
  id: string;
  ownerId:string;
  businessName: string;
  businessType: string;
  mobile?: string;
  email?: string;
  businessAddress?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBusinessRequest {
  ownerName:string;
  name: string;
  businessType: string;
  phone?: string;
  email?: string;
  address?: string;
}

export type UpdateBusinessRequest = Partial<CreateBusinessRequest>;

export interface BusinessState {
  business: Business[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isSubmitting: boolean;
  error: string | null;
  /**
   * Business Setup is "checked" only after we've asked the API at least
   * once. Prevents the router from redirecting based on stale/absent data.
   */
  isChecked: boolean;
}
