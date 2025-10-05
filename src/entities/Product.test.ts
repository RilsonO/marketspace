import { Product, PaymentMethod, ProductImage } from './Product';

describe('Product Entity', () => {
  const validProductData = {
    id: 'product-1',
    name: 'Test Product',
    description: 'Test Description',
    price: 100.5,
    isNew: true,
    acceptTrade: true,
    paymentMethods: [PaymentMethod.PIX, PaymentMethod.BOLETO],
    images: [
      { id: 'img-1', path: '/path/to/image1.jpg' },
      { id: 'img-2', path: '/path/to/image2.jpg' },
    ],
    userId: 'user-1',
    isActive: true,
  };

  describe('Constructor', () => {
    it('should create a product with valid data', () => {
      const product = new Product(
        validProductData.id,
        validProductData.name,
        validProductData.description,
        validProductData.price,
        validProductData.isNew,
        validProductData.acceptTrade,
        validProductData.paymentMethods,
        validProductData.images,
        validProductData.userId,
        validProductData.isActive
      );

      expect(product.id).toBe(validProductData.id);
      expect(product.name).toBe(validProductData.name);
      expect(product.description).toBe(validProductData.description);
      expect(product.price).toBe(validProductData.price);
      expect(product.isNew).toBe(validProductData.isNew);
      expect(product.acceptTrade).toBe(validProductData.acceptTrade);
      expect(product.paymentMethods).toEqual(validProductData.paymentMethods);
      expect(product.images).toEqual(validProductData.images);
      expect(product.userId).toBe(validProductData.userId);
      expect(product.isActive).toBe(validProductData.isActive);
    });

    it('should create a product with default isActive = true', () => {
      const product = new Product(
        validProductData.id,
        validProductData.name,
        validProductData.description,
        validProductData.price,
        validProductData.isNew,
        validProductData.acceptTrade,
        validProductData.paymentMethods,
        validProductData.images,
        validProductData.userId
      );

      expect(product.isActive).toBe(true);
    });

    it('should create a product with price = 0', () => {
      const product = new Product(
        validProductData.id,
        validProductData.name,
        validProductData.description,
        0,
        validProductData.isNew,
        validProductData.acceptTrade,
        validProductData.paymentMethods,
        validProductData.images,
        validProductData.userId
      );

      expect(product.price).toBe(0);
    });

    it('should create a product with empty description', () => {
      const product = new Product(
        validProductData.id,
        validProductData.name,
        '',
        validProductData.price,
        validProductData.isNew,
        validProductData.acceptTrade,
        validProductData.paymentMethods,
        validProductData.images,
        validProductData.userId
      );

      expect(product.description).toBe('');
    });

    it('should create a product with empty payment methods', () => {
      const product = new Product(
        validProductData.id,
        validProductData.name,
        validProductData.description,
        validProductData.price,
        validProductData.isNew,
        validProductData.acceptTrade,
        [],
        validProductData.images,
        validProductData.userId
      );

      expect(product.paymentMethods).toEqual([]);
    });

    it('should create a product with empty images', () => {
      const product = new Product(
        validProductData.id,
        validProductData.name,
        validProductData.description,
        validProductData.price,
        validProductData.isNew,
        validProductData.acceptTrade,
        validProductData.paymentMethods,
        [],
        validProductData.userId
      );

      expect(product.images).toEqual([]);
    });
  });

  describe('Validation', () => {
    it('should throw error when id is empty', () => {
      expect(() => {
        new Product(
          '',
          validProductData.name,
          validProductData.description,
          validProductData.price,
          validProductData.isNew,
          validProductData.acceptTrade,
          validProductData.paymentMethods,
          validProductData.images,
          validProductData.userId
        );
      }).toThrow('Product ID is required');
    });

    it('should throw error when id is only whitespace', () => {
      expect(() => {
        new Product(
          '   ',
          validProductData.name,
          validProductData.description,
          validProductData.price,
          validProductData.isNew,
          validProductData.acceptTrade,
          validProductData.paymentMethods,
          validProductData.images,
          validProductData.userId
        );
      }).toThrow('Product ID is required');
    });

    it('should throw error when name is empty', () => {
      expect(() => {
        new Product(
          validProductData.id,
          '',
          validProductData.description,
          validProductData.price,
          validProductData.isNew,
          validProductData.acceptTrade,
          validProductData.paymentMethods,
          validProductData.images,
          validProductData.userId
        );
      }).toThrow('Product name is required');
    });

    it('should throw error when name is only whitespace', () => {
      expect(() => {
        new Product(
          validProductData.id,
          '   ',
          validProductData.description,
          validProductData.price,
          validProductData.isNew,
          validProductData.acceptTrade,
          validProductData.paymentMethods,
          validProductData.images,
          validProductData.userId
        );
      }).toThrow('Product name is required');
    });

    it('should throw error when price is negative', () => {
      expect(() => {
        new Product(
          validProductData.id,
          validProductData.name,
          validProductData.description,
          -10,
          validProductData.isNew,
          validProductData.acceptTrade,
          validProductData.paymentMethods,
          validProductData.images,
          validProductData.userId
        );
      }).toThrow('Product price must not be negative');
    });

    it('should throw error when userId is empty', () => {
      expect(() => {
        new Product(
          validProductData.id,
          validProductData.name,
          validProductData.description,
          validProductData.price,
          validProductData.isNew,
          validProductData.acceptTrade,
          validProductData.paymentMethods,
          validProductData.images,
          ''
        );
      }).toThrow('User ID is required');
    });

    it('should throw error when userId is only whitespace', () => {
      expect(() => {
        new Product(
          validProductData.id,
          validProductData.name,
          validProductData.description,
          validProductData.price,
          validProductData.isNew,
          validProductData.acceptTrade,
          validProductData.paymentMethods,
          validProductData.images,
          '   '
        );
      }).toThrow('User ID is required');
    });
  });

  describe('PaymentMethod enum', () => {
    it('should have correct payment method values', () => {
      expect(PaymentMethod.BOLETO).toBe('boleto');
      expect(PaymentMethod.PIX).toBe('pix');
      expect(PaymentMethod.DINHEIRO).toBe('cash');
      expect(PaymentMethod.CARTAO_CREDITO).toBe('card');
      expect(PaymentMethod.CARTAO_DEBITO).toBe('cartao_debito');
      expect(PaymentMethod.DEPOSITO_BANCARIO).toBe('deposit');
    });
  });

  describe('ProductImage interface', () => {
    it('should create ProductImage with correct structure', () => {
      const image: ProductImage = {
        id: 'img-1',
        path: '/path/to/image.jpg',
      };

      expect(image.id).toBe('img-1');
      expect(image.path).toBe('/path/to/image.jpg');
    });
  });
});
