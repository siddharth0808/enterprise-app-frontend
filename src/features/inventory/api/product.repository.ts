import { apiRequest } from '../../../services/api/apiClient';
import type { CreateProductRequest, Product } from '../types/product.types';

export function getProducts(businessId:string): Promise<Product[]> {
  return apiRequest<Product[]>(`/products/${businessId}`);
}

export function createProduct(payload: CreateProductRequest): Promise<Product> {
  return apiRequest<Product>('/products', { method: 'POST', body: payload });
}
