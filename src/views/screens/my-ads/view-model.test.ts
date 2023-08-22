import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useMyAdsViewModel } from './view-model';
import { useAuthViewModel } from '@hooks/use-auth.hook';

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
    (useAuthViewModel as jest.Mock).mockReturnValue({
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
    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });
    const { result } = renderHook(() => useMyAdsViewModel());

    await act(async () => {
      await result.current.handleOpenCreateAd();
    });

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith('createAd');
  });

  it(`should update products with all user products`, async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [
        {
          id: '1',
          name: 'Product 1',
          description: 'Description for Product 1',
          is_new: true,
          is_active: true,
          price: 100,
          accept_trade: false,
          payment_methods: [],
          product_images: [],
          user: {
            id: '',
            avatar: '',
            name: '',
            email: '',
            tel: '',
          },
        },
        {
          id: '2',
          name: 'Product 2',
          description: 'Description for Product 2',
          is_new: true,
          is_active: true,
          price: 200,
          accept_trade: true,
          payment_methods: [],
          product_images: [],
          user: {
            id: '',
            avatar: '',
            name: '',
            email: '',
            tel: '',
          },
        },
        {
          id: '3',
          name: 'Product 3',
          description: 'Description for Product 3',
          is_new: false,
          is_active: false,
          price: 300,
          accept_trade: true,
          payment_methods: [],
          product_images: [],
          user: {
            id: '',
            avatar: '',
            name: '',
            email: '',
            tel: '',
          },
        },
      ],
    } as unknown;

    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useMyAdsViewModel());

    await act(() => {
      result.current.productsUpdate();
    });

    expect(result.current.products.length).toEqual(3);
  });

  it(`should update products with all active user products`, async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [
        {
          id: '1',
          name: 'Product 1',
          description: 'Description for Product 1',
          is_new: true,
          is_active: true,
          price: 100,
          accept_trade: false,
          payment_methods: [],
          product_images: [],
          user: {
            id: '',
            avatar: '',
            name: '',
            email: '',
            tel: '',
          },
        },
        {
          id: '2',
          name: 'Product 2',
          description: 'Description for Product 2',
          is_new: true,
          is_active: true,
          price: 200,
          accept_trade: true,
          payment_methods: [],
          product_images: [],
          user: {
            id: '',
            avatar: '',
            name: '',
            email: '',
            tel: '',
          },
        },
        {
          id: '3',
          name: 'Product 3',
          description: 'Description for Product 3',
          is_new: false,
          is_active: false,
          price: 300,
          accept_trade: true,
          payment_methods: [],
          product_images: [],
          user: {
            id: '',
            avatar: '',
            name: '',
            email: '',
            tel: '',
          },
        },
      ],
    } as unknown;

    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useMyAdsViewModel());

    await act(async () => {
      await waitFor(() => result.current.products.length === 3);
    });

    await act(() => {
      result.current.handleFilter('Ativos');
    });

    await act(async () => {
      await waitFor(() => result.current.filter === 'Ativos');
    });

    await act(() => {
      result.current.productsUpdate();
    });

    expect(result.current.products.length).toEqual(2);
  });

  it(`should update products with all inactive user products`, async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [
        {
          id: '1',
          name: 'Product 1',
          description: 'Description for Product 1',
          is_new: true,
          is_active: true,
          price: 100,
          accept_trade: false,
          payment_methods: [],
          product_images: [],
          user: {
            id: '',
            avatar: '',
            name: '',
            email: '',
            tel: '',
          },
        },
        {
          id: '2',
          name: 'Product 2',
          description: 'Description for Product 2',
          is_new: true,
          is_active: true,
          price: 200,
          accept_trade: true,
          payment_methods: [],
          product_images: [],
          user: {
            id: '',
            avatar: '',
            name: '',
            email: '',
            tel: '',
          },
        },
        {
          id: '3',
          name: 'Product 3',
          description: 'Description for Product 3',
          is_new: false,
          is_active: false,
          price: 300,
          accept_trade: true,
          payment_methods: [],
          product_images: [],
          user: {
            id: '',
            avatar: '',
            name: '',
            email: '',
            tel: '',
          },
        },
      ],
    } as unknown;

    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useMyAdsViewModel());

    await act(async () => {
      await waitFor(() => result.current.products.length === 3);
    });

    await act(() => {
      result.current.handleFilter('Inativos');
    });

    await act(async () => {
      await waitFor(() => result.current.filter === 'Inativos');
    });

    await act(() => {
      result.current.productsUpdate();
    });

    expect(result.current.products.length).toEqual(1);
  });

  it(`should update filter`, async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;

    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useMyAdsViewModel());

    await act(() => {
      result.current.handleFilter('Inativos');
    });

    expect(result.current.filter).toEqual('Inativos');
  });

  it(`should update filterIsOpened`, async () => {
    const defaultMockedUser = {
      name: 'John Doe',
      avatar: null,
      products: [],
    } as unknown;

    (useAuthViewModel as jest.Mock).mockReturnValue({
      user: defaultMockedUser,
    });

    const { result } = renderHook(() => useMyAdsViewModel());

    await act(() => {
      result.current.handleFilterIsOpened(true);
    });

    expect(result.current.filterIsOpened).toBeTruthy();

    await act(() => {
      result.current.handleFilterIsOpened(false);
    });

    expect(result.current.filterIsOpened).toBeFalsy();
  });
});
