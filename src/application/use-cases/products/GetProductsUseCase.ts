import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { ProductMap } from '../../../infra/mappers/product.map';
import { IProduct } from '../../../shared/types/interfaces/product.interface';
import { IProductWithUser } from '../../../domain/interfaces/IProductWithUser';

export interface GetProductsRequest {
  filter: string;
}

export interface GetProductsResponse {
  products: IProduct[];
}

export class GetProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(request: GetProductsRequest): Promise<GetProductsResponse> {
    const { filter } = request;

    // Parse the filter string to extract parameters
    const urlParams = new URLSearchParams(filter.replace('?', ''));
    const filters = {
      query: urlParams.get('query') || undefined,
      isNew:
        urlParams.get('is_new') === 'true'
          ? true
          : urlParams.get('is_new') === 'false'
          ? false
          : undefined,
      acceptTrade:
        urlParams.get('accept_trade') === 'true'
          ? true
          : urlParams.get('accept_trade') === 'false'
          ? false
          : undefined,
      paymentMethods: urlParams.get('payment_methods')
        ? JSON.parse(urlParams.get('payment_methods')!)
        : undefined,
    };

    const productEntities = await this.productRepository.findAll(filters);

    // Convert Product entities to IProduct interfaces
    const products = productEntities.map((productEntity: IProductWithUser) => {
      // Convert Product entity to ProductDTO-like object for mapping
      const productDTO = {
        id: productEntity.id,
        name: productEntity.name,
        description: productEntity.description,
        is_new: productEntity.isNew,
        price: productEntity.price,
        accept_trade: productEntity.acceptTrade,
        payment_methods: productEntity.paymentMethods.map((method) => ({
          key: method,
          name: method,
        })),
        product_images: productEntity.images.map((img) => ({
          id: img.id,
          path: img.path,
        })),
        user: { avatar: productEntity.userAvatar }, // Use avatar from repository
        user_id: productEntity.userId,
        is_active: productEntity.isActive,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return ProductMap.toIProduct(productDTO);
    });

    return {
      products,
    };
  }
}
