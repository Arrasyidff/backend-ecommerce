import { Types } from 'mongoose';

export interface IProduct {
  name: string;
  price: number;
  description: string;
  images: string[];
  categoryId: Types.ObjectId | string;
  stock: number;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductResponse extends IProduct {
  _id: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
}

export interface IProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}