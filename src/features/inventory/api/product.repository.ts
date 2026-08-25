import { apiRequest } from '../../../services/api/apiClient';
import type { CreateProductRequest, Product, UpdateProductRequest } from '../types/product.types';

export function getProducts(businessId:string): Promise<Product[]> {
  return apiRequest<Product[]>(`/products/${businessId}`);
}

export function createProduct(payload: CreateProductRequest): Promise<Product> {
  return apiRequest<Product>('/products', { method: 'POST', body: payload });
}

export function getProductById(productId: string): Promise<Product> {
  return apiRequest<Product>(`/products/${productId}`);
}

export function updateProduct(productId: string, payload: UpdateProductRequest): Promise<Product> {
  return apiRequest<Product>(`/products/${productId}`, { method: 'PATCH', body: payload });
}