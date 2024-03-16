import { Box, HStack, ScrollView, Text, VStack } from 'native-base';
import { ImageSlider } from '../image-slider/view';
import { IProduct } from 'src/interfaces/product.interface';
import { toMaskedPrice } from '@utils/Masks.util';
import { client } from '@infra/http/client.http';
import { UserPhoto } from '../user-photo/view';
import { useAdDetailsViewModel } from './view-model';
import { PaymentMethod } from './components/payment-method/view';

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
  const { paymentMethodsToShow } = useAdDetailsViewModel(payment_methods);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ImageSlider imagesUrl={product_images} disabled={!is_active} />

      <VStack px='6'>
        <HStack my='6'>
          <UserPhoto
            source={{ uri: `${client.defaults.baseURL}/images/${user.avatar}` }}
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
            R$ <Text fontSize='lg+'>{toMaskedPrice(String(price))}</Text>
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

        {paymentMethodsToShow.map((item, index) => (
          <HStack key={item + String(index)} mt='1'>
            <PaymentMethod title={item.title} icon={item.icon} />
          </HStack>
        ))}
      </VStack>
    </ScrollView>
  );
}
