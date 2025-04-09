export interface CartDto {
  id?: string;
  userId: string;
  productId: string;
  quantity: number;
}

export interface CartProductInfo {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItemResponse {
  id: string;
  product: CartProductInfo
  quantity: number;
  subtotal: number;
}