import { ProductDTO } from '@dtos/product.dtos';
import { useAuthViewModel } from '@hooks/use-auth.hook';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { AppError } from '@utils/AppError.util';
import { HomeTabsNavigatorRoutesProps } from '@routes/home-tabs.routes';
import { ProductMap } from '@mappers/product.map';
import { IProduct } from 'src/interfaces/product.interface';
import { IPaymentMethods } from 'src/interfaces/payment-methods.interface';
import { useToast } from 'native-base';
import { RefObject, useRef, useState } from 'react';
import { Modalize } from 'react-native-modalize';
import { UserModel } from 'src/models/user.model';
import { fetchProducts } from '@infra/http/repositories/product.repository';

/* eslint-disable no-unused-vars*/
export interface HomeViewModel {
  user: UserModel;
  isFetchLoading: boolean;
  search: string;
  isLoading: boolean;
  data: IProduct[];
  isNew: boolean | null;
  acceptTrade: boolean | null;
  modalizeRef: RefObject<Modalize>;
  handleOpenCreateAd: () => void;
  handleNavigateToMyAds: () => void;
  countActiveAds: () => number;
  handleOpenModalize: () => void;
  handleCloseModalize: () => void;
  handleResetFilters: () => void;
  onToggleAcceptTrade: () => void;
  fetchFilteredProducts: () => Promise<void>;
  handleIsNew: (value: boolean) => void;
  onChangeSearch: (value: string) => void;
  findPaymentMethod: (payment_method: IPaymentMethods) => boolean;
  handlePaymentMethods: (payment_method: IPaymentMethods) => void;
  fetchUserData: () => Promise<void>;
}
/* eslint-disable no-unused-vars*/

function useHomeViewModel(): HomeViewModel {
  const { user } = useAuthViewModel();
  const toast = useToast();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const { navigate: navigateTabs } =
    useNavigation<HomeTabsNavigatorRoutesProps>();

  const modalizeRef = useRef<Modalize>(null);

  const [data, setData] = useState<IProduct[]>([] as IProduct[]);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethods[]>([]);
  const [acceptTrade, setAcceptTrade] = useState<boolean | null>(null);
  const [isNew, setIsNew] = useState<boolean | null>(null);
  const [search, setSearch] = useState('');
  const [isFetchLoading, setIsFetchLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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

  function countActiveAds() {
    const activeAds = user.products.map((item) => item.is_active === true);
    return activeAds.length;
  }

  function findPaymentMethod(payment_method: IPaymentMethods) {
    return paymentMethods.includes(payment_method);
  }

  function handlePaymentMethods(payment_method: IPaymentMethods) {
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

      const data = await fetchProducts({ filter });
      if (data.length > 0) {
        setData(data.map((item: ProductDTO) => ProductMap.toIProduct(item)));
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
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

      await user.updateProfile();
      await user.fetchProducts();
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
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
