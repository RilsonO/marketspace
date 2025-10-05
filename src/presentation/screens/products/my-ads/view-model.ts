import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../../contexts/auth/use-auth.hook';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '../../../../main/routes/app.routes';
import { useToast } from 'native-base';
import { IProduct } from '../../../../shared/types/interfaces/product.interface';
import { DomainError } from '../../../../domain/errors/DomainError';
import { container } from '../../../../main/container/DIContainer';
import { UseCaseKeys } from '../../../../shared/enums';
import { User } from '../../../../entities/User';

export interface MyAdsViewModel {
  user: User | null;
  products: IProduct[];
  filter: string;
  filterIsOpened: boolean;
  isLoading: boolean;
  productsUpdate: () => void;
  handleFilterChange: (filter: string) => void;
  handleOpenCreateAd: () => void;
  handleFilterIsOpened: (isOpened: boolean) => void;
  handleFilter: (filter: string) => void;
  handleNavigateToAdDetails: (id: string) => void;
}

function useMyAdsViewModel(): MyAdsViewModel {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuthContext();
  const toast = useToast();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [filter, setFilter] = useState<string>('Todos');
  const [filterIsOpened, setFilterIsOpened] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  async function productsUpdate() {
    if (!user) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const getUserProductsUseCase = container.get(
        UseCaseKeys.GET_USER_PRODUCTS_USE_CASE
      );
      const userProducts = await getUserProductsUseCase.execute(user.id);

      let filteredProducts = userProducts;

      // Aplicar filtro
      if (filter === 'Ativos') {
        filteredProducts = userProducts.filter((product) => product.isActive);
      } else if (filter === 'Inativos') {
        filteredProducts = userProducts.filter((product) => !product.isActive);
      }

      // Converter para IProduct
      const products = filteredProducts.map((product) => ({
        id: product.id,
        user_id: product.userId,
        name: product.name,
        description: product.description,
        is_new: product.isNew,
        is_active: product.isActive,
        price: product.price,
        accept_trade: product.acceptTrade,
        payment_methods: product.paymentMethods,
        product_images: product.images.map((img) => ({
          id: img.id,
          uri: `${process.env.EXPO_PUBLIC_API_URL}/images/${img.path}`,
          type: 'image/jpeg',
          name: img.id,
        })),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          tel: user.phone,
          avatar: user.avatar,
        },
      }));

      setProducts(products);
    } catch (error) {
      const isDomainError = error instanceof DomainError;
      const title = isDomainError
        ? error.message
        : 'Não foi possível carregar seus anúncios. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFilterChange(newFilter: string) {
    setFilter(newFilter);
  }

  function handleOpenCreateAd() {
    navigate('createAd');
  }

  function handleFilterIsOpened(isOpened: boolean) {
    setFilterIsOpened(isOpened);
  }

  function handleFilter(newFilter: string) {
    setFilter(newFilter);
    setFilterIsOpened(false);
  }

  function handleNavigateToAdDetails(id: string) {
    navigate('adDetails', { id });
  }

  useEffect(() => {
    productsUpdate();
  }, [user, filter]);

  return {
    user,
    products,
    filter,
    filterIsOpened,
    isLoading,
    productsUpdate,
    handleFilterChange,
    handleOpenCreateAd,
    handleFilterIsOpened,
    handleFilter,
    handleNavigateToAdDetails,
  };
}

export { useMyAdsViewModel };
