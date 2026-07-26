export type OrderStatus = 'PLACED' | 'PREPARING' | 'SHIPPED';

export interface Product {
  ownerId: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImgUri: string;
  productDescription: string;
}

export interface OrderLine {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  ownerId: string;
  orderId: string;
  customerPhone: string;
  customerName: string;
  total: number;
  payMode: string;
  status: OrderStatus;
  products: OrderLine[];
  createdAt: string;
}
