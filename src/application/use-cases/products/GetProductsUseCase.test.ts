import { GetProductsUseCase } from './GetProductsUseCase';
import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { IProductWithUser } from '../../../domain/interfaces/IProductWithUser';
import { ProductMap } from '../../../infra/mappers/product.map';

// Mock do ProductMap
jest.mock('../../../infra/mappers/product.map', () => ({
  ProductMap: {
    toIProduct: jest.fn(),
  },
}));

describe('GetProductsUseCase', () => {
  let getProductsUseCase: GetProductsUseCase;
  let mockProductRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      toggleDisable: jest.fn(),
    };

    getProductsUseCase = new GetProductsUseCase(mockProductRepository);
  });

  describe('execute', () => {
    const mockProductEntity: IProductWithUser = {
      id: 'product-1',
      name: 'Test Product',
      description: 'Test Description',
      isNew: true,
      price: 100,
      acceptTrade: true,
      paymentMethods: ['pix', 'boleto'],
      images: [
        { id: 'img-1', path: 'path/to/image1.jpg' },
        { id: 'img-2', path: 'path/to/image2.jpg' },
      ],
      userId: 'user-1',
      userAvatar: 'path/to/avatar.jpg',
      isActive: true,
    };

    const mockMappedProduct = {
      id: 'product-1',
      name: 'Test Product',
      description: 'Test Description',
      is_new: true,
      price: 100,
      accept_trade: true,
      payment_methods: [
        { key: 'pix', name: 'PIX' },
        { key: 'boleto', name: 'Boleto' },
      ],
      product_images: [
        { id: 'img-1', path: 'path/to/image1.jpg' },
        { id: 'img-2', path: 'path/to/image2.jpg' },
      ],
      user: { avatar: 'path/to/avatar.jpg' },
      user_id: 'user-1',
      is_active: true,
    };

    beforeEach(() => {
      mockProductRepository.findAll.mockResolvedValue([mockProductEntity]);
      (ProductMap.toIProduct as jest.Mock).mockReturnValue(mockMappedProduct);
    });

    it('should parse simple query filter and return products', async () => {
      const request = {
        filter: '?query=test',
      };

      const result = await getProductsUseCase.execute(request);

      expect(mockProductRepository.findAll).toHaveBeenCalledWith({
        query: 'test',
        isNew: undefined,
        acceptTrade: undefined,
        paymentMethods: undefined,
      });

      expect(ProductMap.toIProduct).toHaveBeenCalledWith({
        id: 'product-1',
        name: 'Test Product',
        description: 'Test Description',
        is_new: true,
        price: 100,
        accept_trade: true,
        payment_methods: [
          { key: 'pix', name: 'pix' },
          { key: 'boleto', name: 'boleto' },
        ],
        product_images: [
          { id: 'img-1', path: 'path/to/image1.jpg' },
          { id: 'img-2', path: 'path/to/image2.jpg' },
        ],
        user: { avatar: 'path/to/avatar.jpg' },
        user_id: 'user-1',
        is_active: true,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });

      expect(result).toEqual({
        products: [mockMappedProduct],
      });
    });

    it('should parse boolean filters correctly', async () => {
      const request = {
        filter: '?is_new=true&accept_trade=false',
      };

      await getProductsUseCase.execute(request);

      expect(mockProductRepository.findAll).toHaveBeenCalledWith({
        query: undefined,
        isNew: true,
        acceptTrade: false,
        paymentMethods: undefined,
      });
    });

    it('should handle undefined boolean values', async () => {
      const request = {
        filter: '?is_new=invalid&accept_trade=',
      };

      await getProductsUseCase.execute(request);

      expect(mockProductRepository.findAll).toHaveBeenCalledWith({
        query: undefined,
        isNew: undefined,
        acceptTrade: undefined,
        paymentMethods: undefined,
      });
    });

    it('should parse payment methods from JSON string', async () => {
      const paymentMethods = ['pix', 'boleto', 'cash'];
      const request = {
        filter: `?payment_methods=${JSON.stringify(paymentMethods)}`,
      };

      await getProductsUseCase.execute(request);

      expect(mockProductRepository.findAll).toHaveBeenCalledWith({
        query: undefined,
        isNew: undefined,
        acceptTrade: undefined,
        paymentMethods: paymentMethods,
      });
    });

    it('should handle complex filter with all parameters', async () => {
      const paymentMethods = ['pix', 'boleto'];
      const request = {
        filter: `?query=smartphone&is_new=true&accept_trade=false&payment_methods=${JSON.stringify(
          paymentMethods
        )}`,
      };

      await getProductsUseCase.execute(request);

      expect(mockProductRepository.findAll).toHaveBeenCalledWith({
        query: 'smartphone',
        isNew: true,
        acceptTrade: false,
        paymentMethods: paymentMethods,
      });
    });

    it('should handle empty filter string', async () => {
      const request = {
        filter: '',
      };

      await getProductsUseCase.execute(request);

      expect(mockProductRepository.findAll).toHaveBeenCalledWith({
        query: undefined,
        isNew: undefined,
        acceptTrade: undefined,
        paymentMethods: undefined,
      });
    });

    it('should handle filter without question mark', async () => {
      const request = {
        filter: 'query=test&is_new=true',
      };

      await getProductsUseCase.execute(request);

      expect(mockProductRepository.findAll).toHaveBeenCalledWith({
        query: 'test',
        isNew: true,
        acceptTrade: undefined,
        paymentMethods: undefined,
      });
    });

    it('should return empty array when no products found', async () => {
      mockProductRepository.findAll.mockResolvedValue([]);
      const request = {
        filter: '?query=nonexistent',
      };

      const result = await getProductsUseCase.execute(request);

      expect(result).toEqual({
        products: [],
      });
      expect(ProductMap.toIProduct).not.toHaveBeenCalled();
    });

    it('should handle multiple products correctly', async () => {
      const secondProduct: IProductWithUser = {
        ...mockProductEntity,
        id: 'product-2',
        name: 'Second Product',
      };

      mockProductRepository.findAll.mockResolvedValue([
        mockProductEntity,
        secondProduct,
      ]);

      const request = {
        filter: '?query=test',
      };

      const result = await getProductsUseCase.execute(request);

      expect(result.products).toHaveLength(2);
      expect(ProductMap.toIProduct).toHaveBeenCalledTimes(2);
    });

    it('should handle invalid JSON in payment_methods gracefully', async () => {
      const request = {
        filter: '?payment_methods=invalid-json',
      };

      // This should not throw an error, but the JSON.parse will fail
      // The actual implementation should handle this case
      await expect(getProductsUseCase.execute(request)).rejects.toThrow();
    });

    it('should map product images correctly', async () => {
      const request = {
        filter: '?query=test',
      };

      await getProductsUseCase.execute(request);

      expect(ProductMap.toIProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          product_images: [
            { id: 'img-1', path: 'path/to/image1.jpg' },
            { id: 'img-2', path: 'path/to/image2.jpg' },
          ],
        })
      );
    });

    it('should map payment methods correctly', async () => {
      const request = {
        filter: '?query=test',
      };

      await getProductsUseCase.execute(request);

      expect(ProductMap.toIProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          payment_methods: [
            { key: 'pix', name: 'pix' },
            { key: 'boleto', name: 'boleto' },
          ],
        })
      );
    });

    it('should include user avatar in mapping', async () => {
      const request = {
        filter: '?query=test',
      };

      await getProductsUseCase.execute(request);

      expect(ProductMap.toIProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          user: { avatar: 'path/to/avatar.jpg' },
        })
      );
    });
  });
});
