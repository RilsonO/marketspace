import {
  Box,
  HStack,
  Image,
  Pressable,
  Skeleton,
  Text,
  View,
  VStack,
} from 'native-base';
import { Dimensions } from 'react-native';
import { UserPhoto } from './UserPhoto';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png';
import { useState } from 'react';
import { IProduct } from 'src/interfaces/IProduct';
import { api } from '@services/api';
import { toMaskedPrice } from '@utils/Masks';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

const { width } = Dimensions.get('screen');
const MARGIN_BETWEEN = 32;
const IMAGE_WIDTH = width / 2 - MARGIN_BETWEEN;
const IMAGE_HEIGHT = (2 / 3) * IMAGE_WIDTH;

const PHOTO_SIZE = 6;

const unable = false;

type Props = IProduct & {
  showAvatar?: boolean;
};

export function Ads({
  showAvatar = true,
  product_images,
  user,
  is_new,
  is_active,
  name,
  price,
  id,
}: Props) {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const [avatarIsLoading, setAvatarIsLoading] = useState(false);

  function handleNavigateToAdDetails() {
    const productId: string = id as string;
    navigate('adDetails', { id: productId });
  }

  return (
    <Pressable onPress={handleNavigateToAdDetails}>
      <VStack mb={4}>
        <VStack>
          {product_images[0]?.uri ? (
            <Image
              w={IMAGE_WIDTH}
              h={IMAGE_HEIGHT}
              rounded={6}
              source={{
                uri: product_images[0].uri,
              }}
              alt='Foto do produto'
              resizeMode='cover'
            />
          ) : (
            <Box
              w={IMAGE_WIDTH}
              h={IMAGE_HEIGHT}
              rounded={6}
              bg='gray.700'
              alignItems='center'
              justifyContent='center'
            >
              <Text fontFamily='bold' fontSize='sm' color='gray.300'>
                SEM IMAGEM
              </Text>
            </Box>
          )}

          <HStack
            w='full'
            justifyContent='space-between'
            position='absolute'
            p='1'
          >
            {showAvatar ? (
              avatarIsLoading ? (
                <Skeleton
                  w={PHOTO_SIZE}
                  h={PHOTO_SIZE}
                  rounded='full'
                  startColor='gray.500'
                  endColor='gray.400'
                />
              ) : (
                <UserPhoto
                  source={
                    !user.avatar
                      ? defaultUserPhotoImg
                      : { uri: `${api.defaults.baseURL}/images/${user.avatar}` }
                  }
                  alt='Foto do usuário'
                  borderWidth={1}
                  borderColor='white'
                  size={PHOTO_SIZE}
                />
              )
            ) : (
              <View />
            )}

            <Box
              bg={true ? 'blue.700' : 'gray.600'}
              rounded='full'
              px='2'
              alignItems='center'
              justifyContent='center'
              h='4'
            >
              <Text fontSize='xs-' fontFamily='bold' color='white'>
                {is_new ? 'NOVO' : 'USADO'}
              </Text>
            </Box>
          </HStack>

          {is_active === false && (
            <>
              <Box
                w={IMAGE_WIDTH}
                h={IMAGE_HEIGHT}
                bg='gray.700:alpha.30'
                position='absolute'
                rounded={6}
              />

              <Text
                fontSize='xs'
                fontFamily='regular'
                color='gray.100'
                textTransform='uppercase'
                position='absolute'
                bottom={2}
                left={2}
              >
                Anúncio desativado
              </Text>
            </>
          )}
        </VStack>

        <Text
          fontSize='sm'
          fontFamily='regular'
          color={unable ? 'gray.400' : 'gray.600'}
        >
          {name}
        </Text>
        <Text
          fontSize='xs'
          fontFamily={unable ? 'regular' : 'bold'}
          color={unable ? 'gray.400' : 'gray.700'}
        >
          R$
          <Text fontSize='md'>{toMaskedPrice(String(price))}</Text>
        </Text>
      </VStack>
    </Pressable>
  );
}
