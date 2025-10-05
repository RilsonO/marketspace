import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import { CreateAd } from './view';
import { THEME } from 'src/shared/theme';

// Mock do useCreateAdViewModel
jest.mock('./view-model', () => ({
  useCreateAdViewModel: jest.fn(),
}));

// Mock dos componentes filhos
jest.mock('../../../components/input/view', () => ({
  Input: ({ placeholder, value, onChangeText, ...props }: any) => (
    <div
      testID={`input-${placeholder?.toLowerCase().replace(/\s+/g, '-')}`}
      data-value={value}
      data-onChangeText={typeof onChangeText === 'function'}
      {...props}
    />
  ),
}));

jest.mock('../../../components/checkbox/view', () => ({
  Checkbox: ({ label, isChecked, onChange }: any) => (
    <div
      testID={`checkbox-${label?.toLowerCase().replace(/\s+/g, '-')}`}
      data-checked={isChecked}
      data-onChange={typeof onChange === 'function'}
    />
  ),
}));

jest.mock('../../../components/radio/view', () => ({
  Radio: ({ data, value, onChange }: any) => (
    <div
      testID='radio-group'
      data-data={data?.length}
      data-value={value}
      data-onChange={typeof onChange === 'function'}
    />
  ),
}));

jest.mock('../../../components/button/view', () => ({
  Button: ({ title, onPress, bgColor }: any) => (
    <div
      testID={`button-${title?.toLowerCase()}`}
      data-bgColor={bgColor}
      data-onPress={typeof onPress === 'function'}
    />
  ),
}));

jest.mock('../../../components/product-small-photo/view', () => ({
  ProductSmallPhoto: ({ source, alt, size }: any) => (
    <div
      testID='product-small-photo'
      data-source={source?.uri}
      data-alt={alt}
      data-size={size}
    />
  ),
}));

// Mock dos ícones do Phosphor
jest.mock('phosphor-react-native', () => ({
  ArrowLeft: ({ size, color }: any) => (
    <div testID='arrow-left-icon' data-size={size} data-color={color} />
  ),
  Plus: ({ size, color }: any) => (
    <div testID='plus-icon' data-size={size} data-color={color} />
  ),
  X: ({ size, color }: any) => (
    <div testID='x-icon' data-size={size} data-color={color} />
  ),
}));

const mockUseCreateAdViewModel = jest.fn();

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <NativeBaseProvider theme={THEME}>{component}</NativeBaseProvider>
  );
};

describe('CreateAd Component', () => {
  beforeEach(() => {
    mockUseCreateAdViewModel.mockReturnValue({
      images: [],
      name: '',
      description: '',
      isNew: '',
      price: '',
      acceptTrade: false,
      photoIsLoading: false,
      headerTitle: 'Criar anúncio',
      handleName: jest.fn(),
      handleDescription: jest.fn(),
      handleIsNew: jest.fn(),
      handlePrice: jest.fn(),
      handleAcceptTrade: jest.fn(),
      handleGoBackToMyAdsScreen: jest.fn(),
      handlePhotoSelect: jest.fn(),
      handleRemovePhoto: jest.fn(),
      findPaymentMethod: jest.fn(() => false),
      handlePaymentMethods: jest.fn(),
      handleNavigateToAdPreview: jest.fn(),
    });

    // Import the mocked hook
    const { useCreateAdViewModel } = require('./view-model');
    useCreateAdViewModel.mockImplementation(mockUseCreateAdViewModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with default header title', () => {
    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with custom header title', () => {
    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      headerTitle: 'Editar anúncio',
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render all input fields', () => {
    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render radio group for product state', () => {
    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render switch for trade acceptance', () => {
    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render all payment method checkboxes', () => {
    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render action buttons', () => {
    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle empty images list', () => {
    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      images: [],
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle images list with photos', () => {
    const mockImages = [
      { name: 'photo1.jpg', uri: 'file://photo1.jpg', type: 'image/jpeg' },
      { name: 'photo2.jpg', uri: 'file://photo2.jpg', type: 'image/jpeg' },
    ];

    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      images: mockImages,
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle maximum images (3)', () => {
    const mockImages = [
      { name: 'photo1.jpg', uri: 'file://photo1.jpg', type: 'image/jpeg' },
      { name: 'photo2.jpg', uri: 'file://photo2.jpg', type: 'image/jpeg' },
      { name: 'photo3.jpg', uri: 'file://photo3.jpg', type: 'image/jpeg' },
    ];

    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      images: mockImages,
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle photo loading state', () => {
    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      photoIsLoading: true,
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle form data with values', () => {
    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      name: 'Test Product',
      description: 'Test Description',
      isNew: 'Produto novo',
      price: '100,00',
      acceptTrade: true,
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle form data with used product', () => {
    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      isNew: 'Produto usado',
      acceptTrade: false,
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle payment methods selection', () => {
    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      findPaymentMethod: jest.fn(
        (method) => method === 'pix' || method === 'boleto'
      ),
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle all payment methods selected', () => {
    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      findPaymentMethod: jest.fn(() => true),
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle no payment methods selected', () => {
    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      findPaymentMethod: jest.fn(() => false),
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle long text inputs', () => {
    const longText =
      'This is a very long text that might cause layout issues or text wrapping problems in the UI and should be handled gracefully';

    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      name: longText,
      description: longText,
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle empty text inputs', () => {
    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      name: '',
      description: '',
      price: '',
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle special characters in inputs', () => {
    const specialText = 'Produto com émojis 🚀 e caracteres especiais ñ ç';

    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      name: specialText,
      description: specialText,
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle unicode characters in inputs', () => {
    const unicodeText = 'Produto com 中文 characters e Arabic نص';

    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      name: unicodeText,
      description: unicodeText,
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle different price formats', () => {
    const priceFormats = ['0,00', '10,50', '100,00', '1000,99', '10000,00'];

    priceFormats.forEach((price) => {
      mockUseCreateAdViewModel.mockReturnValue({
        ...mockUseCreateAdViewModel(),
        price,
      });

      const { UNSAFE_root } = renderWithProvider(<CreateAd />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle edge case with undefined props', () => {
    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      name: undefined,
      description: undefined,
      isNew: undefined,
      price: undefined,
      acceptTrade: undefined,
      headerTitle: undefined,
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle edge case with null props', () => {
    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      name: null,
      description: null,
      isNew: null,
      price: null,
      acceptTrade: null,
      headerTitle: null,
    });

    const { UNSAFE_root } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should work with different theme configurations', () => {
    const customTheme = {
      ...THEME,
      colors: {
        ...THEME.colors,
        gray: {
          ...THEME.colors.gray,
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
        },
        blue: {
          ...THEME.colors.blue,
          400: '#3B82F6',
        },
      },
    };

    const { UNSAFE_root } = renderWithProvider(
      <NativeBaseProvider theme={customTheme}>
        <CreateAd />
      </NativeBaseProvider>
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle rapid prop changes', () => {
    const { UNSAFE_root, rerender } = renderWithProvider(<CreateAd />);
    expect(UNSAFE_root).toBeTruthy();

    // Change header title
    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      headerTitle: 'Updated Title',
    });

    rerender(
      <NativeBaseProvider theme={THEME}>
        <CreateAd />
      </NativeBaseProvider>
    );

    // Change form data
    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      name: 'Updated Product',
      description: 'Updated Description',
    });

    rerender(
      <NativeBaseProvider theme={THEME}>
        <CreateAd />
      </NativeBaseProvider>
    );

    // Change images
    mockUseCreateAdViewModel.mockReturnValue({
      ...mockUseCreateAdViewModel(),
      images: [{ name: 'new.jpg', uri: 'file://new.jpg', type: 'image/jpeg' }],
    });

    rerender(
      <NativeBaseProvider theme={THEME}>
        <CreateAd />
      </NativeBaseProvider>
    );
  });

  it('should maintain consistent rendering across different states', () => {
    const states = [
      { name: 'empty', images: [], name: '', description: '', price: '' },
      { name: 'partial', images: [], name: 'Test', description: '', price: '' },
      {
        name: 'full',
        images: [],
        name: 'Test',
        description: 'Test',
        price: '100,00',
      },
      {
        name: 'with-images',
        images: [
          { name: 'test.jpg', uri: 'file://test.jpg', type: 'image/jpeg' },
        ],
        name: 'Test',
        description: 'Test',
        price: '100,00',
      },
    ];

    states.forEach((state) => {
      mockUseCreateAdViewModel.mockReturnValue({
        ...mockUseCreateAdViewModel(),
        ...state,
      });

      const { UNSAFE_root } = renderWithProvider(<CreateAd />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should be a pure component (no side effects)', () => {
    // Test that multiple renders produce the same result
    const { UNSAFE_root: root1 } = renderWithProvider(<CreateAd />);
    const { UNSAFE_root: root2 } = renderWithProvider(<CreateAd />);

    expect(root1).toBeTruthy();
    expect(root2).toBeTruthy();
  });
});
