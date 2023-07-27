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
// import {
//   ArrowLeft,
//   PencilSimpleLine,
//   Power,
//   TrashSimple,
//   WhatsappLogo,
// } from 'phosphor-react-native';
// import { api } from '@services/api';
// import { AdDetails as AdDetailsComponent } from '@components/AdDetails';
// import { AppError } from '@utils/AppError';
// import { useCallback, useEffect, useState } from 'react';
// import { IProduct } from 'src/interfaces/IProduct';
// import { ProductMap } from '@mappers/ProductMap';
// import { Loading } from '@components/Loading';
// import { HomeTabsNavigatorRoutesProps } from '@routes/home.tabs.routes';
// import { useAuth } from '@hooks/useAuthViewModel';
// import { toMaskedPrice, unMask } from '@utils/Masks';
// import { Linking, Platform } from 'react-native';

type ParamsProps = {
  id: string;
};

export function AdDetails() {
  const { colors, sizes } = useTheme();
  // const toast = useToast();
  // const { navigate, goBack } = useNavigation<AppNavigatorRoutesProps>();
  // const { navigate: navigateHomeTabs } =
  //   useNavigation<HomeTabsNavigatorRoutesProps>();
  // const route = useRoute();
  // const { user, fetchUserProducts } = useAuth();

  // const params = route.params as ParamsProps;

  // const [isUpdating, setIsUpdating] = useState(false);
  // const [isDeleting, setIsDeleting] = useState(false);
  // const [data, setData] = useState<IProduct>({} as IProduct);
  // const [is_active, setIs_active] = useState(true);
  // const [isLoading, setIsLoading] = useState(true);

  // function handleGoBack() {
  //   if (user.id === data?.user_id) {
  //     navigateHomeTabs('myAds');
  //   } else {
  //     goBack();
  //   }
  // }

  // function handleNavigateToEditAd() {
  //   navigate('createAd', data);
  // }

  // async function handleOpenWhatsApp() {
  //   const whatsappUrl = `https://wa.me/55${unMask(data.user.tel)}`;
  //   const whatsappSupported = await Linking.canOpenURL(whatsappUrl);

  //   if (whatsappSupported) {
  //     Linking.openURL(whatsappUrl);
  //   } else {
  //     toast.show({
  //       title:
  //         'Não foi possível contactar o vendedor. Tente novamente mais tarde.',
  //       placement: 'top',
  //       bgColor: 'red.500',
  //     });
  //   }
  // }

  // async function handleDeleteAd() {
  //   try {
  //     setIsDeleting(true);
  //     await api.delete(`/products/${params.id}`);
  //     await fetchUserProducts();
  //     handleGoBack();
  //   } catch (error) {
  //     const isAppError = error instanceof AppError;
  //     const title = isAppError
  //       ? error.message
  //       : 'Não foi possível excluir o anúncio. Tente novamente mais tarde.';

  //     toast.show({
  //       title,
  //       placement: 'top',
  //       bgColor: 'red.500',
  //     });
  //   } finally {
  //     setIsDeleting(false);
  //   }
  // }

  // async function handleDisableAd() {
  //   try {
  //     setIsUpdating(true);
  //     await api.patch(`/products/${params.id}`, {
  //       is_active: !is_active,
  //     });
  //     await fetchUserProducts();
  //     let dataState = data;
  //     dataState.is_active = !is_active;
  //     setData(dataState);
  //     setIs_active((prev) => !prev);
  //   } catch (error) {
  //     const isAppError = error instanceof AppError;
  //     const title = isAppError
  //       ? error.message
  //       : 'Não foi possível desativar o anúncio. Tente novamente mais tarde.';

  //     toast.show({
  //       title,
  //       placement: 'top',
  //       bgColor: 'red.500',
  //     });
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // }

  // async function fetchData() {
  //   try {
  //     setIsLoading(true);

  //     const { data } = await api.get(`/products/${params.id}`);

  //     setData(ProductMap.toIProduct(data));
  //     setIs_active(data.is_active);
  //   } catch (error) {
  //     const isAppError = error instanceof AppError;
  //     const title = isAppError
  //       ? error.message
  //       : 'Não foi possível carregar o anúncio. Tente novamente mais tarde.';

  //     toast.show({
  //       title,
  //       placement: 'top',
  //       bgColor: 'red.500',
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchData();
  //   }, [])
  // );

  return (
    <VStack flex={1}>
      {/* <HStack
        safeAreaTop
        alignItems='center'
        justifyContent='space-between'
        p='4'
      >
        <Pressable onPress={handleGoBack}>
          <ArrowLeft size={sizes[6]} color={colors.gray[700]} />
        </Pressable>

        {user.id === data?.user_id && (
          <Pressable onPress={handleNavigateToEditAd}>
            <PencilSimpleLine size={sizes[6]} color={colors.gray[700]} />
          </Pressable>
        )}
      </HStack>

      {isLoading ? (
        <Loading />
      ) : (
        <AdDetailsComponent {...data} is_active={is_active} />
      )}

      {user.id === data?.user_id ? (
        <VStack safeAreaBottom pt='6' pb='3' px='6' style={{ gap: 4 }}>
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
      ) : (
        <HStack
          safeAreaBottom
          pt='6'
          pb='3'
          px='6'
          alignItems='center'
          justifyContent='space-between'
          bg='white'
        >
          <Text
            numberOfLines={1}
            fontFamily='bold'
            fontSize='sm'
            color='blue.400'
            maxWidth='1/3'
            py='2'
          >
            R$ <Text fontSize='xl'>{toMaskedPrice(String(data.price))}</Text>
          </Text>
          <Button
            flex={1}
            maxWidth={'1/2'}
            title='Entrar em contato'
            bgColor='blue.400'
            leftIcon={
              <WhatsappLogo
                size={sizes[4]}
                weight='fill'
                color={colors.gray[200]}
              />
            }
            isLoading={isDeleting}
            disabled={isUpdating}
            onPress={handleOpenWhatsApp}
          />
        </HStack>
      )} */}
    </VStack>
  );
}
