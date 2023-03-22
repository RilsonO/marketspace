import { Box, HStack, Image, Skeleton, Text, VStack } from 'native-base';
import { Dimensions } from 'react-native';
import { UserPhoto } from './UserPhoto';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png';

const { width } = Dimensions.get('screen');
const MARGIN_BETWEEN = 32;
const IMAGE_WIDTH = width / 2 - MARGIN_BETWEEN;
const IMAGE_HEIGHT = (2 / 3) * IMAGE_WIDTH;

const PHOTO_SIZE = 6;

export function Ads() {
  return (
    <VStack mb={4}>
      <HStack
        w='full'
        justifyContent='space-between'
        position='absolute'
        zIndex={100}
        p='1'
      >
        {false ? (
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

      <Text fontSize='sm' fontFamily='regular' color='gray.600'>
        Sapato preto
      </Text>
      <Text fontSize='xs' fontFamily='bold' color='gray.700'>
        R$
        <Text fontSize='md'>59,90</Text>
      </Text>
    </VStack>
  );
}
