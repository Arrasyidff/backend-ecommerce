export interface ICategory {
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryResponse extends ICategory {
  _id: string;
}