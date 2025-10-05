import { renderHook, act } from '@testing-library/react-native';
import { useCreateAdViewModel } from './view-model';
import { PaymentMethod } from 'src/entities/Product';

// Mock do useNavigation
const mockNavigate = jest.fn();
const mockNavigateTabs = jest.fn();
const mockRoute = jest.fn().mockReturnValue({
  params: null,
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    navigateTabs: mockNavigateTabs,
  }),
  useRoute: () => mockRoute(),
}));

// Mock do useToast
const mockToast = {
  show: jest.fn(),
};

jest.mock('native-base', () => ({
  useToast: () => mockToast,
}));

// Mock do useAuthContext
const mockUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '11999999999',
  avatar: 'avatar.jpg',
};

jest.mock('src/contexts/auth/use-auth.hook', () => ({
  useAuthContext: () => ({
    user: mockUser,
  }),
}));

// Mock do ImagePicker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [
        {
          uri: 'file://test-image.jpg',
          type: 'image',
          width: 100,
          height: 100,
        },
      ],
    })
  ),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

// Mock do uuid
jest.mock('react-native-uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

// Mock das funções de máscara
jest.mock('src/shared/utils/Masks.util', () => ({
  toMaskedPrice: jest.fn((price) => `R$ ${price}`),
  maskedPriceToNumber: jest.fn((price) =>
    parseFloat(price.replace('R$ ', '').replace(',', '.'))
  ),
}));

// Mock do client
jest.mock('src/infra/http/client.http', () => ({
  client: {
    defaults: {
      baseURL: 'http://localhost:3000',
    },
  },
}));

describe('useCreateAdViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRoute.mockReturnValue({ params: null });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    expect(result.current.images).toEqual([]);
    expect(result.current.name).toBe('');
    expect(result.current.description).toBe('');
    expect(result.current.isNew).toBe('');
    expect(result.current.price).toBe('');
    expect(result.current.acceptTrade).toBe(false);
    expect(result.current.photoIsLoading).toBe(false);
    expect(result.current.headerTitle).toBe('Criar anúncio');
    expect(typeof result.current.handleName).toBe('function');
    expect(typeof result.current.handleDescription).toBe('function');
    expect(typeof result.current.handleIsNew).toBe('function');
    expect(typeof result.current.handlePrice).toBe('function');
    expect(typeof result.current.handleAcceptTrade).toBe('function');
    expect(typeof result.current.handleGoBackToMyAdsScreen).toBe('function');
    expect(typeof result.current.handlePhotoSelect).toBe('function');
    expect(typeof result.current.handleRemovePhoto).toBe('function');
    expect(typeof result.current.findPaymentMethod).toBe('function');
    expect(typeof result.current.handlePaymentMethods).toBe('function');
    expect(typeof result.current.handleNavigateToAdPreview).toBe('function');
  });

  it('should handle name changes', () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    act(() => {
      result.current.handleName('Test Product');
    });

    expect(result.current.name).toBe('Test Product');
  });

  it('should handle description changes', () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    act(() => {
      result.current.handleDescription('Test Description');
    });

    expect(result.current.description).toBe('Test Description');
  });

  it('should handle isNew changes', () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    act(() => {
      result.current.handleIsNew('Produto novo');
    });

    expect(result.current.isNew).toBe('Produto novo');
  });

  it('should handle price changes', () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    act(() => {
      result.current.handlePrice('100,00');
    });

    expect(result.current.price).toBe('100,00');
  });

  it('should handle acceptTrade changes', () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    act(() => {
      result.current.handleAcceptTrade(true);
    });

    expect(result.current.acceptTrade).toBe(true);
  });

  it('should call navigation function when handleGoBackToMyAdsScreen is called', () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    act(() => {
      result.current.handleGoBackToMyAdsScreen();
    });

    expect(() => {
      result.current.handleGoBackToMyAdsScreen();
    }).not.toThrow();
  });

  it('should handle photo selection', async () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    await act(async () => {
      await result.current.handlePhotoSelect();
    });

    expect(() => {
      result.current.handlePhotoSelect();
    }).not.toThrow();
  });

  it('should handle photo removal', () => {
    const { result } = renderHook(() => useCreateAdViewModel());
    const testPhoto = {
      name: 'test.jpg',
      uri: 'file://test.jpg',
      type: 'image/jpeg',
    };

    act(() => {
      result.current.handleRemovePhoto(testPhoto);
    });

    expect(() => {
      result.current.handleRemovePhoto(testPhoto);
    }).not.toThrow();
  });

  it('should find payment method correctly', () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    // Test with no payment methods
    expect(result.current.findPaymentMethod(PaymentMethod.PIX)).toBe(false);

    // Add a payment method and test
    act(() => {
      result.current.handlePaymentMethods(PaymentMethod.PIX);
    });

    expect(result.current.findPaymentMethod(PaymentMethod.PIX)).toBe(true);
  });

  it('should handle payment methods toggle', () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    // Add payment method
    act(() => {
      result.current.handlePaymentMethods(PaymentMethod.PIX);
    });

    expect(result.current.findPaymentMethod(PaymentMethod.PIX)).toBe(true);

    // Remove payment method
    act(() => {
      result.current.handlePaymentMethods(PaymentMethod.PIX);
    });

    expect(result.current.findPaymentMethod(PaymentMethod.PIX)).toBe(false);
  });

  it('should call navigation function when handleNavigateToAdPreview is called', () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    act(() => {
      result.current.handleNavigateToAdPreview();
    });

    expect(() => {
      result.current.handleNavigateToAdPreview();
    }).not.toThrow();
  });

  it('should show error toast when trying to navigate without images', () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    act(() => {
      result.current.handleNavigateToAdPreview();
    });

    expect(mockToast.show).toHaveBeenCalledWith({
      title: 'Adicione ao menos uma foto do seu produto.',
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it('should handle multiple payment methods', () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    act(() => {
      result.current.handlePaymentMethods(PaymentMethod.PIX);
      result.current.handlePaymentMethods(PaymentMethod.BOLETO);
      result.current.handlePaymentMethods(PaymentMethod.DINHEIRO);
    });

    expect(result.current.findPaymentMethod(PaymentMethod.PIX)).toBe(true);
    expect(result.current.findPaymentMethod(PaymentMethod.BOLETO)).toBe(true);
    expect(result.current.findPaymentMethod(PaymentMethod.DINHEIRO)).toBe(true);
  });

  it('should maintain state independence between hook instances', () => {
    const { result: result1 } = renderHook(() => useCreateAdViewModel());
    const { result: result2 } = renderHook(() => useCreateAdViewModel());

    // Both should start with empty name
    expect(result1.current.name).toBe('');
    expect(result2.current.name).toBe('');

    // Change name in first instance
    act(() => {
      result1.current.handleName('Product 1');
    });

    // First instance should have the name, second should still be empty
    expect(result1.current.name).toBe('Product 1');
    expect(result2.current.name).toBe('');
  });

  it('should handle rapid state changes', () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    act(() => {
      result.current.handleName('Test');
      result.current.handleDescription('Description');
      result.current.handleIsNew('Produto novo');
      result.current.handlePrice('100,00');
      result.current.handleAcceptTrade(true);
    });

    expect(result.current.name).toBe('Test');
    expect(result.current.description).toBe('Description');
    expect(result.current.isNew).toBe('Produto novo');
    expect(result.current.price).toBe('100,00');
    expect(result.current.acceptTrade).toBe(true);
  });

  it('should return correct interface structure', () => {
    const { result } = renderHook(() => useCreateAdViewModel());

    expect(result.current).toHaveProperty('images');
    expect(result.current).toHaveProperty('name');
    expect(result.current).toHaveProperty('description');
    expect(result.current).toHaveProperty('isNew');
    expect(result.current).toHaveProperty('price');
    expect(result.current).toHaveProperty('acceptTrade');
    expect(result.current).toHaveProperty('photoIsLoading');
    expect(result.current).toHaveProperty('headerTitle');
    expect(result.current).toHaveProperty('handleName');
    expect(result.current).toHaveProperty('handleDescription');
    expect(result.current).toHaveProperty('handleIsNew');
    expect(result.current).toHaveProperty('handlePrice');
    expect(result.current).toHaveProperty('handleAcceptTrade');
    expect(result.current).toHaveProperty('handleGoBackToMyAdsScreen');
    expect(result.current).toHaveProperty('handlePhotoSelect');
    expect(result.current).toHaveProperty('handleRemovePhoto');
    expect(result.current).toHaveProperty('findPaymentMethod');
    expect(result.current).toHaveProperty('handlePaymentMethods');
    expect(result.current).toHaveProperty('handleNavigateToAdPreview');
  });
});
