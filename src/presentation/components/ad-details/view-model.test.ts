import { renderHook } from '@testing-library/react-native';
import { useAdDetailsViewModel } from './view-model';
import { PaymentMethod } from 'src/entities/Product';

describe('useAdDetailsViewModel', () => {
  it('should initialize with empty payment methods array', () => {
    const { result } = renderHook(() => useAdDetailsViewModel([]));

    expect(result.current.paymentMethodsToShow).toEqual([]);
  });

  it('should map BOLETO to correct icon and title', () => {
    const { result } = renderHook(() =>
      useAdDetailsViewModel([PaymentMethod.BOLETO])
    );

    expect(result.current.paymentMethodsToShow).toHaveLength(1);
    expect(result.current.paymentMethodsToShow[0]).toEqual({
      title: 'Boleto',
      icon: expect.any(Function), // Barcode component
    });
  });

  it('should map PIX to correct icon and title', () => {
    const { result } = renderHook(() =>
      useAdDetailsViewModel([PaymentMethod.PIX])
    );

    expect(result.current.paymentMethodsToShow).toHaveLength(1);
    expect(result.current.paymentMethodsToShow[0]).toEqual({
      title: 'Pix',
      icon: expect.any(Function), // QrCode component
    });
  });

  it('should map DEPOSITO_BANCARIO to correct icon and title', () => {
    const { result } = renderHook(() =>
      useAdDetailsViewModel([PaymentMethod.DEPOSITO_BANCARIO])
    );

    expect(result.current.paymentMethodsToShow).toHaveLength(1);
    expect(result.current.paymentMethodsToShow[0]).toEqual({
      title: 'Depósito Bancário',
      icon: expect.any(Function), // Bank component
    });
  });

  it('should map DINHEIRO to correct icon and title', () => {
    const { result } = renderHook(() =>
      useAdDetailsViewModel([PaymentMethod.DINHEIRO])
    );

    expect(result.current.paymentMethodsToShow).toHaveLength(1);
    expect(result.current.paymentMethodsToShow[0]).toEqual({
      title: 'Dinheiro',
      icon: expect.any(Function), // Money component
    });
  });

  it('should map CARTAO_CREDITO to correct icon and title', () => {
    const { result } = renderHook(() =>
      useAdDetailsViewModel([PaymentMethod.CARTAO_CREDITO])
    );

    expect(result.current.paymentMethodsToShow).toHaveLength(1);
    expect(result.current.paymentMethodsToShow[0]).toEqual({
      title: 'Cartão de Crédito',
      icon: expect.any(Function), // CreditCard component
    });
  });

  it('should handle multiple payment methods', () => {
    const paymentMethods = [
      PaymentMethod.PIX,
      PaymentMethod.BOLETO,
      PaymentMethod.DINHEIRO,
    ];

    const { result } = renderHook(() => useAdDetailsViewModel(paymentMethods));

    expect(result.current.paymentMethodsToShow).toHaveLength(3);
    expect(result.current.paymentMethodsToShow[0].title).toBe('Pix');
    expect(result.current.paymentMethodsToShow[1].title).toBe('Boleto');
    expect(result.current.paymentMethodsToShow[2].title).toBe('Dinheiro');
  });

  it('should handle all payment methods', () => {
    const allPaymentMethods = [
      PaymentMethod.PIX,
      PaymentMethod.BOLETO,
      PaymentMethod.DEPOSITO_BANCARIO,
      PaymentMethod.DINHEIRO,
      PaymentMethod.CARTAO_CREDITO,
    ];

    const { result } = renderHook(() =>
      useAdDetailsViewModel(allPaymentMethods)
    );

    expect(result.current.paymentMethodsToShow).toHaveLength(5);

    const titles = result.current.paymentMethodsToShow.map(
      (item) => item.title
    );
    expect(titles).toContain('Pix');
    expect(titles).toContain('Boleto');
    expect(titles).toContain('Depósito Bancário');
    expect(titles).toContain('Dinheiro');
    expect(titles).toContain('Cartão de Crédito');
  });

  it('should handle empty payment methods array', () => {
    const { result } = renderHook(() => useAdDetailsViewModel([]));

    expect(result.current.paymentMethodsToShow).toEqual([]);
  });

  it('should update when payment methods change', () => {
    const { result, rerender } = renderHook(
      ({ paymentMethods }) => useAdDetailsViewModel(paymentMethods),
      {
        initialProps: { paymentMethods: [PaymentMethod.PIX] },
      }
    );

    expect(result.current.paymentMethodsToShow).toHaveLength(1);
    expect(result.current.paymentMethodsToShow[0].title).toBe('Pix');

    // Change payment methods
    rerender({
      paymentMethods: [PaymentMethod.BOLETO, PaymentMethod.DINHEIRO],
    });

    expect(result.current.paymentMethodsToShow).toHaveLength(2);
    expect(result.current.paymentMethodsToShow[0].title).toBe('Boleto');
    expect(result.current.paymentMethodsToShow[1].title).toBe('Dinheiro');
  });

  it('should clear payment methods when empty array is passed', () => {
    const { result, rerender } = renderHook(
      ({ paymentMethods }) => useAdDetailsViewModel(paymentMethods),
      {
        initialProps: {
          paymentMethods: [PaymentMethod.PIX, PaymentMethod.BOLETO],
        },
      }
    );

    expect(result.current.paymentMethodsToShow).toHaveLength(2);

    // Clear payment methods
    rerender({ paymentMethods: [] });

    expect(result.current.paymentMethodsToShow).toEqual([]);
  });

  it('should handle duplicate payment methods', () => {
    const { result } = renderHook(() =>
      useAdDetailsViewModel([
        PaymentMethod.PIX,
        PaymentMethod.PIX,
        PaymentMethod.BOLETO,
      ])
    );

    expect(result.current.paymentMethodsToShow).toHaveLength(3);
    expect(result.current.paymentMethodsToShow[0].title).toBe('Pix');
    expect(result.current.paymentMethodsToShow[1].title).toBe('Pix');
    expect(result.current.paymentMethodsToShow[2].title).toBe('Boleto');
  });

  it('should return correct interface structure', () => {
    const { result } = renderHook(() =>
      useAdDetailsViewModel([PaymentMethod.PIX])
    );

    expect(result.current).toHaveProperty('paymentMethodsToShow');
    expect(Array.isArray(result.current.paymentMethodsToShow)).toBe(true);

    if (result.current.paymentMethodsToShow.length > 0) {
      const item = result.current.paymentMethodsToShow[0];
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('icon');
      expect(typeof item.title).toBe('string');
      expect(typeof item.icon).toBe('function');
    }
  });
});
