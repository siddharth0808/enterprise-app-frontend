export interface Product {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  brand?: string;
  sellingPrice: number;
  costPrice: number;
  currentStock: number;
  minimumStock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  businessId:string;
  name: string;
  sku?: string;
  category?: string;
  brand?: string;
  sellingPrice: number;
  costPrice: number;
  currentStock: number;
  minimumStock: number;
}

export interface InventoryState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isCreating: boolean;
  createError: string | null;
}
