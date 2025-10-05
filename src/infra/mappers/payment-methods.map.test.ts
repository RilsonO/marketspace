import { PaymentMethodsMap } from './payment-methods.map';
import { PaymentMethod } from '../../entities/Product';
import { PaymentMethodsDTO } from '../../application/dtos/common.dtos';

describe('PaymentMethodsMap', () => {
  describe('fromPaymentMethodsDTOArrayToPaymentMethodArray', () => {
    it('should convert DTO array to PaymentMethod array', () => {
      const paymentMethodsDTO: PaymentMethodsDTO[] = [
        { key: 'pix', name: 'Pix' },
        { key: 'boleto', name: 'Boleto' },
        { key: 'cash', name: 'Dinheiro' },
      ];

      const result =
        PaymentMethodsMap.fromPaymentMethodsDTOArrayToPaymentMethodArray(
          paymentMethodsDTO
        );

      expect(result).toEqual([
        PaymentMethod.PIX,
        PaymentMethod.BOLETO,
        PaymentMethod.DINHEIRO,
      ]);
    });

    it('should handle empty array', () => {
      const paymentMethodsDTO: PaymentMethodsDTO[] = [];

      const result =
        PaymentMethodsMap.fromPaymentMethodsDTOArrayToPaymentMethodArray(
          paymentMethodsDTO
        );

      expect(result).toEqual([]);
    });

    it('should handle single element array', () => {
      const paymentMethodsDTO: PaymentMethodsDTO[] = [
        { key: 'card', name: 'Cartão de Crédito' },
      ];

      const result =
        PaymentMethodsMap.fromPaymentMethodsDTOArrayToPaymentMethodArray(
          paymentMethodsDTO
        );

      expect(result).toEqual([PaymentMethod.CARTAO_CREDITO]);
    });

    it('should handle all payment methods', () => {
      const paymentMethodsDTO: PaymentMethodsDTO[] = [
        { key: 'pix', name: 'Pix' },
        { key: 'boleto', name: 'Boleto' },
        { key: 'cash', name: 'Dinheiro' },
        { key: 'card', name: 'Cartão de Crédito' },
        { key: 'cartao_debito', name: 'Cartão de Débito' },
        { key: 'deposit', name: 'Depósito Bancário' },
      ];

      const result =
        PaymentMethodsMap.fromPaymentMethodsDTOArrayToPaymentMethodArray(
          paymentMethodsDTO
        );

      expect(result).toEqual([
        PaymentMethod.PIX,
        PaymentMethod.BOLETO,
        PaymentMethod.DINHEIRO,
        PaymentMethod.CARTAO_CREDITO,
        PaymentMethod.CARTAO_DEBITO,
        PaymentMethod.DEPOSITO_BANCARIO,
      ]);
    });
  });

  describe('fromPaymentMethodArrayToPaymentMethodsDTOArray', () => {
    it('should convert PaymentMethod array to DTO array', () => {
      const paymentMethods: PaymentMethod[] = [
        PaymentMethod.PIX,
        PaymentMethod.BOLETO,
        PaymentMethod.DINHEIRO,
      ];

      const result =
        PaymentMethodsMap.fromPaymentMethodArrayToPaymentMethodsDTOArray(
          paymentMethods
        );

      expect(result).toEqual([
        { key: 'pix', name: 'Pix' },
        { key: 'boleto', name: 'Boleto' },
        { key: 'cash', name: 'Dinheiro' },
      ]);
    });

    it('should handle empty array', () => {
      const paymentMethods: PaymentMethod[] = [];

      const result =
        PaymentMethodsMap.fromPaymentMethodArrayToPaymentMethodsDTOArray(
          paymentMethods
        );

      expect(result).toEqual([]);
    });

    it('should handle single element array', () => {
      const paymentMethods: PaymentMethod[] = [PaymentMethod.PIX];

      const result =
        PaymentMethodsMap.fromPaymentMethodArrayToPaymentMethodsDTOArray(
          paymentMethods
        );

      expect(result).toEqual([{ key: 'pix', name: 'Pix' }]);
    });

    it('should handle all payment methods with correct names', () => {
      const paymentMethods: PaymentMethod[] = [
        PaymentMethod.PIX,
        PaymentMethod.BOLETO,
        PaymentMethod.DINHEIRO,
        PaymentMethod.CARTAO_CREDITO,
        PaymentMethod.CARTAO_DEBITO,
        PaymentMethod.DEPOSITO_BANCARIO,
      ];

      const result =
        PaymentMethodsMap.fromPaymentMethodArrayToPaymentMethodsDTOArray(
          paymentMethods
        );

      expect(result).toEqual([
        { key: 'pix', name: 'Pix' },
        { key: 'boleto', name: 'Boleto' },
        { key: 'cash', name: 'Dinheiro' },
        { key: 'card', name: 'Cartão de Crédito' },
        { key: 'cartao_debito', name: 'Cartão de Débito' },
        { key: 'deposit', name: 'Depósito Bancário' },
      ]);
    });
  });

  describe('fromPaymentMethodArrayToStringArray', () => {
    it('should convert PaymentMethod array to string array', () => {
      const paymentMethods: PaymentMethod[] = [
        PaymentMethod.PIX,
        PaymentMethod.BOLETO,
        PaymentMethod.DINHEIRO,
      ];

      const result =
        PaymentMethodsMap.fromPaymentMethodArrayToStringArray(paymentMethods);

      expect(result).toEqual(['pix', 'boleto', 'cash']);
    });

    it('should handle empty array', () => {
      const paymentMethods: PaymentMethod[] = [];

      const result =
        PaymentMethodsMap.fromPaymentMethodArrayToStringArray(paymentMethods);

      expect(result).toEqual([]);
    });

    it('should handle single element array', () => {
      const paymentMethods: PaymentMethod[] = [PaymentMethod.PIX];

      const result =
        PaymentMethodsMap.fromPaymentMethodArrayToStringArray(paymentMethods);

      expect(result).toEqual(['pix']);
    });

    it('should handle all payment methods', () => {
      const paymentMethods: PaymentMethod[] = [
        PaymentMethod.PIX,
        PaymentMethod.BOLETO,
        PaymentMethod.DINHEIRO,
        PaymentMethod.CARTAO_CREDITO,
        PaymentMethod.CARTAO_DEBITO,
        PaymentMethod.DEPOSITO_BANCARIO,
      ];

      const result =
        PaymentMethodsMap.fromPaymentMethodArrayToStringArray(paymentMethods);

      expect(result).toEqual([
        'pix',
        'boleto',
        'cash',
        'card',
        'cartao_debito',
        'deposit',
      ]);
    });
  });

  describe('Payment method name mapping', () => {
    it('should return correct names for all payment methods', () => {
      const testCases = [
        { method: PaymentMethod.PIX, expectedName: 'Pix' },
        { method: PaymentMethod.BOLETO, expectedName: 'Boleto' },
        { method: PaymentMethod.DINHEIRO, expectedName: 'Dinheiro' },
        {
          method: PaymentMethod.CARTAO_CREDITO,
          expectedName: 'Cartão de Crédito',
        },
        {
          method: PaymentMethod.CARTAO_DEBITO,
          expectedName: 'Cartão de Débito',
        },
        {
          method: PaymentMethod.DEPOSITO_BANCARIO,
          expectedName: 'Depósito Bancário',
        },
      ];

      testCases.forEach(({ method, expectedName }) => {
        const result =
          PaymentMethodsMap.fromPaymentMethodArrayToPaymentMethodsDTOArray([
            method,
          ]);
        expect(result[0].name).toBe(expectedName);
      });
    });
  });

  describe('Round-trip conversion', () => {
    it('should maintain data integrity through round-trip conversion', () => {
      const originalDTO: PaymentMethodsDTO[] = [
        { key: 'pix', name: 'Pix' },
        { key: 'boleto', name: 'Boleto' },
      ];

      const paymentMethods =
        PaymentMethodsMap.fromPaymentMethodsDTOArrayToPaymentMethodArray(
          originalDTO
        );
      const backToDTO =
        PaymentMethodsMap.fromPaymentMethodArrayToPaymentMethodsDTOArray(
          paymentMethods
        );

      expect(backToDTO).toEqual(originalDTO);
    });

    it('should maintain data integrity through string conversion', () => {
      const originalMethods: PaymentMethod[] = [
        PaymentMethod.PIX,
        PaymentMethod.BOLETO,
      ];

      const stringArray =
        PaymentMethodsMap.fromPaymentMethodArrayToStringArray(originalMethods);
      const backToMethods = stringArray.map((str) => str as PaymentMethod);

      expect(backToMethods).toEqual(originalMethods);
    });
  });
});
