export interface OrderDto {
  id?: string;
  userId: string;
  total: number;
  status?: string;
}

export interface OrderItemDto {
  productId: string;
  quantity: number;
  price: number;
}

export interface CheckoutDto {
  shippingAddress?: string;
  paymentMethod?: string;
}

export interface OrderItemInfo {
  id: string;
  product: {
    id: string;
    name: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  id: string;
  total: number;
  status: string;
  items: OrderItemInfo[];
  createdAt: Date;
}

export interface OrderItemModel {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
  };
}

export interface OrderWithItems {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  items: OrderItemModel[];
}