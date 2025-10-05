import { GetUserProductsUseCase } from './GetUserProductsUseCase';
import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { Product } from '../../../entities/Product';
import { DomainError } from '../../../domain/errors/DomainError';

describe('GetUserProductsUseCase', () => {
  let getUserProductsUseCase: GetUserProductsUseCase;
  let mockProductRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      toggleDisable: jest.fn(),
    };

    getUserProductsUseCase = new GetUserProductsUseCase(mockProductRepository);
  });

  describe('execute', () => {
    const userId = 'user-123';

    const mockProducts = [
      new Product(
        'product-1',
        'Product 1',
        'Description 1',
        true,
        100,
        true,
        ['pix', 'boleto'],
        [{ id: 'img-1', path: 'path1.jpg' }],
        userId,
        true
      ),
      new Product(
        'product-2',
        'Product 2',
        'Description 2',
        false,
        200,
        false,
        ['cash'],
        [{ id: 'img-2', path: 'path2.jpg' }],
        userId,
        true
      ),
      new Product(
        'product-3',
        'Product 3',
        'Description 3',
        true,
        300,
        true,
        ['pix'],
        [{ id: 'img-3', path: 'path3.jpg' }],
        userId,
        false
      ),
    ];

    it('should return user products successfully', async () => {
      mockProductRepository.findByUserId.mockResolvedValue(mockProducts);

      const result = await getUserProductsUseCase.execute(userId);

      expect(mockProductRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when user has no products', async () => {
      mockProductRepository.findByUserId.mockResolvedValue([]);

      const result = await getUserProductsUseCase.execute(userId);

      expect(mockProductRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual([]);
    });

    it('should propagate DomainError when repository throws DomainError', async () => {
      const domainError = new DomainError('Product not found');
      mockProductRepository.findByUserId.mockRejectedValue(domainError);

      await expect(getUserProductsUseCase.execute(userId)).rejects.toThrow(
        domainError
      );
      expect(mockProductRepository.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('should throw generic error when repository throws non-DomainError', async () => {
      const genericError = new Error('Database connection failed');
      mockProductRepository.findByUserId.mockRejectedValue(genericError);

      await expect(getUserProductsUseCase.execute(userId)).rejects.toThrow(
        'Failed to fetch user products'
      );
      expect(mockProductRepository.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('should handle different user IDs correctly', async () => {
      const differentUserId = 'user-456';
      mockProductRepository.findByUserId.mockResolvedValue([mockProducts[0]]);

      const result = await getUserProductsUseCase.execute(differentUserId);

      expect(mockProductRepository.findByUserId).toHaveBeenCalledWith(
        differentUserId
      );
      expect(result).toEqual([mockProducts[0]]);
    });

    it('should handle repository returning null/undefined', async () => {
      mockProductRepository.findByUserId.mockResolvedValue(null as any);

      const result = await getUserProductsUseCase.execute(userId);

      expect(result).toBeNull();
    });
  });

  describe('getActiveProductsCount', () => {
    const userId = 'user-123';

    const mockProducts = [
      new Product(
        'product-1',
        'Active Product 1',
        'Description 1',
        true,
        100,
        true,
        ['pix'],
        [{ id: 'img-1', path: 'path1.jpg' }],
        userId,
        true // isActive = true
      ),
      new Product(
        'product-2',
        'Active Product 2',
        'Description 2',
        false,
        200,
        false,
        ['boleto'],
        [{ id: 'img-2', path: 'path2.jpg' }],
        userId,
        true // isActive = true
      ),
      new Product(
        'product-3',
        'Inactive Product',
        'Description 3',
        true,
        300,
        true,
        ['cash'],
        [{ id: 'img-3', path: 'path3.jpg' }],
        userId,
        false // isActive = false
      ),
      new Product(
        'product-4',
        'Another Inactive Product',
        'Description 4',
        false,
        400,
        false,
        ['pix'],
        [{ id: 'img-4', path: 'path4.jpg' }],
        userId,
        false // isActive = false
      ),
    ];

    it('should return correct count of active products', async () => {
      mockProductRepository.findByUserId.mockResolvedValue(mockProducts);

      const result = await getUserProductsUseCase.getActiveProductsCount(
        userId
      );

      expect(mockProductRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toBe(2); // Only 2 products have isActive = true
    });

    it('should return 0 when user has no active products', async () => {
      const inactiveProducts = mockProducts.map(
        (product) =>
          new Product(
            product.id,
            product.name,
            product.description,
            product.isNew,
            product.price,
            product.acceptTrade,
            product.paymentMethods,
            product.images,
            product.userId,
            false // All inactive
          )
      );

      mockProductRepository.findByUserId.mockResolvedValue(inactiveProducts);

      const result = await getUserProductsUseCase.getActiveProductsCount(
        userId
      );

      expect(result).toBe(0);
    });

    it('should return 0 when user has no products', async () => {
      mockProductRepository.findByUserId.mockResolvedValue([]);

      const result = await getUserProductsUseCase.getActiveProductsCount(
        userId
      );

      expect(result).toBe(0);
    });

    it('should return total count when all products are active', async () => {
      const activeProducts = mockProducts.map(
        (product) =>
          new Product(
            product.id,
            product.name,
            product.description,
            product.isNew,
            product.price,
            product.acceptTrade,
            product.paymentMethods,
            product.images,
            product.userId,
            true // All active
          )
      );

      mockProductRepository.findByUserId.mockResolvedValue(activeProducts);

      const result = await getUserProductsUseCase.getActiveProductsCount(
        userId
      );

      expect(result).toBe(4); // All 4 products are active
    });

    it('should propagate DomainError from execute method', async () => {
      const domainError = new DomainError('User not found');
      mockProductRepository.findByUserId.mockRejectedValue(domainError);

      await expect(
        getUserProductsUseCase.getActiveProductsCount(userId)
      ).rejects.toThrow(domainError);
    });

    it('should throw generic error from execute method', async () => {
      const genericError = new Error('Database error');
      mockProductRepository.findByUserId.mockRejectedValue(genericError);

      await expect(
        getUserProductsUseCase.getActiveProductsCount(userId)
      ).rejects.toThrow('Failed to fetch user products');
    });

    it('should handle mixed active/inactive products correctly', async () => {
      const mixedProducts = [
        new Product(
          '1',
          'Product 1',
          'Desc 1',
          true,
          100,
          true,
          ['pix'],
          [],
          userId,
          true
        ),
        new Product(
          '2',
          'Product 2',
          'Desc 2',
          false,
          200,
          false,
          ['boleto'],
          [],
          userId,
          false
        ),
        new Product(
          '3',
          'Product 3',
          'Desc 3',
          true,
          300,
          true,
          ['cash'],
          [],
          userId,
          true
        ),
        new Product(
          '4',
          'Product 4',
          'Desc 4',
          false,
          400,
          false,
          ['pix'],
          [],
          userId,
          false
        ),
        new Product(
          '5',
          'Product 5',
          'Desc 5',
          true,
          500,
          true,
          ['boleto'],
          [],
          userId,
          true
        ),
      ];

      mockProductRepository.findByUserId.mockResolvedValue(mixedProducts);

      const result = await getUserProductsUseCase.getActiveProductsCount(
        userId
      );

      expect(result).toBe(3); // Products 1, 3, and 5 are active
    });
  });
});
