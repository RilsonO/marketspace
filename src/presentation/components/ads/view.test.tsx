import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import { Ads } from './view';
import { IProduct } from 'src/shared/types/interfaces/product.interface';
import { PaymentMethod } from 'src/entities/Product';
import { THEME } from 'src/shared/theme';

// Mock do useAdsViewModel
jest.mock('./view-model', () => ({
  useAdsViewModel: jest.fn(),
}));

// Mock dos componentes filhos
jest.mock('../user-photo/view', () => ({
  UserPhoto: () => <div testID='user-photo' />,
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

// Mock do defaultUserPhotoImg
jest.mock('src/assets/userPhotoDefault.png', () => 'mocked-default-photo.png');

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

const mockUseAdsViewModel = jest.fn();

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <NativeBaseProvider theme={THEME}>{component}</NativeBaseProvider>
  );
};

describe('Ads Component', () => {
  beforeEach(() => {
    mockUseAdsViewModel.mockReturnValue({
      avatarIsLoading: false,
      handleNavigateToAdDetails: jest.fn(),
      handleAvatarLoading: jest.fn(),
    });

    // Import the mocked hook
    const { useAdsViewModel } = require('./view-model');
    useAdsViewModel.mockImplementation(mockUseAdsViewModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { UNSAFE_root } = renderWithProvider(<Ads {...mockProduct} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with default showAvatar prop', () => {
    const { UNSAFE_root } = renderWithProvider(<Ads {...mockProduct} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with showAvatar false', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Ads {...mockProduct} showAvatar={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with showAvatar true', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Ads {...mockProduct} showAvatar={true} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle product without images', () => {
    const productWithoutImages = { ...mockProduct, product_images: [] };
    const { UNSAFE_root } = renderWithProvider(
      <Ads {...productWithoutImages} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle used product (is_new false)', () => {
    const usedProduct = { ...mockProduct, is_new: false };
    const { UNSAFE_root } = renderWithProvider(<Ads {...usedProduct} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle inactive product (is_active false)', () => {
    const inactiveProduct = { ...mockProduct, is_active: false };
    const { UNSAFE_root } = renderWithProvider(<Ads {...inactiveProduct} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle product without trade acceptance', () => {
    const noTradeProduct = { ...mockProduct, accept_trade: false };
    const { UNSAFE_root } = renderWithProvider(<Ads {...noTradeProduct} />);
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
      <Ads {...productWithoutAvatar} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle different price values', () => {
    const expensiveProduct = { ...mockProduct, price: 9999.99 };
    const { UNSAFE_root: expensiveRoot } = renderWithProvider(
      <Ads {...expensiveProduct} />
    );
    expect(expensiveRoot).toBeTruthy();

    const cheapProduct = { ...mockProduct, price: 1.5 };
    const { UNSAFE_root: cheapRoot } = renderWithProvider(
      <Ads {...cheapProduct} />
    );
    expect(cheapRoot).toBeTruthy();
  });

  it('should handle different product names', () => {
    const longNameProduct = {
      ...mockProduct,
      name: 'Produto com nome muito longo que pode causar problemas de layout',
    };
    const { UNSAFE_root } = renderWithProvider(<Ads {...longNameProduct} />);
    expect(UNSAFE_root).toBeTruthy();

    const shortNameProduct = { ...mockProduct, name: 'A' };
    const { UNSAFE_root: shortRoot } = renderWithProvider(
      <Ads {...shortNameProduct} />
    );
    expect(shortRoot).toBeTruthy();
  });

  it('should handle empty product name', () => {
    const emptyNameProduct = { ...mockProduct, name: '' };
    const { UNSAFE_root } = renderWithProvider(<Ads {...emptyNameProduct} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle numeric id as string', () => {
    const numericIdProduct = { ...mockProduct, id: '123' };
    const { UNSAFE_root } = renderWithProvider(<Ads {...numericIdProduct} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle uuid id', () => {
    const uuidIdProduct = {
      ...mockProduct,
      id: '550e8400-e29b-41d4-a716-446655440000',
    };
    const { UNSAFE_root } = renderWithProvider(<Ads {...uuidIdProduct} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle avatar loading state from view-model', () => {
    mockUseAdsViewModel.mockReturnValue({
      avatarIsLoading: true,
      handleNavigateToAdDetails: jest.fn(),
      handleAvatarLoading: jest.fn(),
    });

    const { UNSAFE_root } = renderWithProvider(<Ads {...mockProduct} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle navigation function from view-model', () => {
    const mockNavigate = jest.fn();
    mockUseAdsViewModel.mockReturnValue({
      avatarIsLoading: false,
      handleNavigateToAdDetails: mockNavigate,
      handleAvatarLoading: jest.fn(),
    });

    const { UNSAFE_root } = renderWithProvider(<Ads {...mockProduct} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle avatar loading function from view-model', () => {
    const mockHandleAvatarLoading = jest.fn();
    mockUseAdsViewModel.mockReturnValue({
      avatarIsLoading: false,
      handleNavigateToAdDetails: jest.fn(),
      handleAvatarLoading: mockHandleAvatarLoading,
    });

    const { UNSAFE_root } = renderWithProvider(<Ads {...mockProduct} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with multiple product images', () => {
    const multiImageProduct = {
      ...mockProduct,
      product_images: [
        { uri: 'http://localhost:3000/images/image1.jpg', id: '1' },
        { uri: 'http://localhost:3000/images/image2.jpg', id: '2' },
        { uri: 'http://localhost:3000/images/image3.jpg', id: '3' },
        { uri: 'http://localhost:3000/images/image4.jpg', id: '4' },
      ],
    };
    const { UNSAFE_root } = renderWithProvider(<Ads {...multiImageProduct} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle edge case with undefined props', () => {
    const edgeCaseProduct = {
      ...mockProduct,
      is_active: undefined,
      is_new: undefined,
      accept_trade: undefined,
    };
    const { UNSAFE_root } = renderWithProvider(<Ads {...edgeCaseProduct} />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
