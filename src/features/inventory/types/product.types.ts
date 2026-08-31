export interface Product {
  id?: string;
  name: string;
  batchNumber?: string;
  hsn?: number;
  category?: string;
  manufacturer?: string;
  mrp: number;
  rate: number;
  amount?: number;
  discount?:number;
  currentStock: number;
  minimumStock: number;
  expiryDate: any;
  sgst?:number;
  cgst?:number;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface CreateProductRequest {
  businessId:string;
  name: string;
  sku?: string;
  barcode?: string;
  category?: string;
  brand?: string;
  sellingPrice: number;
  costPrice: number;
  currentStock: number;
  minimumStock: number;
}

/** Current Stock is intentionally excluded - it can only change via a stock transaction. */
export type UpdateProductRequest = Partial<Omit<CreateProductRequest, 'currentStock'>>;

export interface InventoryState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isCreating: boolean;
  createError: string | null;
  /** Per-product fetch status, for deep-linking straight into Product Details. */
  productDetailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  productDetailError: string | null;
  isUpdating: boolean;
  updateError: string | null;
}
