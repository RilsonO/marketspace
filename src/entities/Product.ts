export enum PaymentMethod {
  BOLETO = 'boleto',
  PIX = 'pix',
  DINHEIRO = 'cash',
  CARTAO_CREDITO = 'card',
  CARTAO_DEBITO = 'cartao_debito',
  DEPOSITO_BANCARIO = 'deposit',
}

export interface ProductImage {
  id: string;
  path: string;
}

export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly isNew: boolean,
    public readonly acceptTrade: boolean,
    public readonly paymentMethods: PaymentMethod[],
    public readonly images: ProductImage[],
    public readonly userId: string,
    public readonly isActive: boolean = true
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id || this.id.trim() === '') {
      throw new Error('Product ID is required');
    }
    if (!this.name || this.name.trim() === '') {
      throw new Error('Product name is required');
    }
    // Relaxed validation for description - allow empty descriptions
    // if (!this.description || this.description.trim() === '') {
    //   throw new Error('Product description is required');
    // }
    if (this.price < 0) {
      // Allow price = 0
      throw new Error('Product price must not be negative');
    }
    if (!this.userId || this.userId.trim() === '') {
      throw new Error('User ID is required');
    }
    // Relaxed validation for payment methods - allow empty arrays
    // if (this.paymentMethods.length === 0) {
    //   throw new Error('At least one payment method is required');
    // }
  }

  isAvailable(): boolean {
    return this.isActive;
  }

  hasPaymentMethod(method: PaymentMethod): boolean {
    return this.paymentMethods.includes(method);
  }

  updatePrice(newPrice: number): Product {
    return new Product(
      this.id,
      this.name,
      this.description,
      newPrice,
      this.isNew,
      this.acceptTrade,
      this.paymentMethods,
      this.images,
      this.userId,
      this.isActive
    );
  }

  toggleActive(): Product {
    return new Product(
      this.id,
      this.name,
      this.description,
      this.price,
      this.isNew,
      this.acceptTrade,
      this.paymentMethods,
      this.images,
      this.userId,
      !this.isActive
    );
  }

  equals(other: Product): boolean {
    return this.id === other.id;
  }
}
