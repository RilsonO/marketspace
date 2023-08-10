import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useHomeViewModel } from './view-model';
import { useAuthViewModel } from '@hooks/use-auth.hook';
import { ProductDTO, UserProductResponseDTO } from '@dtos/product.dtos';
import { IPaymentMethods } from 'src/interfaces/payment-methods.interface';
import { useToast } from 'native-base';
import { AppError } from '@utils/AppError.util';
import * as productRepository from '@infra/http/repositories/product.repository';

jest.mock('@hooks/use-auth.hook');
jest.mock('native-base');

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
    useFocusEffect: jest.fn(),
  };
});

jest.mock('@infra/http/repositories/product.repository', () => ({
  fetchProducts: jest.fn(() => Promise.resolve([] as ProductDTO[])),
}));

describe('Home view-model [useHomeViewModel]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const toastShowMock = jest.fn();
  (useToast as jest.Mock).mockReturnValue({
    show: toastShowMock,
  });

  it('should return the correct initial values', async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });
    const { result } = renderHook(() => useHomeViewModel());

    expect(result.current.user).toEqual(
      expect.objectContaining({
        name: 'John Doe',
      })
    );
    expect(result.current.isFetchLoading).toBeTruthy();
    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.data).toEqual([]);
    expect(result.current.isNew).toBeNull();
    expect(result.current.acceptTrade).toBeNull();
    expect(result.current.search).toEqual('');
    expect(result.current.modalizeRef).toEqual(
      expect.objectContaining({
        current: null,
      })
    );
    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });
  });

  it('should call handleOpenCreateAd and navigate to createAd screen', async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });
    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });

    await act(async () => {
      await result.current.handleOpenCreateAd();
    });

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith('createAd');
  });

  it(`should update search state when onChangeSearch is called with the value
      has passed by parameter`, async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });

    const searchText = 'search for this';
    await act(async () => {
      await result.current.onChangeSearch(searchText);
      await waitFor(() => expect(result.current.search).toEqual(searchText));
    });
  });

  it(`should toggle acceptTrade`, async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });

    expect(result.current.acceptTrade).toBeNull();

    await act(async () => {
      await result.current.onToggleAcceptTrade();
      await waitFor(() => expect(result.current.acceptTrade).toBe(true));
    });

    await act(async () => {
      await result.current.onToggleAcceptTrade();
      await waitFor(() => expect(result.current.acceptTrade).toBe(false));
    });
  });

  it(`should call handleIsNew`, async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });

    expect(result.current.isNew).toBeNull();

    await act(async () => {
      await result.current.handleIsNew(true);
      await waitFor(() => expect(result.current.isNew).toBeTruthy());
    });

    await act(async () => {
      await result.current.handleIsNew(false);
      await waitFor(() => expect(result.current.isNew).toBeFalsy());
    });
  });

  it('should call handleNavigateToMyAds and navigate to myAds screen', async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });

    await act(async () => {
      await result.current.handleNavigateToMyAds();
    });

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith('myAds');
  });

  it('should call countActiveAds and return the count number', async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });

    await act(async () => {
      const activeAds = await result.current.countActiveAds();
      expect(activeAds).toEqual(result.current.user.products.length);
    });
  });

  it('should call findPaymentMethod and return true if the payment method exists', async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });

    await act(async () => {
      const existMethod = await result.current.findPaymentMethod('boleto');
      expect(existMethod).toBeFalsy();
    });

    await act(async () => {
      const existMethod = await result.current.findPaymentMethod('pix');
      expect(existMethod).toBeFalsy();
    });

    await act(async () => {
      const existMethod = await result.current.findPaymentMethod('card');
      expect(existMethod).toBeFalsy();
    });

    await act(async () => {
      const existMethod = await result.current.findPaymentMethod('cash');
      expect(existMethod).toBeFalsy();
    });

    await act(async () => {
      const existMethod = await result.current.findPaymentMethod('deposit');
      expect(existMethod).toBeFalsy();
    });
  });

  it('should call handlePaymentMethods and add or remove a payment method', async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });

    const paymentMethods: IPaymentMethods[] = [
      'pix',
      'boleto',
      'card',
      'deposit',
      'cash',
    ];

    act(() => {
      result.current.handlePaymentMethods(paymentMethods[0]);
    });
    await act(async () => {
      await waitFor(
        () => result.current.findPaymentMethod(paymentMethods[0]) === true
      );
    });
    expect(result.current.findPaymentMethod(paymentMethods[0])).toBeTruthy();

    act(() => {
      result.current.handlePaymentMethods(paymentMethods[1]);
    });
    await act(async () => {
      await waitFor(
        () => result.current.findPaymentMethod(paymentMethods[1]) === true
      );
    });
    expect(result.current.findPaymentMethod(paymentMethods[1])).toBeTruthy();

    act(() => {
      result.current.handlePaymentMethods(paymentMethods[2]);
    });
    await act(async () => {
      await waitFor(
        () => result.current.findPaymentMethod(paymentMethods[2]) === true
      );
    });
    expect(result.current.findPaymentMethod(paymentMethods[2])).toBeTruthy();

    act(() => {
      result.current.handlePaymentMethods(paymentMethods[3]);
    });
    await act(async () => {
      await waitFor(
        () => result.current.findPaymentMethod(paymentMethods[3]) === true
      );
    });
    expect(result.current.findPaymentMethod(paymentMethods[3])).toBeTruthy();

    act(() => {
      result.current.handlePaymentMethods(paymentMethods[4]);
    });
    await act(async () => {
      await waitFor(
        () => result.current.findPaymentMethod(paymentMethods[4]) === true
      );
    });
    expect(result.current.findPaymentMethod(paymentMethods[4])).toBeTruthy();
  });

  it('should call handleResetFilters and reset all filters', async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });

    await act(async () => {
      await result.current.onToggleAcceptTrade();
      await waitFor(() => expect(result.current.acceptTrade).toBe(true));
    });

    await act(async () => {
      await result.current.handleIsNew(true);
      await waitFor(() => expect(result.current.isNew).toBe(true));
    });

    const paymentMethod: IPaymentMethods = 'pix';

    act(() => {
      result.current.handlePaymentMethods(paymentMethod);
    });
    await act(async () => {
      await waitFor(
        () => result.current.findPaymentMethod(paymentMethod) === true
      );
    });
    expect(result.current.findPaymentMethod(paymentMethod)).toBeTruthy();

    await act(async () => {
      await result.current.handleResetFilters();
      await waitFor(() => expect(result.current.acceptTrade).toBeNull());
      await waitFor(() => expect(result.current.isNew).toBeNull());
      await waitFor(
        () => result.current.findPaymentMethod(paymentMethod) === false
      );
    });
  });

  it('should call fetchProducts on fetchFilteredProducts and set isLoading to true', async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });

    await act(async () => {
      await result.current.fetchFilteredProducts();
      await waitFor(() => expect(result.current.isLoading).toBeTruthy());
    });

    await act(async () => {
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    });
  });

  it('should show an error toast on fetchFilteredProducts in error case', async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const fetchProductsMock = jest.spyOn(productRepository, 'fetchProducts');
    fetchProductsMock.mockRejectedValueOnce(new Error('Some error message'));

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });

    await act(async () => {
      await result.current.fetchFilteredProducts();
    });

    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });

    expect(toastShowMock).toHaveBeenCalledWith({
      title: 'Não foi possível carregar o anúncio. Tente novamente mais tarde.',
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it('should show an error toast on fetchFilteredProducts in case of AppError', async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const mockAppError = new AppError('AppError message');
    const fetchProductsMock = jest.spyOn(productRepository, 'fetchProducts');
    fetchProductsMock.mockRejectedValueOnce(mockAppError);

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });

    await act(async () => {
      await result.current.fetchFilteredProducts();
    });

    await act(async () => {
      await waitFor(() => result.current.isLoading === false);
    });

    expect(toastShowMock).toHaveBeenCalledWith({
      title: mockAppError.message,
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it(`should show an error toast on fetchUserData in error case, caused by
      updateProfile exception`, async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
      updateProfile: async () => {
        throw new Error('Some error');
      },
      fetchProducts: async () => {
        return [] as UserProductResponseDTO[];
      },
    } as unknown;

    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const toastShowMock = jest.fn();
    (useToast as jest.Mock).mockReturnValueOnce({
      show: toastShowMock,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      result.current.fetchUserData();
      await waitFor(() => result.current.isLoading === true);
      await waitFor(() => result.current.isFetchLoading === true);
      await waitFor(() => result.current.isLoading === false);
      await waitFor(() => result.current.isFetchLoading === false);
    });

    expect(toastShowMock).toHaveBeenCalledWith({
      title:
        'Não foi possível atualizar seus dados. Tente novamente mais tarde.',
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it(`should show an error toast on fetchUserData in error case, caused by
      fetchProducts exception`, async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
      updateProfile: async () => {},
      fetchProducts: async () => {
        throw new Error('Some error');
      },
    } as unknown;

    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const toastShowMock = jest.fn();
    (useToast as jest.Mock).mockReturnValueOnce({
      show: toastShowMock,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      result.current.fetchUserData();
      await waitFor(() => result.current.isLoading === true);
      await waitFor(() => result.current.isFetchLoading === true);
      await waitFor(() => result.current.isLoading === false);
      await waitFor(() => result.current.isFetchLoading === false);
    });

    expect(toastShowMock).toHaveBeenCalledWith({
      title:
        'Não foi possível atualizar seus dados. Tente novamente mais tarde.',
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it(`should show an error toast on fetchUserData in case of AppError, caused by
      updateProfile exception`, async () => {
    const mockAppError = new AppError('AppError message');
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
      updateProfile: async () => {
        throw mockAppError;
      },
      fetchProducts: async () => {
        return [] as UserProductResponseDTO[];
      },
    } as unknown;

    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const toastShowMock = jest.fn();
    (useToast as jest.Mock).mockReturnValueOnce({
      show: toastShowMock,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      result.current.fetchUserData();
      await waitFor(() => result.current.isLoading === true);
      await waitFor(() => result.current.isFetchLoading === true);
      await waitFor(() => result.current.isLoading === false);
      await waitFor(() => result.current.isFetchLoading === false);
    });

    expect(toastShowMock).toHaveBeenCalledWith({
      title: mockAppError.message,
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it(`should show an error toast on fetchUserData in case of AppError, caused by
      fetchProducts exception`, async () => {
    const mockAppError = new AppError('AppError message');
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
      updateProfile: async () => {},
      fetchProducts: async () => {
        throw mockAppError;
        return [] as UserProductResponseDTO[];
      },
    } as unknown;

    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const toastShowMock = jest.fn();
    (useToast as jest.Mock).mockReturnValueOnce({
      show: toastShowMock,
    });

    const { result } = renderHook(() => useHomeViewModel());

    await act(async () => {
      result.current.fetchUserData();
      await waitFor(() => result.current.isLoading === true);
      await waitFor(() => result.current.isFetchLoading === true);
      await waitFor(() => result.current.isLoading === false);
      await waitFor(() => result.current.isFetchLoading === false);
    });

    expect(toastShowMock).toHaveBeenCalledWith({
      title: mockAppError.message,
      placement: 'top',
      bgColor: 'red.500',
    });
  });
});
