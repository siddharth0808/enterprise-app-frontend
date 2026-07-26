import { apiRequest } from './client';
import { Product, Order, OrderLine, OrderStatus } from '../types';
import { AWS_CONFIG } from '../config/env';

export function registerOwner(params: {
  businessName: string;
  ownerName: string;
  email: string;
  businessAddress: string;
  ownerMobile: string;
}) {
  return apiRequest<{ ownerId: string }>('/register', { method: 'POST', body: params });
}

export function addProduct(params: {
  productName: string;
  productPrice: number;
  productImgUri?: string;
  productDescription?: string;
}) {
  return apiRequest<Product>('/products', { method: 'POST', body: params });
}

export function listProducts(ownerId: string) {
  return apiRequest<Product[]>(`/products/${ownerId}`);
}

export function placeOrder(params: {
  ownerId: string;
  customerName: string;
  payMode: string;
  products: OrderLine[];
}) {
  return apiRequest<Order>('/orders', { method: 'POST', body: params });
}

export function listOrders(ownerId: string) {
  return apiRequest<Order[]>(`/orders/${ownerId}`);
}

export function updateOrderStatus(ownerId: string, orderId: string, status: OrderStatus) {
  return apiRequest<{ status: OrderStatus }>(`/orders/${ownerId}/${orderId}/status`, {
    method: 'PATCH',
    body: { status },
  });
}

export function presignImageUpload(contentType: string) {
  return apiRequest<{ key: string; uploadUrl: string; viewUrl: string }>('/images/presign', {
    method: 'POST',
    body: { contentType },
  });
}

export function productImageUrl(productImgUri: string): string {
  return `https://${AWS_CONFIG.IMAGE_CDN_URL}/${productImgUri}`;
}
