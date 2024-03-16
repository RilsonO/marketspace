import { useState } from 'react';
import { useAuthViewModel } from '@hooks/use-auth.hook';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { HomeTabsNavigatorRoutesProps } from '@routes/home-tabs.routes';
import { useToast } from 'native-base';
import { IProduct } from 'src/interfaces/product.interface';
import { Linking } from 'react-native';
import { unMask } from '@utils/Masks.util';
import { AppError } from '@utils/AppError.util';
import { ProductMap } from '@mappers/product.map';
import {
  fetchProductById,
  productDeleteById,
  productToggleDisableById,
} from '@infra/http/repositories/product.repository';
import { UserModel } from 'src/models/user.model';

type ParamsProps = {
  id: string;
};

export interface AdDetailsViewModel {
  user: UserModel;
  isUpdating: boolean;
  isDeleting: boolean;
  product: IProduct | null;
  is_active: boolean;
  isLoading: boolean;
  handleGoBack: () => void;
  handleNavigateToEditAd: () => void;
  handleOpenWhatsApp: () => Promise<void>;
  handleDeleteAd: () => Promise<void>;
  handleDisableAd: () => Promise<void>;
  fetchProduct: () => Promise<void>;
}

function useAdDetailsViewModel(): AdDetailsViewModel {
  const toast = useToast();
  const { navigate, goBack } = useNavigation<AppNavigatorRoutesProps>();
  const { navigate: navigateHomeTabs } =
    useNavigation<HomeTabsNavigatorRoutesProps>();
  const route = useRoute();
  const { user } = useAuthViewModel();

  const params = route.params as ParamsProps;

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [is_active, setIs_active] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  function handleGoBack() {
    if (user.id === product?.user_id) {
      navigateHomeTabs('myAds');
    } else {
      goBack();
    }
  }

  function handleNavigateToEditAd() {
    if (product) {
      navigate('createAd', product);
    }
  }

  async function handleOpenWhatsApp() {
    if (!product) return;
    const whatsappUrl = `https://wa.me/55${unMask(product.user.tel)}`;
    const whatsappSupported = await Linking.canOpenURL(whatsappUrl);

    if (whatsappSupported) {
      Linking.openURL(whatsappUrl);
    } else {
      toast.show({
        title:
          'Não foi possível contactar o vendedor. Tente novamente mais tarde.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function handleDeleteAd() {
    try {
      setIsDeleting(true);
      await productDeleteById({ id: params.id });
      await user.fetchProducts();
      handleGoBack();
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível excluir o anúncio. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleDisableAd() {
    if (!product) return;
    try {
      setIsUpdating(true);
      await productToggleDisableById({ id: params.id, is_active: !is_active });
      await user.fetchProducts();
      const productState = product;
      productState.is_active = !is_active;
      setProduct(productState);
      setIs_active((prev) => !prev);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível desativar o anúncio. Tente novamente mais tarde.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsUpdating(false);
    }
  }

  async function fetchProduct() {
    try {
      setIsLoading(true);
      const product = await fetchProductById({ id: params.id });
      setProduct(ProductMap.toIProduct(product));
      setIs_active(product.is_active);
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

  return {
    user,
    isUpdating,
    isDeleting,
    product,
    is_active,
    isLoading,
    handleGoBack,
    handleNavigateToEditAd,
    handleOpenWhatsApp,
    handleDeleteAd,
    handleDisableAd,
    fetchProduct,
  };
}

export { useAdDetailsViewModel };
