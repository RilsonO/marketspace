import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { Home } from './view';
import { THEME } from '../../../theme';
import { HomeViewModel, useHomeViewModel } from './view-model';
import { FlatList, NativeBaseProvider, Switch } from 'native-base';
import { IProduct } from 'src/interfaces/product.interface';
import { UserModel } from 'src/models/user.model';
import { createRef } from 'react';
import { Modalize } from 'react-native-modalize';
import { Host } from 'react-native-portalize';
import { toMaskedPrice } from '@utils/Masks.util';
import { Faders, MagnifyingGlass, X } from 'phosphor-react-native';

jest.mock('./view-model');
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

interface CreateMockHomeView {
  isFetchLoading: boolean;
  search: string;
  isLoading: boolean;
  data: IProduct[];
  isNew: boolean | null;
  acceptTrade: boolean | null;
  user: UserModel;
}

const createMockHomeViewModel = ({
  isFetchLoading,
  search,
  isLoading,
  data,
  isNew,
  acceptTrade,
  user,
}: CreateMockHomeView): HomeViewModel => {
  return {
    user,
    isFetchLoading,
    search,
    isLoading,
    data,
    isNew,
    acceptTrade,
    modalizeRef: createRef<Modalize>(),
    handleOpenCreateAd: jest.fn(),
    handleNavigateToMyAds: jest.fn(),
    countActiveAds: jest.fn(),
    fetchFilteredProducts: jest.fn(),
    handleOpenModalize: jest.fn(),
    handleCloseModalize: jest.fn(),
    handleIsNew: jest.fn(),
    findPaymentMethod: jest.fn(),
    handlePaymentMethods: jest.fn(),
    handleResetFilters: jest.fn(),
    onChangeSearch: jest.fn(),
    onToggleAcceptTrade: jest.fn(),
    fetchUserData: jest.fn(),
  };
};

interface FactoryProps {
  isFetchLoading?: boolean;
  search?: string;
  isLoading?: boolean;
  data?: IProduct[];
  isNew?: boolean | null;
  acceptTrade?: boolean | null;
  user?: UserModel;
}

const defaultMockedUser = {
  name: 'John Doe',
  avatar: 'user_avatar.jpg',
  products: [],
} as unknown;

function makeSut({
  isFetchLoading = true,
  isLoading = true,
  search = '',
  data = [],
  isNew = null,
  acceptTrade = null,
  user = defaultMockedUser as UserModel,
}: FactoryProps) {
  const mockHomeViewModel = createMockHomeViewModel({
    isFetchLoading,
    search,
    isLoading,
    data,
    isNew,
    acceptTrade,
    user,
  });
  (useHomeViewModel as jest.Mock).mockReturnValueOnce(mockHomeViewModel);
  const inset = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  };

  const sut = render(
    <NativeBaseProvider theme={THEME} initialWindowMetrics={inset}>
      <Host>
        <Home />
      </Host>
    </NativeBaseProvider>
  );

  return { ...sut, ...mockHomeViewModel };
}

describe('Home view', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { toJSON, getByText } = makeSut({});
    const welcomeText = getByText('Boas vindas,');
    const userName = getByText('John Doe');
    expect(welcomeText).toBeTruthy();
    expect(userName).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render correctly with search value', async () => {
    const search = 'bicicleta';
    const { toJSON, findByPlaceholderText } = makeSut({
      search,
    });
    await waitFor(async () => {
      const adInput = await findByPlaceholderText('Buscar anúncio');
      expect(adInput.props.value).toEqual(search);
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render products correctly', () => {
    const mockedProducts: IProduct[] = [
      {
        id: '1',
        name: 'Product 1',
        price: 100,
        is_new: true,
        accept_trade: false,
        description: 'Description 1',
        payment_methods: [],
        product_images: [],
        user: {
          id: 'user-1',
          avatar: 'avatar-url-1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          tel: '+1 1234567890',
        },
      },
      {
        id: '2',
        name: 'Product 2',
        price: 200,
        is_new: false,
        accept_trade: true,
        description: 'Description 2',
        payment_methods: [],
        product_images: [],
        user: {
          id: 'user-2',
          avatar: 'avatar-url-2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          tel: '+1 9876543210',
        },
      },
    ];

    const { queryByText } = makeSut({
      isLoading: false,
      data: mockedProducts,
    });

    mockedProducts.forEach(async (product) => {
      await waitFor(() => {
        expect(queryByText(product.name)).toBeTruthy();
        expect(
          queryByText(`R$${toMaskedPrice(String(product.price))}`)
        ).toBeTruthy();
      });
    });
  });

  it('should render products in two columns', () => {
    const mockedProducts: IProduct[] = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description for Product 1',
        is_new: true,
        price: 100,
        accept_trade: false,
        payment_methods: [],
        product_images: [],
        user: {
          id: 'user1',
          avatar: 'avatar_url',
          name: 'User 1',
          email: 'user1@example.com',
          tel: '123456789',
        },
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description for Product 2',
        is_new: true,
        price: 200,
        accept_trade: true,
        payment_methods: [],
        product_images: [],
        user: {
          id: 'user2',
          avatar: 'avatar_url',
          name: 'User 2',
          email: 'user2@example.com',
          tel: '987654321',
        },
      },
      {
        id: '3',
        name: 'Product 3',
        description: 'Description for Product 3',
        is_new: false,
        price: 300,
        accept_trade: true,
        payment_methods: [],
        product_images: [],
        user: {
          id: 'user3',
          avatar: 'avatar_url',
          name: 'User 3',
          email: 'user3@example.com',
          tel: '111111111',
        },
      },
    ];

    const { UNSAFE_getByType } = makeSut({
      isLoading: false,
      data: mockedProducts,
    });

    const flatList = UNSAFE_getByType(FlatList);
    expect(flatList.props.numColumns).toBe(2);
  });

  it('should call handleOpenCreateAd when "Criar anúncio" button is pressed', async () => {
    const { getByText, handleOpenCreateAd } = makeSut({});

    await act(async () => {
      fireEvent.press(getByText('Criar anúncio'));
      await waitFor(() => {
        expect(handleOpenCreateAd).toHaveBeenCalled();
      });
    });
  });

  it('should call handleNavigateToMyAds when "Meus anúncios" button is pressed', async () => {
    const { getByText, handleNavigateToMyAds } = makeSut({
      isFetchLoading: false,
    });

    await act(async () => {
      fireEvent.press(getByText('Meus anúncios'));
      await waitFor(() => {
        expect(handleNavigateToMyAds).toHaveBeenCalled();
      });
    });
  });

  it('should call handleOpenModalize when filter button is pressed', async () => {
    const { UNSAFE_getByType, handleOpenModalize } = makeSut({});

    await act(async () => {
      fireEvent.press(UNSAFE_getByType(Faders));

      await waitFor(() => {
        expect(handleOpenModalize).toHaveBeenCalled();
      });
    });
  });

  it('should call handleCloseModalize when the modal is closed', async () => {
    const { UNSAFE_getByType, modalizeRef, handleCloseModalize } = makeSut({});

    await act(() => {
      modalizeRef.current?.open();
    });
    await waitFor(() => expect(modalizeRef.current).toBeTruthy());
    await act(async () => {
      fireEvent.press(UNSAFE_getByType(X));

      await waitFor(() => {
        expect(handleCloseModalize).toHaveBeenCalled();
      });
    });
  });

  it('should call handleIsNew when "NOVO" checkbox is pressed', async () => {
    const { getByText, handleIsNew, modalizeRef } = makeSut({});

    await act(() => {
      modalizeRef.current?.open();
    });
    await waitFor(() => expect(modalizeRef.current).toBeTruthy());
    await act(async () => {
      fireEvent.press(getByText('NOVO'));
      await waitFor(() => {
        expect(handleIsNew).toHaveBeenCalledWith(true);
      });
    });
  });

  it('should call onToggleAcceptTrade when "Aceita troca?" switch is toggled', async () => {
    const { UNSAFE_getByType, onToggleAcceptTrade, modalizeRef } = makeSut({});

    await act(() => {
      modalizeRef.current?.open();
    });
    await waitFor(() => expect(modalizeRef.current).toBeTruthy());

    const switchComponent = UNSAFE_getByType(Switch);
    await act(async () => {
      switchComponent.props.onToggle();
      await waitFor(() => {
        expect(onToggleAcceptTrade).toHaveBeenCalled();
      });
    });
  });

  it('should render correctly with user photo skeleton when user has no photo', async () => {
    const mockedUser = {
      ...(defaultMockedUser as object),
      avatar: null,
    } as unknown;
    const { queryByTestId } = makeSut({ user: mockedUser as UserModel });

    await waitFor(() => {
      expect(queryByTestId('user-photo-skeleton')).toBeTruthy();
      expect(queryByTestId('user-photo')).toBeNull();
    });
  });

  it('should render correctly with user photo when available', async () => {
    const { queryByTestId, getByTestId } = makeSut({});
    await waitFor(() => {
      expect(queryByTestId('user-photo-skeleton')).toBeNull();
      expect(getByTestId('user-photo')).toBeTruthy();
    });
  });

  it('should render correctly with "USADO" checkbox checked', async () => {
    const { getByText, handleIsNew, modalizeRef } = makeSut({});

    await act(() => {
      modalizeRef.current?.open();
    });
    await waitFor(() => expect(modalizeRef.current).toBeTruthy());
    await act(async () => {
      fireEvent.press(getByText('USADO'));
      await waitFor(() => {
        expect(handleIsNew).toHaveBeenCalledWith(false);
      });
    });
  });

  it('should call fetchFilteredProducts when search button is pressed', async () => {
    const { UNSAFE_getByType, fetchFilteredProducts } = makeSut({});

    await act(async () => {
      fireEvent.press(UNSAFE_getByType(MagnifyingGlass));
      await waitFor(() => {
        expect(fetchFilteredProducts).toHaveBeenCalled();
      });
    });
  });

  it('should call fetchFilteredProducts when search input is submitted', async () => {
    const { getByPlaceholderText, fetchFilteredProducts } = makeSut({});

    const inputComponent = getByPlaceholderText('Buscar anúncio');

    await act(async () => {
      inputComponent.props.onSubmitEditing();

      await waitFor(() => {
        expect(fetchFilteredProducts).toHaveBeenCalled();
      });
    });
  });

  it('should call handlePaymentMethods when a payment method checkbox is pressed', async () => {
    const { getByText, handlePaymentMethods, modalizeRef } = makeSut({});

    await act(() => {
      modalizeRef.current?.open();
    });
    await waitFor(() => expect(modalizeRef.current).toBeTruthy());

    await act(async () => {
      fireEvent.press(getByText('Boleto'));

      await waitFor(() => {
        expect(handlePaymentMethods).toHaveBeenCalledWith('boleto');
      });
    });

    await act(async () => {
      fireEvent.press(getByText('Pix'));
      await waitFor(() => {
        expect(handlePaymentMethods).toHaveBeenCalledWith('pix');
      });
    });

    await act(async () => {
      fireEvent.press(getByText('Dinheiro'));
      await waitFor(() => {
        expect(handlePaymentMethods).toHaveBeenCalledWith('cash');
      });
    });

    await act(async () => {
      fireEvent.press(getByText('Cartão de Crédito'));
      await waitFor(() => {
        expect(handlePaymentMethods).toHaveBeenCalledWith('card');
      });
    });

    await act(async () => {
      fireEvent.press(getByText('Deposito Bancário'));
      await waitFor(() => {
        expect(handlePaymentMethods).toHaveBeenCalledWith('deposit');
      });
    });
  });

  it('should call handlePaymentMethods when "Resetar filtros" button is pressed', async () => {
    const { getByText, handleResetFilters, modalizeRef } = makeSut({});

    await act(() => {
      modalizeRef.current?.open();
    });
    await waitFor(() => expect(modalizeRef.current).toBeTruthy());

    await act(async () => {
      fireEvent.press(getByText('Resetar filtros'));
      await waitFor(() => {
        expect(handleResetFilters).toHaveBeenCalled();
      });
    });
  });

  it('should call handlePaymentMethods when "Aplicar filtros" button is pressed', async () => {
    const { getByText, fetchFilteredProducts, modalizeRef } = makeSut({});

    await act(() => {
      modalizeRef.current?.open();
    });
    await waitFor(() => expect(modalizeRef.current).toBeTruthy());

    await act(async () => {
      fireEvent.press(getByText('Aplicar filtros'));
      await waitFor(() => {
        expect(fetchFilteredProducts).toHaveBeenCalled();
      });
    });
  });
});
