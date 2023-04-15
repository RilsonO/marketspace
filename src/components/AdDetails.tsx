import { Box, HStack, ScrollView, Text, VStack, useTheme } from 'native-base';
import { ImageSlider, PhotoProps } from './ImageSlider';
import { UserPhoto } from './UserPhoto';
import { UserDTO } from '@dtos/UserDTO';
import { PaymentMethodsDTO } from '@dtos/PaymentMethodsDTO';
import { api } from '@services/api';
import {
  ArrowLeft,
  Bank,
  Barcode,
  CreditCard,
  Money,
  QrCode,
  Tag,
} from 'phosphor-react-native';

const PHOTO_SIZE = 6;

export type AdDetailsProps = {
  user: UserDTO;
  title: string;
  images: PhotoProps[];
  description: string;
  acceptTrade: boolean;
  isNew: boolean;
  paymentMethods: PaymentMethodsDTO[];
  price: string;
};

export function AdDetails({
  user,
  title,
  images,
  description,
  acceptTrade,
  isNew,
  paymentMethods,
  price,
}: AdDetailsProps) {
  const { colors, sizes } = useTheme();

  function paymentMethodIndicator(paymentMethod: PaymentMethodsDTO) {
    switch (paymentMethod) {
      case 'boleto':
        return (
          <>
            <Barcode size={sizes[5]} color={colors.gray[700]} />
            <Text fontFamily='regular' fontSize='sm' color='gray.600' ml='2'>
              Boleto
            </Text>
          </>
        );
      case 'pix':
        return (
          <>
            <QrCode size={sizes[5]} color={colors.gray[700]} />
            <Text fontFamily='regular' fontSize='sm' color='gray.600' ml='2'>
              Pix
            </Text>
          </>
        );
      case 'deposit':
        return (
          <>
            <Bank size={sizes[5]} color={colors.gray[700]} />
            <Text fontFamily='regular' fontSize='sm' color='gray.600' ml='2'>
              Depósito Bancário
            </Text>
          </>
        );
      case 'cash':
        return (
          <>
            <Money size={sizes[5]} color={colors.gray[700]} />
            <Text fontFamily='regular' fontSize='sm' color='gray.600' ml='2'>
              Dinheiro
            </Text>
          </>
        );
      case 'card':
        return (
          <>
            <CreditCard size={sizes[5]} color={colors.gray[700]} />
            <Text fontFamily='regular' fontSize='sm' color='gray.600' ml='2'>
              Cartão de Crédito
            </Text>
          </>
        );

      default:
        break;
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ImageSlider imagesUrl={images} />
      <VStack px='6'>
        <HStack my='6'>
          <UserPhoto
            source={{ uri: `${api.defaults.baseURL}/images/${user.avatar}` }}
            alt='Foto do vendedor'
            size={PHOTO_SIZE}
            borderWidth={2}
          />
          <Text fontFamily='regular' fontSize='sm' color='gray.700' ml='2'>
            {user.name}
          </Text>
        </HStack>

        <Box
          bg={isNew ? 'blue.400' : 'gray.300'}
          rounded='full'
          px='2'
          mb='2'
          alignSelf='flex-start'
        >
          <Text
            fontSize='xs-'
            fontFamily='bold'
            color={isNew ? 'gray.100' : 'gray.600'}
          >
            {isNew ? 'NOVO' : 'USADO'}
          </Text>
        </Box>

        <HStack alignItems='center' justifyContent='space-between'>
          <Text flex={1} fontFamily='bold' fontSize='lg+' color='gray.700'>
            {title}
          </Text>
          <Text
            numberOfLines={1}
            fontFamily='bold'
            fontSize='sm'
            color='blue.400'
            maxWidth='1/3'
          >
            R$ <Text fontSize='lg+'>{price}</Text>
          </Text>
        </HStack>

        <Text fontFamily='regular' fontSize='sm' color='gray.600'>
          {description}
        </Text>

        <Text fontFamily='bold' fontSize='sm' color='gray.600' mt='4'>
          Aceita troca?{' '}
          <Text fontFamily='regular'>{acceptTrade ? 'Sim' : 'Não'}</Text>
        </Text>

        <Text fontFamily='bold' fontSize='sm' color='gray.600' mt='4'>
          Meios de pagamento:
        </Text>

        {paymentMethods.map((item, index) => (
          <HStack key={item + String(index)} mt='1'>
            {paymentMethodIndicator(item)}
          </HStack>
        ))}
      </VStack>
    </ScrollView>
  );
}
