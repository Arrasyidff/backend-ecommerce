export interface ProductDto {
  id?: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: string;
}

export interface ProductFilterOptions {
  categoryId?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}