import { CategoryType } from '../models/category';

export interface CategoryDto {
  id: string;
  name: string;
  icon: string;
  colorCode: string;
  description?: string | null;
  type: CategoryType;
  isDefault: boolean;
  updatedAt: Date;
}

export interface CategoryCreateDto {
  name: string;
  icon: string;
  colorCode: string;
  description?: string | null;
  type: CategoryType;
}

export interface CategoryUpdateDto {
  name: string;
  icon: string;
  colorCode: string;
  description?: string | null;
  type: CategoryType;
}