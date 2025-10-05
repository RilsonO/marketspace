import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { AdDetails } from './view';
import { THEME } from '../../../../shared/theme';
import { AdDetailsViewModel, useAdDetailsViewModel } from './view-model';
import { NativeBaseProvider, Spinner } from 'native-base';
import { IProduct } from 'src/shared/types/interfaces/product.interface';
import { User } from '@entities/User';
import { Host } from 'react-native-portalize';
import { toMaskedPrice } from '../../../../shared/utils/Masks.util';
import { PencilSimpleLine, ArrowLeft } from 'phosphor-react-native';

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

interface CreateMockAdDetailsView {
  user: User | null;
  isUpdating: boolean;
  isDeleting: boolean;
  product: IProduct | null;
  is_active: boolean;
  isLoading: boolean;
}

const createMockAdDetailsViewModel = ({
  user,
  isUpdating,
  isDeleting,
  product,
  is_active,
  isLoading,
}: CreateMockAdDetailsView): AdDetailsViewModel => {
  return {
    user,
    isUpdating,
    isDeleting,
    product,
    is_active,
    isLoading,
    handleGoBack: jest.fn(),
    handleNavigateToEditAd: jest.fn(),
    handleOpenWhatsApp: jest.fn(),
    handleDeleteAd: jest.fn(),
    handleDisableAd: jest.fn(),
    fetchProduct: jest.fn(),
  };
};

interface FactoryProps {
  user?: User | null;
  isUpdating?: boolean;
  isDeleting?: boolean;
  is_active?: boolean;
  isLoading?: boolean;
  product?: IProduct | null;
}

const defaultMockedUser = {
  id: 'user-1',
  name: 'John Doe',
  avatar: 'user_avatar.jpg',
  products: [],
} as unknown;

const defaultMockedProduct = {
  id: '1',
  name: 'Product 1',
  price: 100,
  is_new: true,
  accept_trade: false,
  description: 'Description 1',
  payment_methods: [],
  product_images: [],
  user_id: 'user-1',
  user: {
    id: 'user-1',
    avatar: 'avatar-url-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    tel: '+1 1234567890',
  },
} as IProduct;

const regularMockedProduct = {
  id: '2',
  name: 'Regular product',
  price: 200,
  is_new: true,
  accept_trade: false,
  description: 'Description of regular product',
  payment_methods: [],
  product_images: [],
  user_id: 'user-2',
  user: {
    id: 'user-2',
    avatar: 'avatar-url-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    tel: '+55 12345678908',
  },
} as IProduct;

function makeSut({
  user = defaultMockedUser as User,
  isUpdating = false,
  isDeleting = false,
  is_active = true,
  isLoading = true,
  product = null,
}: FactoryProps) {
  const mockAdDetailsViewModel = createMockAdDetailsViewModel({
    user,
    isUpdating,
    isDeleting,
    is_active,
    isLoading,
    product,
  });
  (useAdDetailsViewModel as jest.Mock).mockReturnValueOnce(
    mockAdDetailsViewModel
  );
  const inset = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  };

  const sut = render(
    <NativeBaseProvider theme={THEME} initialWindowMetrics={inset}>
      <Host>
        <AdDetails />
      </Host>
    </NativeBaseProvider>
  );

  return { ...sut, ...mockAdDetailsViewModel };
}

describe('AdDetails view', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when is loading', () => {
    const { UNSAFE_getByType, toJSON } = makeSut({});
    expect(UNSAFE_getByType(Spinner)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it(`should render correctly when the user's ad is loaded`, async () => {
    const { toJSON, getByText, UNSAFE_getByType, findByText } = makeSut({
      isLoading: false,
      product: defaultMockedProduct,
    });
    const unableAddButton = getByText('Desativar anúncio');
    const deleteAddButton = getByText('Excluir anúncio');
    const userName = await findByText(
      (defaultMockedProduct as IProduct).user.name
    );
    const adName = await findByText((defaultMockedProduct as IProduct).name);
    const adDescription = await findByText(
      (defaultMockedProduct as IProduct).description
    );

    expect(unableAddButton).toBeTruthy();
    expect(deleteAddButton).toBeTruthy();
    expect(UNSAFE_getByType(PencilSimpleLine)).toBeTruthy();
    expect(adName).toBeTruthy();
    expect(adDescription).toBeTruthy();
    expect(userName).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it(`should render correctly when the regular's ad is loaded`, async () => {
    const { getByText, getAllByText, findByText, toJSON } = makeSut({
      isLoading: false,
      product: regularMockedProduct,
    });
    const contactAddButton = getByText('Entrar em contato');
    const price = getAllByText(
      `R$ ${toMaskedPrice(String(regularMockedProduct.price))}`
    );
    const userName = await findByText(regularMockedProduct.user.name);
    const adName = await findByText(regularMockedProduct.name);
    const adDescription = await findByText(regularMockedProduct.description);

    expect(contactAddButton).toBeTruthy();
    expect(price.length).toBe(2);
    expect(adName).toBeTruthy();
    expect(adDescription).toBeTruthy();
    expect(userName).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it(`should show failure message, retry and back button`, async () => {
    const { getByText, fetchProduct, handleGoBack, UNSAFE_getByType, toJSON } =
      makeSut({
        isLoading: false,
      });
    const retryButton = getByText('Tentar novamente');
    const failureMessage = getByText('Falha ao carregar detalhes do produto');
    const backButton = UNSAFE_getByType(ArrowLeft);

    await act(async () => {
      fireEvent.press(retryButton);
      await waitFor(() => {
        expect(fetchProduct).toHaveBeenCalled();
      });
    });
    await act(async () => {
      fireEvent.press(backButton);
      await waitFor(() => {
        expect(handleGoBack).toHaveBeenCalled();
      });
    });
    expect(retryButton).toBeTruthy();
    expect(failureMessage).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it(`should call fetchProduct when 'Tentar novamente' is pressed`, async () => {
    const { getByText, fetchProduct } = makeSut({
      isLoading: false,
    });
    const retryButton = getByText('Tentar novamente');

    await act(async () => {
      fireEvent.press(retryButton);
      await waitFor(() => {
        expect(fetchProduct).toHaveBeenCalled();
      });
    });
    expect(retryButton).toBeTruthy();
  });

  it(`should call handleGoBack when 'ArrowLeft' is pressed`, async () => {
    const { handleGoBack, UNSAFE_getByType } = makeSut({
      isLoading: false,
    });
    const backButton = UNSAFE_getByType(ArrowLeft);

    await act(async () => {
      fireEvent.press(backButton);
      await waitFor(() => {
        expect(handleGoBack).toHaveBeenCalled();
      });
    });
  });

  it(`should call handleNavigateToEditAd when 'PencilSimpleLine' is pressed`, async () => {
    const { handleNavigateToEditAd, UNSAFE_getByType } = makeSut({
      isLoading: false,
      product: defaultMockedProduct,
    });
    const editButton = UNSAFE_getByType(PencilSimpleLine);

    await act(async () => {
      fireEvent.press(editButton);
      await waitFor(() => {
        expect(handleNavigateToEditAd).toHaveBeenCalled();
      });
    });
  });

  it(`should call handleDisableAd when 'Desativar anúncio' is pressed`, async () => {
    const { handleDisableAd, getByText } = makeSut({
      isLoading: false,
      product: defaultMockedProduct,
    });
    const disableAdButton = getByText('Desativar anúncio');

    await act(async () => {
      fireEvent.press(disableAdButton);
      await waitFor(() => {
        expect(handleDisableAd).toHaveBeenCalled();
      });
    });
  });

  it(`should call handleDisableAd when 'Reativar anúncio' is pressed`, async () => {
    const { handleDisableAd, getByText } = makeSut({
      isLoading: false,
      is_active: false,
      product: defaultMockedProduct,
    });
    const disableAdButton = getByText('Reativar anúncio');

    await act(async () => {
      fireEvent.press(disableAdButton);
      await waitFor(() => {
        expect(handleDisableAd).toHaveBeenCalled();
      });
    });
  });

  it(`should call handleDeleteAd when 'Excluir anúncio' is pressed`, async () => {
    const { handleDeleteAd, getByText } = makeSut({
      isLoading: false,
      product: defaultMockedProduct,
    });
    const deleteAdButton = getByText('Excluir anúncio');

    await act(async () => {
      fireEvent.press(deleteAdButton);
      await waitFor(() => {
        expect(handleDeleteAd).toHaveBeenCalled();
      });
    });
  });

  it(`should call handleOpenWhatsApp when 'Entrar em contato' is pressed`, async () => {
    const { handleOpenWhatsApp, getByText } = makeSut({
      isLoading: false,
      product: regularMockedProduct,
    });
    const contactAdButton = getByText('Entrar em contato');

    await act(async () => {
      fireEvent.press(contactAdButton);
      await waitFor(() => {
        expect(handleOpenWhatsApp).toHaveBeenCalled();
      });
    });
  });
});
