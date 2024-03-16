import { act, fireEvent, render } from '@testing-library/react-native';
import { MyAds } from './view';
import { THEME } from '../../../theme';
import { MyAdsViewModel, useMyAdsViewModel } from './view-model';
import { FlatList, NativeBaseProvider } from 'native-base';
import { IProduct } from 'src/interfaces/product.interface';
import { UserModel } from 'src/models/user.model';
import { toMaskedPrice } from '@utils/Masks.util';
import { Plus } from 'phosphor-react-native';

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

type Filter = 'Todos' | 'Ativos' | 'Inativos';

interface CreateMockMyAdsView {
  user: UserModel;
  products: IProduct[];
  filter: Filter;
  filterIsOpened: boolean;
}

const createMockMyAdsViewModel = ({
  user,
  products,
  filter,
  filterIsOpened,
}: CreateMockMyAdsView): MyAdsViewModel => {
  return {
    user,
    products,
    filter,
    filterIsOpened,
    productsUpdate: jest.fn(),
    handleOpenCreateAd: jest.fn(),
    handleFilterIsOpened: jest.fn(),
    handleFilter: jest.fn(),
  };
};

interface FactoryProps {
  user?: UserModel;
  products?: IProduct[];
  filter?: Filter;
  filterIsOpened?: boolean;
}

const defaultMockedUser = {
  name: 'John Doe',
  avatar: 'user_avatar.jpg',
  products: [],
} as unknown;

function makeSut({
  user = defaultMockedUser as UserModel,
  products = [],
  filter = 'Todos',
  filterIsOpened = false,
}: FactoryProps) {
  const mockMyAdsViewModel = createMockMyAdsViewModel({
    user,
    products,
    filter,
    filterIsOpened,
  });
  (useMyAdsViewModel as jest.Mock).mockReturnValueOnce(mockMyAdsViewModel);
  const inset = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  };

  const sut = render(
    <NativeBaseProvider theme={THEME} initialWindowMetrics={inset}>
      <MyAds />
    </NativeBaseProvider>
  );

  return { ...sut, ...mockMyAdsViewModel };
}

describe('MyAds view', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { toJSON, getByText } = makeSut({});
    const title = getByText('Meus anúncios');
    const countAds = getByText('0 anúncio');
    const filterTitle = getByText('Todos');
    expect(title).toBeTruthy();
    expect(countAds).toBeTruthy();
    expect(filterTitle).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
  });

  it('should show user products length correctly', () => {
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
    ];

    const { getByText } = makeSut({
      products: mockedProducts,
    });

    const countAds = getByText('0 anúncio');

    expect(countAds).toBeTruthy();
  });

  it('should render correctly with filter equal `Ativos`', async () => {
    const mockedFilter = 'Ativos';

    const { toJSON, getByText } = makeSut({
      filter: mockedFilter,
    });

    const filterTitle = await getByText(mockedFilter);

    expect(filterTitle).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render correctly with filter equal `Inativos`', async () => {
    const mockedFilter = 'Inativos';

    const { toJSON, getByText } = makeSut({
      filter: mockedFilter,
    });

    const filterTitle = await getByText(mockedFilter);

    expect(filterTitle).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
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
        price: 200,
        is_new: false,
        accept_trade: true,
        description: 'Description 2',
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
    ];

    const { queryByText } = makeSut({
      products: mockedProducts,
    });

    mockedProducts.forEach((product) => {
      expect(queryByText(product.name)).toBeTruthy();
      expect(
        queryByText(`R$${toMaskedPrice(String(product.price))}`)
      ).toBeTruthy();
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
    ];

    const { UNSAFE_getByType } = makeSut({
      products: mockedProducts,
    });

    const flatList = UNSAFE_getByType(FlatList);
    expect(flatList.props.numColumns).toBe(2);
  });

  it('should call handleOpenCreateAd when plus button is pressed', async () => {
    const { UNSAFE_getByType, handleOpenCreateAd } = makeSut({});

    await act(() => {
      fireEvent.press(UNSAFE_getByType(Plus));
    });

    expect(handleOpenCreateAd).toHaveBeenCalled();
  });

  it('should call handleFilterIsOpened when filter button is pressed', async () => {
    const { getByTestId, handleFilterIsOpened } = makeSut({});

    const filterButton = getByTestId('filter-button');

    await act(() => {
      fireEvent.press(filterButton);
    });

    expect(handleFilterIsOpened).toHaveBeenCalledWith(true);

    const todosFilterButton = getByTestId('todos-filter-item');
    const ativosFilterButton = getByTestId('ativos-filter-item');
    const inativosFilterButton = getByTestId('inativos-filter-item');

    expect(todosFilterButton).toBeTruthy();
    expect(ativosFilterButton).toBeTruthy();
    expect(inativosFilterButton).toBeTruthy();

    await act(() => {
      fireEvent.press(todosFilterButton);
    });

    expect(handleFilterIsOpened).toHaveBeenCalledWith(false);
  });
});
