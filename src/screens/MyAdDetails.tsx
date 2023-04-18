import { Button } from '@components/Button';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import {
  HStack,
  Pressable,
  Text,
  VStack,
  useTheme,
  useToast,
} from 'native-base';
import {
  ArrowLeft,
  PencilSimpleLine,
  Power,
  TrashSimple,
} from 'phosphor-react-native';
import { api } from '@services/api';
import { AdDetails } from '@components/AdDetails';
import { AppError } from '@utils/AppError';
import { useCallback, useEffect, useState } from 'react';
import { IProduct } from 'src/interfaces/IProduct';
import { ProductMap } from '@mappers/ProductMap';
import { Loading } from '@components/Loading';
import { HomeTabsNavigatorRoutesProps } from '@routes/home.tabs.routes';

type ParamsProps = {
  id: string;
};

export function MyAdDetails() {
  const { colors, sizes } = useTheme();
  const toast = useToast();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const { navigate: navigateHomeTabs } =
    useNavigation<HomeTabsNavigatorRoutesProps>();
  const route = useRoute();

  const params = route.params as ParamsProps;

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [is_active, setIs_active] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IProduct>({} as IProduct);

  function handleGoBack() {
    navigateHomeTabs('myAds');
  }

  function handleNavigateToEditAd() {
    navigate('createAd', data);
  }

  async function handleDeleteAd() {
    try {
      setIsDeleting(true);
      await api.delete(`/products/${params.id}`);

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
    try {
      setIsDeleting(true);
      const { data } = await api.patch(`/products/${params.id}`, {
        is_active: !is_active,
      });

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
      setIsDeleting(false);
    }
  }

  async function fetchData() {
    try {
      setIsLoading(true);

      const { data } = await api.get(`/products/${params.id}`);

      setData(ProductMap.toIProduct(data));
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

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <VStack flex={1}>
      <HStack
        safeAreaTop
        alignItems='center'
        justifyContent='space-between'
        p='4'
      >
        <Pressable onPress={handleGoBack}>
          <ArrowLeft size={sizes[6]} color={colors.gray[700]} />
        </Pressable>

        <Pressable onPress={handleNavigateToEditAd}>
          <PencilSimpleLine size={sizes[6]} color={colors.gray[700]} />
        </Pressable>
      </HStack>

      {isLoading ? <Loading /> : <AdDetails {...data} is_active={is_active} />}

      <VStack safeAreaBottom pt='6' px='6' style={{ gap: 4 }}>
        <Button
          alignSelf='center'
          title={is_active ? 'Desativar anúncio' : 'Reativar anúncio'}
          bgColor={is_active ? 'gray.700' : 'blue.400'}
          leftIcon={<Power size={sizes[4]} color={colors.gray[200]} />}
          onPress={handleDisableAd}
          isLoading={isUpdating}
          disabled={isDeleting}
        />
        <Button
          title='Excluir anúncio'
          bgColor='gray.300'
          leftIcon={<TrashSimple size={sizes[4]} color={colors.gray[500]} />}
          isLoading={isDeleting}
          disabled={isUpdating}
          onPress={handleDeleteAd}
        />
      </VStack>
    </VStack>
  );
}
