import { render } from '@testing-library/react-native';
import { PreviewAd } from './view';
import { usePreviewAdViewModel } from './view-model';
import { PaymentMethod } from 'src/entities/Product';

// Mock do usePreviewAdViewModel
const mockUsePreviewAdViewModel = jest.fn();
jest.mock('./view-model', () => ({
  usePreviewAdViewModel: () => mockUsePreviewAdViewModel(),
}));

// Mock do useTheme
jest.mock('native-base', () => ({
  useTheme: () => ({
    colors: {
      gray: {
        100: '#F7FAFC',
        200: '#EDF2F7',
        600: '#4A5568',
      },
    },
    sizes: {
      4: 16,
    },
  }),
  VStack: ({ children }: any) => children,
  HStack: ({ children }: any) => children,
  Text: ({ children }: any) => children,
  Button: ({ children }: any) => children,
}));

// Mock dos ícones
jest.mock('phosphor-react-native', () => ({
  ArrowLeft: () => null,
  Tag: () => null,
}));

// Mock do AdDetails
jest.mock('../../../components/ad-details/view', () => ({
  AdDetails: () => null,
}));

const mockParams = {
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
};

describe('PreviewAd Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePreviewAdViewModel.mockReturnValue({
      isLoading: false,
      params: mockParams,
      handleGoBack: jest.fn(),
      handlePublish: jest.fn(),
      handleUpdate: jest.fn(),
    });
  });

  it('should render without crashing', () => {
    const { UNSAFE_root } = render(<PreviewAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with default props', () => {
    const { UNSAFE_root } = render(<PreviewAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle loading state', () => {
    mockUsePreviewAdViewModel.mockReturnValue({
      isLoading: true,
      params: mockParams,
      handleGoBack: jest.fn(),
      handlePublish: jest.fn(),
      handleUpdate: jest.fn(),
    });

    const { UNSAFE_root } = render(<PreviewAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle new product (without id)', () => {
    mockUsePreviewAdViewModel.mockReturnValue({
      isLoading: false,
      params: { ...mockParams, id: undefined },
      handleGoBack: jest.fn(),
      handlePublish: jest.fn(),
      handleUpdate: jest.fn(),
    });

    const { UNSAFE_root } = render(<PreviewAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle existing product (with id)', () => {
    mockUsePreviewAdViewModel.mockReturnValue({
      isLoading: false,
      params: mockParams,
      handleGoBack: jest.fn(),
      handlePublish: jest.fn(),
      handleUpdate: jest.fn(),
    });

    const { UNSAFE_root } = render(<PreviewAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle different product states', () => {
    const { rerender } = render(<PreviewAd />);
    expect(render(<PreviewAd />).UNSAFE_root).toBeTruthy();

    // Test with used product
    mockUsePreviewAdViewModel.mockReturnValue({
      isLoading: false,
      params: { ...mockParams, is_new: false },
      handleGoBack: jest.fn(),
      handlePublish: jest.fn(),
      handleUpdate: jest.fn(),
    });

    rerender(<PreviewAd />);
    expect(render(<PreviewAd />).UNSAFE_root).toBeTruthy();
  });

  it('should handle products with different payment methods', () => {
    mockUsePreviewAdViewModel.mockReturnValue({
      isLoading: false,
      params: {
        ...mockParams,
        payment_methods: [PaymentMethod.PIX, PaymentMethod.BOLETO],
      },
      handleGoBack: jest.fn(),
      handlePublish: jest.fn(),
      handleUpdate: jest.fn(),
    });

    const { UNSAFE_root } = render(<PreviewAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle products with different trade acceptance', () => {
    mockUsePreviewAdViewModel.mockReturnValue({
      isLoading: false,
      params: { ...mockParams, accept_trade: false },
      handleGoBack: jest.fn(),
      handlePublish: jest.fn(),
      handleUpdate: jest.fn(),
    });

    const { UNSAFE_root } = render(<PreviewAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle products with images to delete', () => {
    mockUsePreviewAdViewModel.mockReturnValue({
      isLoading: false,
      params: {
        ...mockParams,
        imagesToDelete: ['image-1', 'image-2'],
      },
      handleGoBack: jest.fn(),
      handlePublish: jest.fn(),
      handleUpdate: jest.fn(),
    });

    const { UNSAFE_root } = render(<PreviewAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle products without user avatar', () => {
    mockUsePreviewAdViewModel.mockReturnValue({
      isLoading: false,
      params: {
        ...mockParams,
        user: { ...mockParams.user, avatar: null },
      },
      handleGoBack: jest.fn(),
      handlePublish: jest.fn(),
      handleUpdate: jest.fn(),
    });

    const { UNSAFE_root } = render(<PreviewAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle empty product images', () => {
    mockUsePreviewAdViewModel.mockReturnValue({
      isLoading: false,
      params: { ...mockParams, product_images: [] },
      handleGoBack: jest.fn(),
      handlePublish: jest.fn(),
      handleUpdate: jest.fn(),
    });

    const { UNSAFE_root } = render(<PreviewAd />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle multiple product images', () => {
    mockUsePreviewAdViewModel.mockReturnValue({
      isLoading: false,
      params: {
        ...mockParams,
        product_images: [
          { id: 'img1', path: 'image1.jpg' },
          { id: 'img2', path: 'image2.jpg' },
          { id: 'img3', path: 'image3.jpg' },
        ],
      },
      handleGoBack: jest.fn(),
      handlePublish: jest.fn(),
      handleUpdate: jest.fn(),
    });

    const { UNSAFE_root } = render(<PreviewAd />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
