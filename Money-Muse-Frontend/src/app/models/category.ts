export enum CategoryType {
  Income = 0,
  Expense = 1,
  Both = 2
}

export interface Category {
  id: string;
  userId?: number | null;
  name: string;
  icon: string;
  colorCode: string;
  description?: string | null;
  type: CategoryType;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}