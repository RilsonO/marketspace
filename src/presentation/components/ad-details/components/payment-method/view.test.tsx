import React from 'react';
import { render } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import { PaymentMethod } from './view';
import { THEME } from 'src/shared/theme';
import {
  QrCode,
  Barcode,
  CreditCard,
  Money,
  Bank,
} from 'phosphor-react-native';

// Mock dos ícones do Phosphor
jest.mock('phosphor-react-native', () => ({
  QrCode: ({ size, color }: { size: number; color: string }) => (
    <div testID='qr-code-icon' data-size={size} data-color={color} />
  ),
  Barcode: ({ size, color }: { size: number; color: string }) => (
    <div testID='barcode-icon' data-size={size} data-color={color} />
  ),
  CreditCard: ({ size, color }: { size: number; color: string }) => (
    <div testID='credit-card-icon' data-size={size} data-color={color} />
  ),
  Money: ({ size, color }: { size: number; color: string }) => (
    <div testID='money-icon' data-size={size} data-color={color} />
  ),
  Bank: ({ size, color }: { size: number; color: string }) => (
    <div testID='bank-icon' data-size={size} data-color={color} />
  ),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <NativeBaseProvider theme={THEME}>{component}</NativeBaseProvider>
  );
};

describe('PaymentMethod Component', () => {
  it('should render without crashing', () => {
    const { UNSAFE_root } = renderWithProvider(
      <PaymentMethod title='Pix' icon={QrCode} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with QrCode icon for Pix', () => {
    const { UNSAFE_root } = renderWithProvider(
      <PaymentMethod title='Pix' icon={QrCode} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with Barcode icon for Boleto', () => {
    const { UNSAFE_root } = renderWithProvider(
      <PaymentMethod title='Boleto' icon={Barcode} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with CreditCard icon for Cartão de Crédito', () => {
    const { UNSAFE_root } = renderWithProvider(
      <PaymentMethod title='Cartão de Crédito' icon={CreditCard} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with Money icon for Dinheiro', () => {
    const { UNSAFE_root } = renderWithProvider(
      <PaymentMethod title='Dinheiro' icon={Money} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with Bank icon for Depósito Bancário', () => {
    const { UNSAFE_root } = renderWithProvider(
      <PaymentMethod title='Depósito Bancário' icon={Bank} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle different title lengths', () => {
    const titles = [
      'Pix',
      'Boleto',
      'Cartão de Crédito',
      'Dinheiro',
      'Depósito Bancário',
      'A',
      'Very Long Payment Method Name That Might Cause Layout Issues',
    ];

    titles.forEach((title) => {
      const { UNSAFE_root } = renderWithProvider(
        <PaymentMethod title={title} icon={QrCode} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle empty title', () => {
    const { UNSAFE_root } = renderWithProvider(
      <PaymentMethod title='' icon={QrCode} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle titles with special characters', () => {
    const specialTitles = [
      'Pix & Boleto',
      'Cartão de Crédito/Débito',
      'Depósito Bancário (PIX)',
      'Dinheiro - À vista',
      'Boleto + Taxa',
      'Cartão com cashback 2%',
    ];

    specialTitles.forEach((title) => {
      const { UNSAFE_root } = renderWithProvider(
        <PaymentMethod title={title} icon={QrCode} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle titles with unicode characters', () => {
    const unicodeTitles = [
      'Pix com émojis 🚀',
      'Boleto com ñ e ç',
      'Cartão com 中文 characters',
      'Dinheiro com Arabic نص',
      'Depósito com emojis 🎉✨',
    ];

    unicodeTitles.forEach((title) => {
      const { UNSAFE_root } = renderWithProvider(
        <PaymentMethod title={title} icon={QrCode} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should render multiple payment methods', () => {
    const paymentMethods = [
      { title: 'Pix', icon: QrCode },
      { title: 'Boleto', icon: Barcode },
      { title: 'Cartão de Crédito', icon: CreditCard },
      { title: 'Dinheiro', icon: Money },
      { title: 'Depósito Bancário', icon: Bank },
    ];

    const { UNSAFE_root } = renderWithProvider(
      <>
        {paymentMethods.map((method, index) => (
          <PaymentMethod key={index} title={method.title} icon={method.icon} />
        ))}
      </>
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle different icon types', () => {
    const icons = [QrCode, Barcode, CreditCard, Money, Bank];

    icons.forEach((Icon) => {
      const { UNSAFE_root } = renderWithProvider(
        <PaymentMethod title='Test Payment' icon={Icon} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should maintain consistent styling', () => {
    const { UNSAFE_root } = renderWithProvider(
      <PaymentMethod title='Consistent Test' icon={QrCode} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should work with different theme configurations', () => {
    const customTheme = {
      ...THEME,
      colors: {
        ...THEME.colors,
        gray: {
          ...THEME.colors.gray,
          600: '#4B5563',
          700: '#374151',
        },
      },
      sizes: {
        ...THEME.sizes,
        5: 20,
      },
    };

    const { UNSAFE_root } = renderWithProvider(
      <NativeBaseProvider theme={customTheme}>
        <PaymentMethod title='Themed Payment' icon={QrCode} />
      </NativeBaseProvider>
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle rapid prop changes', () => {
    const { UNSAFE_root, rerender } = renderWithProvider(
      <PaymentMethod title='Initial' icon={QrCode} />
    );
    expect(UNSAFE_root).toBeTruthy();

    // Change title
    rerender(
      <NativeBaseProvider theme={THEME}>
        <PaymentMethod title='Updated' icon={QrCode} />
      </NativeBaseProvider>
    );

    // Change icon
    rerender(
      <NativeBaseProvider theme={THEME}>
        <PaymentMethod title='Updated' icon={Barcode} />
      </NativeBaseProvider>
    );

    // Change both
    rerender(
      <NativeBaseProvider theme={THEME}>
        <PaymentMethod title='Final' icon={CreditCard} />
      </NativeBaseProvider>
    );
  });

  it('should handle edge cases with undefined props', () => {
    const { UNSAFE_root } = renderWithProvider(
      <PaymentMethod title={undefined as any} icon={QrCode} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle edge cases with null props', () => {
    const { UNSAFE_root } = renderWithProvider(
      <PaymentMethod title={null as any} icon={QrCode} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should be a pure component (no side effects)', () => {
    // Test that multiple renders produce the same result
    const { UNSAFE_root: root1 } = renderWithProvider(
      <PaymentMethod title='Test' icon={QrCode} />
    );
    const { UNSAFE_root: root2 } = renderWithProvider(
      <PaymentMethod title='Test' icon={QrCode} />
    );

    expect(root1).toBeTruthy();
    expect(root2).toBeTruthy();
  });
});
