import { Box, HStack, ScrollView, Text, VStack, useTheme } from 'native-base';
import { ImageSlider } from './ImageSlider';
import { UserPhoto } from './UserPhoto';
import { api } from '@services/api';
import {
  Bank,
  Barcode,
  CreditCard,
  Money,
  QrCode,
} from 'phosphor-react-native';
import { IProduct } from 'src/interfaces/IProduct';
import { toMaskedPrice } from '@utils/Masks';
import { IPaymentMethods } from 'src/interfaces/IPaymentMethods';

const PHOTO_SIZE = 6;

export function AdDetails({
  user,
  name,
  product_images,
  description,
  accept_trade,
  is_new,
  payment_methods,
  price,
  is_active = true,
}: IProduct) {
  const { colors, sizes } = useTheme();

  function paymentMethodIndicator(paymentMethod: IPaymentMethods) {
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
      <ImageSlider imagesUrl={product_images} disabled={!is_active} />

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
          bg={is_new ? 'blue.400' : 'gray.300'}
          rounded='full'
          px='2'
          mb='2'
          alignSelf='flex-start'
        >
          <Text
            fontSize='xs-'
            fontFamily='bold'
            color={is_new ? 'gray.100' : 'gray.600'}
          >
            {is_new ? 'NOVO' : 'USADO'}
          </Text>
        </Box>

        <HStack alignItems='center' justifyContent='space-between'>
          <Text flex={1} fontFamily='bold' fontSize='lg+' color='gray.700'>
            {name}
          </Text>
          <Text
            numberOfLines={1}
            fontFamily='bold'
            fontSize='sm'
            color='blue.400'
            maxWidth='1/3'
          >
            R$ <Text fontSize='lg+'>{toMaskedPrice(String(price / 100))}</Text>
          </Text>
        </HStack>

        <Text fontFamily='regular' fontSize='sm' color='gray.600'>
          {description}
        </Text>

        <Text fontFamily='bold' fontSize='sm' color='gray.600' mt='4'>
          Aceita troca?{' '}
          <Text fontFamily='regular'>{accept_trade ? 'Sim' : 'Não'}</Text>
        </Text>

        <Text fontFamily='bold' fontSize='sm' color='gray.600' mt='4'>
          Meios de pagamento:
        </Text>

        {payment_methods.map((item, index) => (
          <HStack key={item + String(index)} mt='1'>
            {paymentMethodIndicator(item)}
          </HStack>
        ))}
      </VStack>
    </ScrollView>
  );
}
