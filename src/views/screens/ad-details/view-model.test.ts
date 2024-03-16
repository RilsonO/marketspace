import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAdDetailsViewModel } from './view-model';
import { useAuthViewModel } from '@hooks/use-auth.hook';
import { ProductDetailDTO } from '@dtos/product.dtos';
import { useToast } from 'native-base';
import * as productRepository from '@infra/http/repositories/product.repository';
import { Linking } from 'react-native';
import { unMask } from '@utils/Masks.util';

jest.mock('@hooks/use-auth.hook');
jest.mock('native-base');

const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();
const mockedRoute = jest.fn().mockReturnValue({
  params: { id: '123' },
});
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
      goBack: mockedGoBack,
    }),
    useRoute: () => mockedRoute(),
  };
});

const defaultMockedUser = {
  id: 'user-1',
  name: 'John Doe',
  avatar: null,
  products: [],
} as unknown;

const defaultMockedProductResponse = {
  id: '1',
  name: 'Product 1',
  description: 'Description 1',
  is_new: true,
  price: 100,
  accept_trade: false,
  user_id: 'user-1',
  is_active: true,
  product_images: [],
  payment_methods: [],
  created_at: '2024-03-14T17:47:56Z',
  updated_at: '2024-03-14T17:47:56Z',
  user: {
    avatar: 'avatar-url-1',
    name: 'John Doe',
    tel: '99999999999',
  },
} as ProductDetailDTO;

const regularMockedProductResponse = {
  id: '2',
  name: 'Regular product',
  price: 200,
  is_new: true,
  accept_trade: false,
  description: 'Description of regular product',
  is_active: true,
  payment_methods: [],
  product_images: [],
  user_id: 'user-2',
  created_at: '2024-03-14T17:47:56Z',
  updated_at: '2024-03-14T17:47:56Z',
  user: {
    avatar: 'avatar-url-1',
    name: 'John Doe',
    tel: '99999999999',
  },
} as ProductDetailDTO;

describe('Home view-model [useAdDetailsViewModel]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const toastShowMock = jest.fn();
  (useToast as jest.Mock).mockReturnValue({
    show: toastShowMock,
  });

  it('should return the correct initial values', async () => {
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });
    const { result } = renderHook(() => useAdDetailsViewModel());

    expect(result.current.user).toEqual(
      expect.objectContaining({
        name: 'John Doe',
      })
    );
    expect(result.current.isDeleting).toBeFalsy();
    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.isUpdating).toBeFalsy();
    expect(result.current.product).toBeNull();
    expect(result.current.is_active).toBeTruthy();
  });

  it('should call handleGoBack and navigate to myAds screen', async () => {
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });
    jest
      .spyOn(productRepository, 'fetchProductById')
      .mockResolvedValue(defaultMockedProductResponse);
    const { result } = renderHook(() => useAdDetailsViewModel());

    await act(async () => {
      await result.current.fetchProduct();
      await waitFor(() => result.current.isLoading === false);
    });

    await act(async () => {
      result.current.handleGoBack();
      await waitFor(() => {
        expect(mockedNavigate).toBeCalledWith('myAds');
      });
    });
  });

  it('should call handleGoBack and goBack', async () => {
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });
    jest
      .spyOn(productRepository, 'fetchProductById')
      .mockResolvedValue(regularMockedProductResponse);
    const { result } = renderHook(() => useAdDetailsViewModel());

    await act(async () => {
      await result.current.fetchProduct();
      await waitFor(() => result.current.isLoading === false);
    });

    await act(async () => {
      result.current.handleGoBack();
      await waitFor(() => {
        expect(mockedGoBack).toBeCalled();
      });
    });
  });

  it('should call handleNavigateToEditAd and navigate to createAd screen', async () => {
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });
    jest
      .spyOn(productRepository, 'fetchProductById')
      .mockResolvedValue(regularMockedProductResponse);
    const { result } = renderHook(() => useAdDetailsViewModel());

    await act(async () => {
      await result.current.fetchProduct();
      await waitFor(() => result.current.isLoading === false);
    });

    await act(async () => {
      result.current.handleNavigateToEditAd();
      await waitFor(() => {
        expect(mockedNavigate).toBeCalledWith(
          'createAd',
          result.current.product
        );
      });
    });
  });

  it('deve chamar handleOpenWhatsApp e abrir o WhatsApp', async () => {
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    const mockedLinkingOpenURL = jest.spyOn(Linking, 'openURL');
    mockedLinkingOpenURL.mockResolvedValue(Promise.resolve());
    jest
      .spyOn(productRepository, 'fetchProductById')
      .mockResolvedValue(regularMockedProductResponse);

    const { result } = renderHook(() => useAdDetailsViewModel());

    await act(async () => {
      await result.current.fetchProduct();
      await waitFor(() => result.current.isLoading === false);
    });

    await act(async () => {
      await result.current.handleOpenWhatsApp();
      const phoneNumber = result.current.product!.user.tel;
      const url = `https://wa.me/55${unMask(phoneNumber)}`;
      await waitFor(() => {
        expect(mockedLinkingOpenURL).toHaveBeenCalledWith(url);
        expect(Linking.canOpenURL).toHaveBeenCalledWith(url);
      });
    });
  });

  it('should show an error toast on handleOpenWhatsApp  in case of invalid number', async () => {
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    jest
      .spyOn(productRepository, 'fetchProductById')
      .mockResolvedValue(regularMockedProductResponse);

    const { result } = renderHook(() => useAdDetailsViewModel());

    await act(async () => {
      await result.current.fetchProduct();
      await waitFor(() => result.current.isLoading === false);
    });

    await act(async () => {
      await result.current.handleOpenWhatsApp();
      const phoneNumber = result.current.product!.user.tel;
      const url = `https://wa.me/55${unMask(phoneNumber)}`;
      await waitFor(() => {
        expect(Linking.canOpenURL).toHaveBeenCalledWith(url);
      });
    });

    expect(toastShowMock).toHaveBeenCalledWith({
      title:
        'Não foi possível contactar o vendedor. Tente novamente mais tarde.',
      placement: 'top',
      bgColor: 'red.500',
    });
  });
});
