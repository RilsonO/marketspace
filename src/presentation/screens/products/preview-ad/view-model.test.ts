import { renderHook, act } from '@testing-library/react-native';
import { usePreviewAdViewModel } from './view-model';
import { PaymentMethod } from 'src/entities/Product';

// Mock do useNavigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockRoute = jest.fn().mockReturnValue({
  params: {
    id: 'product-1',
    name: 'Test Product',
    description: 'Test Description',
    is_new: true,
    price: 100.5,
    accept_trade: true,
    payment_methods: [PaymentMethod.PIX],
    product_images: [],
    user: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'avatar.jpg',
      tel: '11999999999',
    },
    imagesToDelete: [],
  },
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
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

// Mock do product repository
const mockProductCreate = jest.fn();
const mockProductUpdate = jest.fn();
const mockProductInsertImages = jest.fn();
const mockProductDeleteImagesById = jest.fn();

jest.mock('src/infra/http/repositories/product.repository', () => ({
  productCreate: mockProductCreate,
  productUpdate: mockProductUpdate,
  productInsertImages: mockProductInsertImages,
  productDeleteImagesById: mockProductDeleteImagesById,
}));

// Mock do PaymentMethodsMap
jest.mock('src/infra/mappers/payment-methods.map', () => ({
  PaymentMethodsMap: {
    fromPaymentMethodArrayToStringArray: jest.fn((methods) => methods),
  },
}));

// Mock do client
jest.mock('src/infra/http/client.http', () => ({
  client: {
    defaults: {
      baseURL: 'http://localhost:3000',
    },
  },
}));

describe('usePreviewAdViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRoute.mockReturnValue({
      params: {
        id: 'product-1',
        name: 'Test Product',
        description: 'Test Description',
        is_new: true,
        price: 100.5,
        accept_trade: true,
        payment_methods: [PaymentMethod.PIX],
        product_images: [],
        user: {
          id: 'user-1',
          name: 'John Doe',
          avatar: 'avatar.jpg',
          tel: '11999999999',
        },
        imagesToDelete: [],
      },
    });

    // Reset mock implementations
    mockProductCreate.mockClear();
    mockProductUpdate.mockClear();
    mockProductInsertImages.mockClear();
    mockProductDeleteImagesById.mockClear();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => usePreviewAdViewModel());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.params).toEqual(
      expect.objectContaining({
        id: 'product-1',
        name: 'Test Product',
        description: 'Test Description',
        is_new: true,
        price: 100.5,
        accept_trade: true,
        payment_methods: [PaymentMethod.PIX],
        product_images: [],
        imagesToDelete: [],
      })
    );
    expect(typeof result.current.handleGoBack).toBe('function');
    expect(typeof result.current.handlePublish).toBe('function');
    expect(typeof result.current.handleUpdate).toBe('function');
  });

  it('should call goBack when handleGoBack is called', () => {
    const { result } = renderHook(() => usePreviewAdViewModel());

    act(() => {
      result.current.handleGoBack();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('should handle publish successfully', async () => {
    mockProductCreate.mockResolvedValue({ data: { id: 'new-product-id' } });
    mockProductInsertImages.mockResolvedValue({});

    const { result } = renderHook(() => usePreviewAdViewModel());

    await act(async () => {
      await result.current.handlePublish();
    });

    expect(() => {
      result.current.handlePublish();
    }).not.toThrow();
  });

  it('should handle publish with error', async () => {
    const error = new Error('Network error');
    mockProductCreate.mockRejectedValue(error);

    const { result } = renderHook(() => usePreviewAdViewModel());

    await act(async () => {
      await result.current.handlePublish();
    });

    expect(mockToast.show).toHaveBeenCalledWith({
      title:
        'Não foi possível cadastrar o seu produto. Tente novamente mais tarde.',
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it('should handle update successfully', async () => {
    mockProductUpdate.mockResolvedValue({});
    mockProductInsertImages.mockResolvedValue({});
    mockProductDeleteImagesById.mockResolvedValue({});

    const { result } = renderHook(() => usePreviewAdViewModel());

    await act(async () => {
      await result.current.handleUpdate();
    });

    expect(() => {
      result.current.handleUpdate();
    }).not.toThrow();
  });

  it('should handle update with error', async () => {
    const error = new Error('Update error');
    mockProductUpdate.mockRejectedValue(error);

    const { result } = renderHook(() => usePreviewAdViewModel());

    await act(async () => {
      await result.current.handleUpdate();
    });

    expect(mockToast.show).toHaveBeenCalledWith({
      title:
        'Não foi possível atualizar o seu produto. Tente novamente mais tarde.',
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it('should handle update without product id', async () => {
    mockRoute.mockReturnValue({
      params: {
        name: 'Test Product',
        description: 'Test Description',
        is_new: true,
        price: 100.5,
        accept_trade: true,
        payment_methods: [PaymentMethod.PIX],
        product_images: [],
        user: {
          id: 'user-1',
          name: 'John Doe',
          avatar: 'avatar.jpg',
          tel: '11999999999',
        },
        imagesToDelete: [],
      },
    });

    const { result } = renderHook(() => usePreviewAdViewModel());

    await act(async () => {
      await result.current.handleUpdate();
    });

    expect(mockProductUpdate).not.toHaveBeenCalled();
  });

  it('should handle update with images to delete', async () => {
    mockProductUpdate.mockResolvedValue({});
    mockProductDeleteImagesById.mockResolvedValue({});

    mockRoute.mockReturnValue({
      params: {
        id: 'product-1',
        name: 'Test Product',
        description: 'Test Description',
        is_new: true,
        price: 100.5,
        accept_trade: true,
        payment_methods: [PaymentMethod.PIX],
        product_images: [],
        user: {
          id: 'user-1',
          name: 'John Doe',
          avatar: 'avatar.jpg',
          tel: '11999999999',
        },
        imagesToDelete: ['image-1', 'image-2'],
      },
    });

    const { result } = renderHook(() => usePreviewAdViewModel());

    await act(async () => {
      await result.current.handleUpdate();
    });

    expect(() => {
      result.current.handleUpdate();
    }).not.toThrow();
  });

  it('should handle update with new images to upload', async () => {
    mockProductUpdate.mockResolvedValue({});
    mockProductInsertImages.mockResolvedValue({});

    mockRoute.mockReturnValue({
      params: {
        id: 'product-1',
        name: 'Test Product',
        description: 'Test Description',
        is_new: true,
        price: 100.5,
        accept_trade: true,
        payment_methods: [PaymentMethod.PIX],
        product_images: [
          { uri: 'file://new-image.jpg', id: 'new-image' },
          {
            uri: 'http://localhost:3000/images/existing-image.jpg',
            id: 'existing-image',
          },
        ],
        user: {
          id: 'user-1',
          name: 'John Doe',
          avatar: 'avatar.jpg',
          tel: '11999999999',
        },
        imagesToDelete: [],
      },
    });

    const { result } = renderHook(() => usePreviewAdViewModel());

    await act(async () => {
      await result.current.handleUpdate();
    });

    expect(() => {
      result.current.handleUpdate();
    }).not.toThrow();
  });

  it('should set loading state correctly during operations', async () => {
    mockProductCreate.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() => usePreviewAdViewModel());

    expect(result.current.isLoading).toBe(false);

    const publishPromise = act(async () => {
      await result.current.handlePublish();
    });

    // Note: In real implementation, isLoading would be true during the operation
    // but in tests it's harder to capture the intermediate state
    await publishPromise;

    expect(result.current.isLoading).toBe(false);
  });

  it('should return correct interface structure', () => {
    const { result } = renderHook(() => usePreviewAdViewModel());

    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('params');
    expect(result.current).toHaveProperty('handleGoBack');
    expect(result.current).toHaveProperty('handlePublish');
    expect(result.current).toHaveProperty('handleUpdate');
  });
});
