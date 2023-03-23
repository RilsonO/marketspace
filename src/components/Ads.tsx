import { Box, HStack, Image, Skeleton, Text, View, VStack } from 'native-base';
import { Dimensions } from 'react-native';
import { UserPhoto } from './UserPhoto';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png';
import { useState } from 'react';

const { width } = Dimensions.get('screen');
const MARGIN_BETWEEN = 32;
const IMAGE_WIDTH = width / 2 - MARGIN_BETWEEN;
const IMAGE_HEIGHT = (2 / 3) * IMAGE_WIDTH;

const PHOTO_SIZE = 6;

const unable = false;

type Props = {
  showAvatar?: boolean;
};

export function Ads({ showAvatar = true }: Props) {
  const [avatarIsLoading, setAvatarIsLoading] = useState(false);

  return (
    <VStack mb={4}>
      <VStack>
        <Image
          w={IMAGE_WIDTH}
          h={IMAGE_HEIGHT}
          rounded={6}
          source={{
            uri: 'https://a-static.mlcdn.com.br/800x560/sapato-social-masculino-ortopedico-linha-gel-lancamento-preto-fran-shoes/sapatofran/4864690112/0b3a05522da86db139269b10b1002b9f.jpeg',
          }}
          alt='Foto do produto'
          resizeMode='cover'
        />

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
                  false
                    ? defaultUserPhotoImg
                    : { uri: 'https://github.com/RilsonO.png' }
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
              NOVO
            </Text>
          </Box>
        </HStack>

        {unable && (
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
        Sapato preto
      </Text>
      <Text
        fontSize='xs'
        fontFamily={unable ? 'regular' : 'bold'}
        color={unable ? 'gray.400' : 'gray.700'}
      >
        R$
        <Text fontSize='md'>59,90</Text>
      </Text>
    </VStack>
  );
}
