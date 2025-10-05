import { ProductMap } from './product.map';
import {
  ProductDTO,
  UserProductResponseDTO,
} from '../../application/dtos/products/product.dtos';
import { PaymentMethod } from '../../entities/Product';
import { Product } from '../../entities/Product';

// Mock das dependências
jest.mock('react-native-uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-123'),
}));

jest.mock('./photo.map', () => ({
  PhotoMap: {
    toIPhoto: jest.fn((dto) => ({
      name: dto.id,
      uri: `https://api.example.com/images/${dto.path}`,
      type: 'image',
    })),
  },
}));

jest.mock('./payment-methods.map', () => ({
  PaymentMethodsMap: {
    fromPaymentMethodsDTOArrayToPaymentMethodArray: jest.fn((dtos) =>
      dtos.map((dto: any) => dto.key)
    ),
  },
}));

describe('ProductMap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toIProduct', () => {
    it('should convert ProductDTO to IProduct with all fields', () => {
      const productDTO: ProductDTO = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        is_new: true,
        accept_trade: true,
        payment_methods: [
          { key: 'pix', name: 'Pix' },
          { key: 'boleto', name: 'Boleto' },
        ],
        product_images: [
          { id: 'img1', path: 'image1.jpg' },
          { id: 'img2', path: 'image2.jpg' },
        ],
        user_id: 'user-123',
        is_active: true,
        user: {
          id: 'user-123',
          name: 'John Doe',
          avatar: 'avatar.jpg',
        },
      };

      const result = ProductMap.toIProduct(productDTO);

      expect(result).toEqual({
        id: 'product-123',
        user_id: 'user-123',
        name: 'Test Product',
        description: 'Test Description',
        is_new: true,
        is_active: true,
        price: 100,
        accept_trade: true,
        payment_methods: ['pix', 'boleto'],
        product_images: [
          {
            name: 'img1',
            uri: 'https://api.example.com/images/image1.jpg',
            type: 'image',
          },
          {
            name: 'img2',
            uri: 'https://api.example.com/images/image2.jpg',
            type: 'image',
          },
        ],
        user: {
          id: 'user-123',
          name: 'John Doe',
          avatar: 'avatar.jpg',
        },
      });
    });

    it('should handle undefined/null fields with fallback UUIDs', () => {
      const productDTO: ProductDTO = {
        id: undefined,
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        is_new: true,
        accept_trade: true,
        payment_methods: [],
        product_images: [],
        user_id: undefined,
        is_active: true,
        user: undefined,
      };

      const result = ProductMap.toIProduct(productDTO);

      expect(result.id).toBe('mocked-uuid-123');
      expect(result.user_id).toBe('mocked-uuid-123');
      expect(result.name).toBe('Test Product');
      expect(result.description).toBe('Test Description');
      expect(result.user).toBeUndefined();
    });

    it('should handle empty arrays', () => {
      const productDTO: ProductDTO = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        is_new: false,
        accept_trade: false,
        payment_methods: [],
        product_images: [],
        user_id: 'user-123',
        is_active: false,
        user: undefined,
      };

      const result = ProductMap.toIProduct(productDTO);

      expect(result.payment_methods).toEqual([]);
      expect(result.product_images).toEqual([]);
    });

    it('should handle null user', () => {
      const productDTO: ProductDTO = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        is_new: true,
        accept_trade: true,
        payment_methods: [{ key: 'pix', name: 'Pix' }],
        product_images: [],
        user_id: 'user-123',
        is_active: true,
        user: null,
      };

      const result = ProductMap.toIProduct(productDTO);

      expect(result.user).toBeNull();
    });
  });

  describe('toIUserProduct', () => {
    it('should convert UserProductResponseDTO to IUserProduct', () => {
      const userProductDTO: UserProductResponseDTO = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 200,
        is_new: false,
        accept_trade: true,
        payment_methods: [{ key: 'card', name: 'Cartão de Crédito' }],
        product_images: [{ id: 'img1', path: 'image1.jpg' }],
        user_id: 'user-456',
        is_active: true,
      };

      const result = ProductMap.toIUserProduct(userProductDTO);

      expect(result).toEqual({
        id: 'product-123',
        user_id: 'user-456',
        name: 'Test Product',
        description: 'Test Description',
        is_new: false,
        is_active: true,
        price: 200,
        accept_trade: true,
        payment_methods: ['card'],
        product_images: [
          {
            name: 'img1',
            uri: 'https://api.example.com/images/image1.jpg',
            type: 'image',
          },
        ],
      });
    });

    it('should handle empty arrays in UserProductResponseDTO', () => {
      const userProductDTO: UserProductResponseDTO = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 0,
        is_new: false,
        accept_trade: false,
        payment_methods: [],
        product_images: [],
        user_id: 'user-123',
        is_active: false,
      };

      const result = ProductMap.toIUserProduct(userProductDTO);

      expect(result.payment_methods).toEqual([]);
      expect(result.product_images).toEqual([]);
      expect(result.price).toBe(0);
    });
  });

  describe('toProduct', () => {
    it('should convert ProductDTO to Product entity with all fields', () => {
      const productDTO: ProductDTO = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 150,
        is_new: true,
        accept_trade: true,
        payment_methods: [
          { key: 'pix', name: 'Pix' },
          { key: 'boleto', name: 'Boleto' },
        ],
        product_images: [
          { id: 'img1', path: 'image1.jpg' },
          { id: 'img2', path: 'image2.jpg' },
        ],
        user_id: 'user-123',
        is_active: true,
        user: undefined,
      };

      const result = ProductMap.toProduct(productDTO);

      expect(result).toBeInstanceOf(Product);
      expect(result.id).toBe('product-123');
      expect(result.name).toBe('Test Product');
      expect(result.description).toBe('Test Description');
      expect(result.price).toBe(150);
      expect(result.isNew).toBe(true);
      expect(result.acceptTrade).toBe(true);
      expect(result.paymentMethods).toEqual(['pix', 'boleto']);
      expect(result.images).toEqual([
        { id: 'img1', path: 'image1.jpg' },
        { id: 'img2', path: 'image2.jpg' },
      ]);
      expect(result.userId).toBe('user-123');
      expect(result.isActive).toBe(true);
    });

    it('should handle undefined/null fields with fallbacks', () => {
      const productDTO: ProductDTO = {
        id: undefined,
        name: undefined,
        description: undefined,
        price: undefined,
        is_new: undefined,
        accept_trade: undefined,
        payment_methods: undefined,
        product_images: undefined,
        user_id: undefined,
        is_active: undefined,
        user: undefined,
      };

      expect(() => ProductMap.toProduct(productDTO)).toThrow(
        'Product ID is required'
      );
    });

    it('should handle empty arrays in ProductDTO', () => {
      const productDTO: ProductDTO = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        is_new: false,
        accept_trade: false,
        payment_methods: [],
        product_images: [],
        user_id: 'user-123',
        is_active: false,
        user: undefined,
      };

      const result = ProductMap.toProduct(productDTO);

      expect(result.paymentMethods).toEqual([]);
      expect(result.images).toEqual([]);
      expect(result.isNew).toBe(false);
      expect(result.acceptTrade).toBe(false);
    });

    it('should handle null product_images', () => {
      const productDTO: ProductDTO = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        is_new: true,
        accept_trade: true,
        payment_methods: [{ key: 'pix', name: 'Pix' }],
        product_images: null,
        user_id: 'user-123',
        is_active: true,
        user: undefined,
      };

      const result = ProductMap.toProduct(productDTO);

      expect(result.images).toEqual([]);
    });

    it('should call PaymentMethodsMap correctly', () => {
      const { PaymentMethodsMap } = require('./payment-methods.map');

      const productDTO: ProductDTO = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        is_new: true,
        accept_trade: true,
        payment_methods: [{ key: 'pix', name: 'Pix' }],
        product_images: [],
        user_id: 'user-123',
        is_active: true,
        user: undefined,
      };

      ProductMap.toProduct(productDTO);

      expect(
        PaymentMethodsMap.fromPaymentMethodsDTOArrayToPaymentMethodArray
      ).toHaveBeenCalledWith([{ key: 'pix', name: 'Pix' }]);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const productDTO: ProductDTO = {
        id: 'product-123',
        name: longString,
        description: longString,
        price: 100,
        is_new: true,
        accept_trade: true,
        payment_methods: [],
        product_images: [],
        user_id: 'user-123',
        is_active: true,
        user: undefined,
      };

      const result = ProductMap.toIProduct(productDTO);

      expect(result.name).toBe(longString);
      expect(result.description).toBe(longString);
    });

    it('should handle special characters', () => {
      const productDTO: ProductDTO = {
        id: 'product-ção-ñ',
        name: 'Produto com Acentos & Símbolos',
        description: 'Descrição com "aspas" e \'apóstrofos\'',
        price: 100,
        is_new: true,
        accept_trade: true,
        payment_methods: [],
        product_images: [],
        user_id: 'user-ção',
        is_active: true,
        user: undefined,
      };

      const result = ProductMap.toIProduct(productDTO);

      expect(result.id).toBe('product-ção-ñ');
      expect(result.name).toBe('Produto com Acentos & Símbolos');
      expect(result.description).toBe('Descrição com "aspas" e \'apóstrofos\'');
      expect(result.user_id).toBe('user-ção');
    });

    it('should handle zero values correctly', () => {
      const productDTO: ProductDTO = {
        id: 'product-123',
        name: 'Free Product',
        description: 'Free Description',
        price: 0,
        is_new: false,
        accept_trade: false,
        payment_methods: [],
        product_images: [],
        user_id: 'user-123',
        is_active: false,
        user: undefined,
      };

      const result = ProductMap.toProduct(productDTO);

      expect(result.price).toBe(0);
      expect(result.isNew).toBe(false);
      expect(result.acceptTrade).toBe(false);
      expect(result.isActive).toBe(false);
    });
  });
});
