import { useFocusEffect } from '@react-navigation/native';
import { Center, HStack, Pressable, Text, VStack, useTheme } from 'native-base';
import {
  ArrowLeft,
  PencilSimpleLine,
  Power,
  TrashSimple,
  WhatsappLogo,
} from 'phosphor-react-native';
import { AdDetails as AdDetailsComponent } from '../../../components/ad-details/view';
import { useCallback } from 'react';
import { useAdDetailsViewModel } from './view-model';
import { toMaskedPrice } from '../../../../shared/utils/Masks.util';
import { Button } from '../../../components/button/view';
import { Loading } from '../../../components/loading/view';

export function AdDetails() {
  const { colors, sizes } = useTheme();
  const {
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
  } = useAdDetailsViewModel();

  useFocusEffect(
    useCallback(() => {
      fetchProduct();
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

        {user?.id === product?.user_id && (
          <Pressable onPress={handleNavigateToEditAd}>
            <PencilSimpleLine size={sizes[6]} color={colors.gray[700]} />
          </Pressable>
        )}
      </HStack>

      {isLoading && <Loading />}

      {!isLoading && product && (
        <AdDetailsComponent {...product} is_active={is_active} />
      )}

      {!isLoading && !product && (
        <VStack flex={1}>
          <Center flex={1}>
            <Text>Falha ao carregar detalhes do produto</Text>
            <HStack paddingX={30} marginY={15}>
              <Button
                alignSelf='center'
                title={'Tentar novamente'}
                bgColor={'blue.400'}
                leftIcon={<Power size={sizes[4]} color={colors.gray[200]} />}
                onPress={fetchProduct}
                isLoading={isLoading}
                disabled={isLoading}
              />
            </HStack>
          </Center>
        </VStack>
      )}

      {product && (
        <>
          {user?.id === product?.user_id ? (
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
                leftIcon={
                  <TrashSimple size={sizes[4]} color={colors.gray[500]} />
                }
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
                R${' '}
                <Text fontSize='xl'>
                  {toMaskedPrice(String(product?.price ?? 0))}
                </Text>
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
          )}
        </>
      )}
    </VStack>
  );
}
