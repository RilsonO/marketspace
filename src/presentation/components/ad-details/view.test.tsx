import React from 'react';
import { render } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import { AdDetails } from './view';
import { IProduct } from 'src/shared/types/interfaces/product.interface';
import { PaymentMethod } from 'src/entities/Product';
import { THEME } from 'src/shared/theme';

// Mock do useAdDetailsViewModel
jest.mock('./view-model', () => ({
  useAdDetailsViewModel: jest.fn(),
}));

// Mock dos componentes filhos
jest.mock('../image-slider/view', () => ({
  ImageSlider: () => <div testID='image-slider' />,
}));

jest.mock('../user-photo/view', () => ({
  UserPhoto: () => <div testID='user-photo' />,
}));

jest.mock('./components/payment-method/view', () => ({
  PaymentMethod: () => <div testID='payment-method' />,
}));

// Mock do toMaskedPrice
jest.mock('src/shared/utils/Masks.util', () => ({
  toMaskedPrice: jest.fn((price) => `R$ ${price.replace('.', ',')}`),
}));

// Mock do client
jest.mock('src/infra/http/client.http', () => ({
  client: {
    defaults: {
      baseURL: 'http://localhost:3000',
    },
  },
}));

const mockProduct: IProduct = {
  id: '1',
  name: 'Produto Teste',
  description: 'Descrição do produto teste',
  is_new: true,
  price: 100.5,
  accept_trade: true,
  payment_methods: [PaymentMethod.PIX, PaymentMethod.BOLETO],
  product_images: [
    { uri: 'http://localhost:3000/images/image1.jpg', id: '1' },
    { uri: 'http://localhost:3000/images/image2.jpg', id: '2' },
  ],
  is_active: true,
  user_id: 'user1',
  user: {
    id: 'user1',
    name: 'João Silva',
    email: 'joao@test.com',
    avatar: 'avatar.jpg',
    tel: '11999999999',
  },
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <NativeBaseProvider theme={THEME}>{component}</NativeBaseProvider>
  );
};

describe('AdDetails Component', () => {
  it('should render without crashing', () => {
    const { UNSAFE_root } = renderWithProvider(<AdDetails {...mockProduct} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render ScrollView as root component', () => {
    const { UNSAFE_root } = renderWithProvider(<AdDetails {...mockProduct} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with different product states', () => {
    // Test with used product
    const usedProduct = { ...mockProduct, is_new: false };
    const { UNSAFE_root: usedRoot } = renderWithProvider(
      <AdDetails {...usedProduct} />
    );
    expect(usedRoot).toBeTruthy();

    // Test with inactive product
    const inactiveProduct = { ...mockProduct, is_active: false };
    const { UNSAFE_root: inactiveRoot } = renderWithProvider(
      <AdDetails {...inactiveProduct} />
    );
    expect(inactiveRoot).toBeTruthy();

    // Test without trade acceptance
    const noTradeProduct = { ...mockProduct, accept_trade: false };
    const { UNSAFE_root: noTradeRoot } = renderWithProvider(
      <AdDetails {...noTradeProduct} />
    );
    expect(noTradeRoot).toBeTruthy();
  });

  it('should handle empty payment methods', () => {
    const productWithoutPayments = { ...mockProduct, payment_methods: [] };
    const { UNSAFE_root } = renderWithProvider(
      <AdDetails {...productWithoutPayments} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle product without images', () => {
    const productWithoutImages = { ...mockProduct, product_images: [] };
    const { UNSAFE_root } = renderWithProvider(
      <AdDetails {...productWithoutImages} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle user without avatar', () => {
    const productWithoutAvatar = {
      ...mockProduct,
      user: {
        ...mockProduct.user,
        avatar: null,
      },
    };
    const { UNSAFE_root } = renderWithProvider(
      <AdDetails {...productWithoutAvatar} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle default is_active value', () => {
    const productWithoutActive = {
      ...mockProduct,
      is_active: undefined,
    };
    const { UNSAFE_root } = renderWithProvider(
      <AdDetails {...productWithoutActive} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });
});
