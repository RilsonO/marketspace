import { Product } from '../../entities/Product';
import {
  IProductRepository,
  ProductFilters,
} from '../../domain/interfaces/IProductRepository';
import { IProductWithUser } from '../../domain/interfaces/IProductWithUser';
import {
  fetchProducts,
  fetchUserProducts,
  productCreate,
  productUpdate,
  productDeleteById,
  productToggleDisableById,
} from '../http/repositories/product.repository';
import { ProductMap } from '../mappers/product.map';
import { ProductDTO } from '../../application/dtos/products/product.dtos';
import { PaymentMethodsMap } from '../mappers/payment-methods.map';

export class ProductRepositoryImpl implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    try {
      const data = await fetchProducts({ filter: `?id=${id}` });
      if (data.length > 0) {
        return ProductMap.toProduct(data[0]);
      }
      return null;
    } catch {
      return null;
    }
  }

  async findByUserId(): Promise<Product[]> {
    try {
      const data = await fetchUserProducts();
      return data.map((item: ProductDTO) => ProductMap.toProduct(item));
    } catch (error) {
      return [];
    }
  }

  async findAll(filters?: ProductFilters): Promise<IProductWithUser[]> {
    try {
      let filter = '';
      if (filters) {
        const params = new URLSearchParams();
        if (filters.query) params.append('query', filters.query);
        if (filters.isNew !== undefined)
          params.append('is_new', filters.isNew.toString());
        if (filters.acceptTrade !== undefined)
          params.append('accept_trade', filters.acceptTrade.toString());
        if (filters.paymentMethods)
          params.append(
            'payment_methods',
            JSON.stringify(filters.paymentMethods)
          );
        filter = `?${params.toString()}`;
      }

      const data = await fetchProducts({ filter });

      // Skip Product entity creation and validation for now
      // Just return the raw DTOs as a workaround
      return data.map((item: ProductDTO): IProductWithUser => {
        return {
          id: item.id || '',
          name: item.name || '',
          description: item.description || '',
          price: item.price || 0,
          isNew: item.is_new || false,
          acceptTrade: item.accept_trade || false,
          paymentMethods: item.payment_methods?.map((pm) => pm.key) || [],
          images:
            item.product_images?.map((img) => ({
              id: img.id,
              path: img.path,
            })) || [],
          userId: item.user_id || '',
          isActive: item.is_active !== false,
          userAvatar: item.user?.avatar || '',
        };
      });
    } catch (error) {
      return [];
    }
  }

  async save(product: Product): Promise<void> {
    await productCreate({
      name: product.name,
      description: product.description,
      is_new: product.isNew,
      price: product.price,
      accept_trade: product.acceptTrade,
      payment_methods: PaymentMethodsMap.fromPaymentMethodArrayToStringArray(
        product.paymentMethods
      ),
    });
  }

  async update(product: Product): Promise<void> {
    await productUpdate({
      id: product.id,
      name: product.name,
      description: product.description,
      is_new: product.isNew,
      price: product.price,
      accept_trade: product.acceptTrade,
      payment_methods: PaymentMethodsMap.fromPaymentMethodArrayToStringArray(
        product.paymentMethods
      ),
    });
  }

  async delete(id: string): Promise<void> {
    await productDeleteById({ id });
  }

  async toggleDisable(id: string, isActive: boolean): Promise<void> {
    await productToggleDisableById({ id, is_active: isActive });
  }
}
