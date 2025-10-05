import { ProductRepositoryImpl } from './ProductRepositoryImpl';
import { Product, PaymentMethod } from '../../entities/Product';
import { ProductFilters } from '../../domain/interfaces/IProductRepository';
import { ProductDTO } from '../../application/dtos/products/product.dtos';

// Mock das dependências
jest.mock('../http/repositories/product.repository', () => ({
  fetchProducts: jest.fn(),
  fetchUserProducts: jest.fn(),
  productCreate: jest.fn(),
  productUpdate: jest.fn(),
  productDeleteById: jest.fn(),
  productToggleDisableById: jest.fn(),
}));

jest.mock('../mappers/product.map', () => ({
  ProductMap: {
    toProduct: jest.fn(),
  },
}));

jest.mock('../mappers/payment-methods.map', () => ({
  PaymentMethodsMap: {
    fromPaymentMethodArrayToStringArray: jest.fn((methods) =>
      methods.map((m: string) => m.toLowerCase())
    ),
  },
}));

import {
  fetchProducts,
  fetchUserProducts,
  productCreate,
  productUpdate,
  productDeleteById,
  productToggleDisableById,
} from '../http/repositories/product.repository';
import { ProductMap } from '../mappers/product.map';
import { PaymentMethodsMap } from '../mappers/payment-methods.map';

const mockFetchProducts = fetchProducts as jest.MockedFunction<
  typeof fetchProducts
>;
const mockFetchUserProducts = fetchUserProducts as jest.MockedFunction<
  typeof fetchUserProducts
>;
const mockProductCreate = productCreate as jest.MockedFunction<
  typeof productCreate
>;
const mockProductUpdate = productUpdate as jest.MockedFunction<
  typeof productUpdate
>;
const mockProductDeleteById = productDeleteById as jest.MockedFunction<
  typeof productDeleteById
>;
const mockProductToggleDisableById =
  productToggleDisableById as jest.MockedFunction<
    typeof productToggleDisableById
  >;
const mockProductMapToProduct = ProductMap.toProduct as jest.MockedFunction<
  typeof ProductMap.toProduct
>;

describe('ProductRepositoryImpl', () => {
  let repository: ProductRepositoryImpl;

  beforeEach(() => {
    repository = new ProductRepositoryImpl();
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a product when found', async () => {
      const mockProductDTO: ProductDTO = {
        id: 'product-1',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        is_new: true,
        accept_trade: true,
        payment_methods: [{ key: 'pix' }],
        product_images: [],
        user_id: 'user-1',
        is_active: true,
        user: { id: 'user-1', name: 'John', avatar: 'avatar.jpg' },
      };

      const mockProduct = new Product(
        'product-1',
        'Test Product',
        'Test Description',
        100,
        true,
        true,
        [PaymentMethod.PIX],
        [],
        'user-1'
      );

      mockFetchProducts.mockResolvedValue([mockProductDTO]);
      mockProductMapToProduct.mockReturnValue(mockProduct);

      const result = await repository.findById('product-1');

      expect(mockFetchProducts).toHaveBeenCalledWith({
        filter: '?id=product-1',
      });
      expect(mockProductMapToProduct).toHaveBeenCalledWith(mockProductDTO);
      expect(result).toBeTruthy();
      expect(result?.id).toBe('product-1');
    });

    it('should return null when no product found', async () => {
      mockFetchProducts.mockResolvedValue([]);

      const result = await repository.findById('non-existent');

      expect(mockFetchProducts).toHaveBeenCalledWith({
        filter: '?id=non-existent',
      });
      expect(result).toBeNull();
    });

    it('should return null when fetch fails', async () => {
      mockFetchProducts.mockRejectedValue(new Error('Network error'));

      const result = await repository.findById('product-1');

      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return user products when found', async () => {
      const mockProductDTOs: ProductDTO[] = [
        {
          id: 'product-1',
          name: 'Product 1',
          description: 'Description 1',
          price: 100,
          is_new: true,
          accept_trade: true,
          payment_methods: [{ key: 'pix' }],
          product_images: [],
          user_id: 'user-1',
          is_active: true,
          user: { id: 'user-1', name: 'John', avatar: 'avatar.jpg' },
        },
        {
          id: 'product-2',
          name: 'Product 2',
          description: 'Description 2',
          price: 200,
          is_new: false,
          accept_trade: false,
          payment_methods: [{ key: 'boleto' }],
          product_images: [],
          user_id: 'user-1',
          is_active: true,
          user: { id: 'user-1', name: 'John', avatar: 'avatar.jpg' },
        },
      ];

      const mockProduct1 = new Product(
        'product-1',
        'Product 1',
        'Description 1',
        100,
        true,
        true,
        [PaymentMethod.PIX],
        [],
        'user-1'
      );

      const mockProduct2 = new Product(
        'product-2',
        'Product 2',
        'Description 2',
        200,
        false,
        false,
        [PaymentMethod.BOLETO],
        [],
        'user-1'
      );

      mockFetchUserProducts.mockResolvedValue(mockProductDTOs);
      mockProductMapToProduct
        .mockReturnValueOnce(mockProduct1)
        .mockReturnValueOnce(mockProduct2);

      const result = await repository.findByUserId();

      expect(mockFetchUserProducts).toHaveBeenCalled();
      expect(mockProductMapToProduct).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no products found', async () => {
      mockFetchUserProducts.mockResolvedValue([]);

      const result = await repository.findByUserId();

      expect(mockFetchUserProducts).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should return empty array when fetch fails', async () => {
      mockFetchUserProducts.mockRejectedValue(new Error('Network error'));

      const result = await repository.findByUserId();

      expect(result).toEqual([]);
    });
  });

  describe('findAll', () => {
    it('should return all products without filters', async () => {
      const mockProductDTOs: ProductDTO[] = [
        {
          id: 'product-1',
          name: 'Product 1',
          description: 'Description 1',
          price: 100,
          is_new: true,
          accept_trade: true,
          payment_methods: [{ key: 'pix' }],
          product_images: [{ id: 'img-1', path: 'path1.jpg' }],
          user_id: 'user-1',
          is_active: true,
          user: { id: 'user-1', name: 'John', avatar: 'avatar.jpg' },
        },
      ];

      mockFetchProducts.mockResolvedValue(mockProductDTOs);

      const result = await repository.findAll();

      expect(mockFetchProducts).toHaveBeenCalledWith({ filter: '' });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'product-1',
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        isNew: true,
        acceptTrade: true,
        paymentMethods: ['pix'],
        images: [{ id: 'img-1', path: 'path1.jpg' }],
        userId: 'user-1',
        isActive: true,
        userAvatar: 'avatar.jpg',
      });
    });

    it('should apply query filter correctly', async () => {
      const filters: ProductFilters = {
        query: 'test query',
      };

      mockFetchProducts.mockResolvedValue([]);

      await repository.findAll(filters);

      expect(mockFetchProducts).toHaveBeenCalledWith({
        filter: '?query=test+query',
      });
    });

    it('should apply boolean filters correctly', async () => {
      const filters: ProductFilters = {
        isNew: true,
        acceptTrade: false,
      };

      mockFetchProducts.mockResolvedValue([]);

      await repository.findAll(filters);

      expect(mockFetchProducts).toHaveBeenCalledWith({
        filter: '?is_new=true&accept_trade=false',
      });
    });

    it('should apply payment methods filter correctly', async () => {
      const filters: ProductFilters = {
        paymentMethods: ['pix', 'boleto'],
      };

      mockFetchProducts.mockResolvedValue([]);

      await repository.findAll(filters);

      expect(mockFetchProducts).toHaveBeenCalledWith({
        filter: '?payment_methods=%5B%22pix%22%2C%22boleto%22%5D',
      });
    });

    it('should apply multiple filters correctly', async () => {
      const filters: ProductFilters = {
        query: 'test',
        isNew: true,
        acceptTrade: false,
        paymentMethods: ['pix'],
      };

      mockFetchProducts.mockResolvedValue([]);

      await repository.findAll(filters);

      const expectedFilter =
        '?query=test&is_new=true&accept_trade=false&payment_methods=%5B%22pix%22%5D';
      expect(mockFetchProducts).toHaveBeenCalledWith({
        filter: expectedFilter,
      });
    });

    it('should handle empty product data gracefully', async () => {
      const mockProductDTO: ProductDTO = {
        id: '',
        name: '',
        description: '',
        price: 0,
        is_new: false,
        accept_trade: false,
        payment_methods: [],
        product_images: [],
        user_id: '',
        is_active: false,
        user: { id: '', name: '', avatar: '' },
      };

      mockFetchProducts.mockResolvedValue([mockProductDTO]);

      const result = await repository.findAll();

      expect(result[0]).toEqual({
        id: '',
        name: '',
        description: '',
        price: 0,
        isNew: false,
        acceptTrade: false,
        paymentMethods: [],
        images: [],
        userId: '',
        isActive: false,
        userAvatar: '',
      });
    });

    it('should return empty array when fetch fails', async () => {
      mockFetchProducts.mockRejectedValue(new Error('Network error'));

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('save', () => {
    it('should save a product correctly', async () => {
      const product = new Product(
        'product-1',
        'Test Product',
        'Test Description',
        100,
        true,
        true,
        [PaymentMethod.PIX, PaymentMethod.BOLETO],
        [],
        'user-1'
      );

      mockProductCreate.mockResolvedValue(undefined);

      await repository.save(product);

      expect(mockProductCreate).toHaveBeenCalledWith({
        name: 'Test Product',
        description: 'Test Description',
        is_new: true,
        price: 100,
        accept_trade: true,
        payment_methods: ['pix', 'boleto'],
      });
    });
  });

  describe('update', () => {
    it('should update a product correctly', async () => {
      const product = new Product(
        'product-1',
        'Updated Product',
        'Updated Description',
        200,
        false,
        false,
        [PaymentMethod.BOLETO],
        [],
        'user-1'
      );

      mockProductUpdate.mockResolvedValue(undefined);

      await repository.update(product);

      expect(mockProductUpdate).toHaveBeenCalledWith({
        id: 'product-1',
        name: 'Updated Product',
        description: 'Updated Description',
        is_new: false,
        price: 200,
        accept_trade: false,
        payment_methods: ['boleto'],
      });
    });
  });

  describe('delete', () => {
    it('should delete a product correctly', async () => {
      mockProductDeleteById.mockResolvedValue(undefined);

      await repository.delete('product-1');

      expect(mockProductDeleteById).toHaveBeenCalledWith({ id: 'product-1' });
    });
  });

  describe('toggleDisable', () => {
    it('should toggle product status correctly', async () => {
      mockProductToggleDisableById.mockResolvedValue(undefined);

      await repository.toggleDisable('product-1', false);

      expect(mockProductToggleDisableById).toHaveBeenCalledWith({
        id: 'product-1',
        is_active: false,
      });
    });

    it('should enable product correctly', async () => {
      mockProductToggleDisableById.mockResolvedValue(undefined);

      await repository.toggleDisable('product-1', true);

      expect(mockProductToggleDisableById).toHaveBeenCalledWith({
        id: 'product-1',
        is_active: true,
      });
    });
  });
});
