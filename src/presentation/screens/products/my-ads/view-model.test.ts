import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useMyAdsViewModel } from './view-model';
import { useAuthContext } from '../../../../contexts/auth/use-auth.hook';
import { container } from '../../../../main/container/DIContainer';

jest.mock('../../../../contexts/auth/use-auth.hook');
jest.mock('native-base', () => ({
  useToast: () => ({
    show: jest.fn(),
  }),
}));
jest.mock('../../../../main/container/DIContainer', () => ({
  container: {
    get: jest.fn(),
  },
}));

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

describe('MyAds view-model [useMyAdsViewModel]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct initial values', async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthContext as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });
    const { result } = renderHook(() => useMyAdsViewModel());

    expect(result.current.user).toEqual(
      expect.objectContaining({
        name: 'John Doe',
      })
    );
    expect(result.current.products).toEqual([]);
    expect(result.current.filter).toEqual('Todos');
    expect(result.current.filterIsOpened).toBeFalsy();
  });

  it('should call handleOpenCreateAd and navigate to createAd screen', async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;
    (useAuthContext as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useMyAdsViewModel());

    act(() => {
      result.current.handleOpenCreateAd();
    });

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith('createAd');
  });

  it(`should update products with all user products`, async () => {
    const defaultMockedUser = {
      id: 'user-1',
      name: 'John Doe',
      avatar: null,
    } as unknown;

    const mockProducts = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        isNew: true,
        price: 1,
        acceptTrade: true,
        paymentMethods: ['boleto'],
        images: [{ id: '1', path: 'path1' }],
        userId: 'user-1',
        isActive: true,
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        isNew: true,
        price: 2,
        acceptTrade: true,
        paymentMethods: ['boleto'],
        images: [{ id: '2', path: 'path2' }],
        userId: 'user-1',
        isActive: true,
      },
      {
        id: '3',
        name: 'Product 3',
        description: 'Description 3',
        isNew: false,
        price: 3,
        acceptTrade: true,
        paymentMethods: ['boleto'],
        images: [{ id: '3', path: 'path3' }],
        userId: 'user-1',
        isActive: false,
      },
    ];

    const mockGetUserProductsUseCase = {
      execute: jest.fn().mockResolvedValue(mockProducts),
    };

    (container.get as jest.Mock).mockReturnValue(mockGetUserProductsUseCase);

    (useAuthContext as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useMyAdsViewModel());

    await act(async () => {
      result.current.productsUpdate();
    });

    expect(result.current.products.length).toEqual(3);
  });

  it(`should update products with all active user products`, async () => {
    const defaultMockedUser = {
      id: 'user-1',
      name: 'John Doe',
      avatar: null,
    } as unknown;

    const mockProducts = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        isNew: true,
        price: 1,
        acceptTrade: true,
        paymentMethods: ['boleto'],
        images: [{ id: '1', path: 'path1' }],
        userId: 'user-1',
        isActive: true,
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        isNew: true,
        price: 2,
        acceptTrade: true,
        paymentMethods: ['boleto'],
        images: [{ id: '2', path: 'path2' }],
        userId: 'user-1',
        isActive: true,
      },
    ];

    const mockGetUserProductsUseCase = {
      execute: jest.fn().mockResolvedValue(mockProducts),
    };

    (container.get as jest.Mock).mockReturnValue(mockGetUserProductsUseCase);

    (useAuthContext as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useMyAdsViewModel());

    await act(async () => {
      result.current.handleFilter('Ativos');
      await waitFor(() => result.current.products.length === 2);
    });

    expect(result.current.products.length).toEqual(2);
  });

  it(`should update products with all inactive user products`, async () => {
    const defaultMockedUser = {
      id: 'user-1',
      name: 'John Doe',
      avatar: null,
    } as unknown;

    const mockProducts = [
      {
        id: '3',
        name: 'Product 3',
        description: 'Description 3',
        isNew: false,
        price: 3,
        acceptTrade: true,
        paymentMethods: ['boleto'],
        images: [{ id: '3', path: 'path3' }],
        userId: 'user-1',
        isActive: false,
      },
    ];

    const mockGetUserProductsUseCase = {
      execute: jest.fn().mockResolvedValue(mockProducts),
    };

    (container.get as jest.Mock).mockReturnValue(mockGetUserProductsUseCase);

    (useAuthContext as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useMyAdsViewModel());

    await act(async () => {
      result.current.handleFilter('Inativos');
      await waitFor(() => result.current.products.length === 1);
    });

    expect(result.current.products.length).toEqual(1);
  });

  it(`should update filter`, async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;

    (useAuthContext as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useMyAdsViewModel());

    act(() => {
      result.current.handleFilterChange('Ativos');
    });

    expect(result.current.filter).toEqual('Ativos');
  });
});
