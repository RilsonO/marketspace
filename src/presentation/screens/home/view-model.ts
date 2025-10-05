import { useAuthContext } from '../../../contexts/auth/use-auth.hook';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '../../../main/routes/app.routes';
import { DomainError } from '../../../domain/errors/DomainError';
import { HomeTabsNavigatorRoutesProps } from '../../../main/routes/home-tabs.routes';
import { IProduct } from '../../../shared/types/interfaces/product.interface';
import { PaymentMethod } from '../../../entities/Product';
import { useToast } from 'native-base';
import { RefObject, useRef, useState, useEffect, useCallback } from 'react';
import { Modalize } from 'react-native-modalize';
import { User } from '../../../entities/User';
import { container } from '../../../main/container/DIContainer';
import { UseCaseKeys } from '../../../shared/enums';
export interface HomeViewModel {
  user: User | null;
  isFetchLoading: boolean;
  search: string;
  isLoading: boolean;
  data: IProduct[];
  isNew: boolean | null;
  acceptTrade: boolean | null;
  activeAdsCount: number;
  modalizeRef: RefObject<Modalize>;
  handleOpenCreateAd: () => void;
  handleNavigateToMyAds: () => void;
  countActiveAds: () => Promise<void>;
  handleOpenModalize: () => void;
  handleCloseModalize: () => void;
  handleResetFilters: () => void;
  onToggleAcceptTrade: () => void;
  fetchFilteredProducts: () => Promise<void>;
  handleIsNew: (value: boolean) => void;
  onChangeSearch: (value: string) => void;
  findPaymentMethod: (payment_method: PaymentMethod) => boolean;
  handlePaymentMethods: (payment_method: PaymentMethod) => void;
  fetchUserData: () => Promise<void>;
}

function useHomeViewModel(): HomeViewModel {
  const { user } = useAuthContext();
  const toast = useToast();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const { navigate: navigateTabs } =
    useNavigation<HomeTabsNavigatorRoutesProps>();

  const modalizeRef = useRef<Modalize>(null);

  const [data, setData] = useState<IProduct[]>([] as IProduct[]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [acceptTrade, setAcceptTrade] = useState<boolean | null>(null);
  const [isNew, setIsNew] = useState<boolean | null>(null);
  const [search, setSearch] = useState('');
  const [isFetchLoading, setIsFetchLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAdsCount, setActiveAdsCount] = useState(0);

  // Side-effects movidos da View para o ViewModel
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  useEffect(() => {
    fetchFilteredProducts();
  }, []);

  function onChangeSearch(value: string) {
    setSearch(value);
  }

  function onToggleAcceptTrade() {
    setAcceptTrade((prev) => !prev);
  }

  function handleOpenModalize() {
    modalizeRef.current?.open();
  }

  function handleCloseModalize() {
    modalizeRef.current?.close();
  }

  function handleOpenCreateAd() {
    navigate('createAd');
  }

  function handleNavigateToMyAds() {
    navigateTabs('myAds');
  }

  async function countActiveAds() {
    if (!user) {
      setActiveAdsCount(0);
      return;
    }

    try {
      const getUserProductsUseCase = container.get(
        UseCaseKeys.GET_USER_PRODUCTS_USE_CASE
      );
      const count = await getUserProductsUseCase.getActiveProductsCount(
        user.id
      );
      setActiveAdsCount(count);
    } catch (error) {
      setActiveAdsCount(0);
    }
  }

  function findPaymentMethod(payment_method: PaymentMethod) {
    return paymentMethods.includes(payment_method);
  }

  function handlePaymentMethods(payment_method: PaymentMethod) {
    const existMethod = findPaymentMethod(payment_method);

    if (existMethod) {
      setPaymentMethods((prev) =>
        prev.filter((item) => item !== payment_method)
      );
    } else {
      setPaymentMethods((prev) => [...prev, payment_method]);
    }
  }

  function handleResetFilters() {
    setPaymentMethods([]);
    setIsNew(null);
    setAcceptTrade(null);
  }

  function handleIsNew(value: boolean) {
    if (isNew !== value) {
      setIsNew(value);
    } else {
      setIsNew(null);
    }
  }

  async function fetchFilteredProducts() {
    try {
      handleCloseModalize();

      setIsLoading(true);
      let filter = `?query=${search}`;

      if (isNew !== null) {
        filter += `&is_new=${isNew}`;
      }
      if (acceptTrade !== null) {
        filter += `&accept_trade=${acceptTrade}`;
      }
      if (paymentMethods.length > 0) {
        filter += `&payment_methods=${JSON.stringify(paymentMethods)}`;
      }

      const getProductsUseCase = container.get(
        UseCaseKeys.GET_PRODUCTS_USE_CASE
      );
      const { products } = await getProductsUseCase.execute({ filter });

      if (products.length > 0) {
        setData(products);
      } else {
        setData([]);
      }
    } catch (error) {
      const isDomainError = error instanceof DomainError;
      const title = isDomainError
        ? error.message
        : 'Não foi possível carregar o anúncio. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchUserData() {
    try {
      setIsFetchLoading(true);
      await countActiveAds();
    } catch (error) {
      const isDomainError = error instanceof DomainError;
      const title = isDomainError
        ? error.message
        : 'Não foi possível atualizar seus dados. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsFetchLoading(false);
    }
  }

  return {
    user,
    isFetchLoading,
    search,
    isLoading,
    data,
    modalizeRef,
    isNew,
    acceptTrade,
    activeAdsCount,
    handleOpenCreateAd,
    handleNavigateToMyAds,
    countActiveAds,
    onChangeSearch,
    fetchFilteredProducts,
    handleOpenModalize,
    handleCloseModalize,
    handleIsNew,
    findPaymentMethod,
    handlePaymentMethods,
    handleResetFilters,
    onToggleAcceptTrade,
    fetchUserData,
  };
}

export { useHomeViewModel };
