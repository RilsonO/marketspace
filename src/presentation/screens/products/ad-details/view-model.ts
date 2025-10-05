import { useState } from 'react';
import { useAuthContext } from '../../../../contexts/auth/use-auth.hook';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '../../../../main/routes/app.routes';
import { HomeTabsNavigatorRoutesProps } from '../../../../main/routes/home-tabs.routes';
import { useToast } from 'native-base';
import { IProduct } from '../../../../shared/types/interfaces/product.interface';
import { Linking } from 'react-native';
import { unMask } from '../../../../shared/utils/Masks.util';
import { DomainError } from '../../../../domain/errors/DomainError';
import { User } from '../../../../entities/User';
import { container } from '../../../../main/container/DIContainer';
import { RepositoryKeys } from '../../../../shared/enums';

type ParamsProps = {
  id: string;
};

export interface AdDetailsViewModel {
  user: User | null;
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
  const { user } = useAuthContext();

  const params = route.params as ParamsProps;

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [is_active, setIs_active] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  function handleGoBack() {
    if (user?.id === product?.user_id) {
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
      const productRepository = container.get(
        RepositoryKeys.I_PRODUCT_REPOSITORY
      );
      await productRepository.delete(params.id);
      handleGoBack();
    } catch (error) {
      const isDomainError = error instanceof DomainError;
      const title = isDomainError
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
      const productRepository = container.get(
        RepositoryKeys.I_PRODUCT_REPOSITORY
      );
      await productRepository.toggleDisable(params.id, !is_active);

      // Atualizar o estado local após sucesso
      const productState = product;
      productState.is_active = !is_active;
      setProduct(productState);
      setIs_active((prev) => !prev);
    } catch (error) {
      const isDomainError = error instanceof DomainError;
      const title = isDomainError
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
      const productRepository = container.get(
        RepositoryKeys.I_PRODUCT_REPOSITORY
      );
      const product = await productRepository.findById(params.id);
      if (product) {
        // Converter Product para IProduct diretamente
        const iProduct: IProduct = {
          id: product.id,
          name: product.name,
          description: product.description,
          is_new: product.isNew,
          price: product.price,
          accept_trade: product.acceptTrade,
          payment_methods: product.paymentMethods,
          product_images: product.images.map((img) => ({
            id: img.id,
            name: '',
            uri: img.path,
            type: '',
          })),
          user: {
            id: '',
            name: '',
            email: '',
            tel: '',
            avatar: '',
          },
          user_id: product.userId,
          is_active: product.isActive,
        };
        setProduct(iProduct);
        setIs_active(product.isActive);
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
