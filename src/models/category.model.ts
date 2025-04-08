import mongoose, { Document, Schema } from 'mongoose';
import { ICategory } from '../types/category.interface';

export interface ICategoryDocument extends ICategory, Document {
  _id: mongoose.Types.ObjectId;
}

const categorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug from name if slug is not provided
categorySchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = (this.name as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export const Category = mongoose.model<ICategoryDocument>('Category', categorySchema);