import { Product } from '../../entities/Product';
import { IProductWithUser } from './IProductWithUser';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findByUserId(userId: string): Promise<Product[]>;
  findAll(filters?: ProductFilters): Promise<IProductWithUser[]>;
  save(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
  toggleDisable(id: string, isActive: boolean): Promise<void>;
}

export interface ProductFilters {
  query?: string;
  isNew?: boolean;
  acceptTrade?: boolean;
  paymentMethods?: string[];
}
