import { Product } from '../../../entities/Product';
import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { DomainError } from '../../../domain/errors/DomainError';

export class GetUserProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(userId: string): Promise<Product[]> {
    try {
      return await this.productRepository.findByUserId(userId);
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw new Error('Failed to fetch user products');
    }
  }

  async getActiveProductsCount(userId: string): Promise<number> {
    const products = await this.execute(userId);
    return products.filter((product) => product.isActive).length;
  }
}
