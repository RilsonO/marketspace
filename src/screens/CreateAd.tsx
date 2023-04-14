import { Button } from '@components/Button';
import { Checkbox } from '@components/Checkbox';
import { Input } from '@components/Input';
import { Radio } from '@components/Radio';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { maskedPriceToNumber, toMaskedPrice } from '@utils/Masks';
import {
  Center,
  FlatList,
  HStack,
  Pressable,
  ScrollView,
  Skeleton,
  Switch,
  Text,
  VStack,
  useTheme,
  useToast,
} from 'native-base';
import { ArrowLeft, Plus, X } from 'phosphor-react-native';
import { useState } from 'react';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import { AppError } from '@utils/AppError';
import { ProductSmallPhoto } from '@components/ProductSmallPhoto';
import { PaymentMethodsDTO } from '@dtos/PaymentMethodsDTO';

type PhotoProps = {
  name: string;
  uri: string;
  type: string;
};

const PHOTO_SIZE = 100;

export function CreateAd() {
  const { colors, sizes } = useTheme();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();

  const [images, setImages] = useState<PhotoProps[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isNew, setIsNew] = useState<boolean | null>(null);
  const [price, setPrice] = useState('');
  const [acceptTrade, setAcceptTrade] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodsDTO[]>([]);

  function handleGoBackToMyAdsScreen() {
    navigate('myAds');
  }

  async function handlePhotoSelect() {
    setPhotoIsLoading(true);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) return;

      if (photoSelected.assets[0].uri) {
        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${String(uuid.v4())}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        setImages((prev) => [photoFile, ...prev]);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível utilizar a foto. Tente novamente mais tarde.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setPhotoIsLoading(false);
    }
  }

  function handleRemovePhoto(name: string) {
    setImages((prev) => prev.filter((item) => item.name !== name));
  }

  function handlePaymentMethods(payment_method: PaymentMethodsDTO) {
    const existMethod = paymentMethods.find(
      (paymentMethod) => paymentMethod === payment_method
    );

    if (existMethod) {
      setPaymentMethods((prev) =>
        prev.filter((item) => item !== payment_method)
      );
    } else {
      setPaymentMethods((prev) => [...prev, payment_method]);
    }
  }

  function handleCancel() {
    setImages([]);
    setTitle('');
    setDescription('');
    setIsNew(null);
    setPrice('');
    setAcceptTrade(false);
    setPaymentMethods([]);
    handleGoBackToMyAdsScreen();
  }

  function handleNavigateToAdPreview() {
    if (images.length <= 0) {
      return toast.show({
        title: 'Adicione ao menos uma foto do seu produto.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }

    if (title === '') {
      return toast.show({
        title: 'Informe o título do seu anúncio.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }

    if (description === '') {
      return toast.show({
        title: 'Informe a descrição do seu anúncio.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }

    if (isNew === null) {
      return toast.show({
        title: 'Informe o estado do seu produto.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }

    const rawPrice = Number(maskedPriceToNumber(price)) * 100;

    if (price === '' || rawPrice <= 0) {
      return toast.show({
        title: 'Informe o valor do seu produto.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }

    if (paymentMethods.length <= 0) {
      return toast.show({
        title: 'Informe ao menos um método de pagamento.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }

    // console.log('preço convertido: ', maskedPriceToNumber(price));
    console.log('imagens =>', images);
    console.log('título =>', title);
    console.log('descrição =>', description);
    console.log('é novo =>', isNew);
    console.log('preço =>', rawPrice);
    console.log('aceita troca =>', acceptTrade);
    console.log('métodos de pagamento =>', paymentMethods);
  }

  return (
    <VStack flex={1} safeAreaTop>
      <HStack w='full' alignItems='center' justifyContent='center' px='6'>
        <Pressable
          position='absolute'
          left={0}
          ml='6'
          onPress={handleGoBackToMyAdsScreen}
        >
          <ArrowLeft size={sizes[6]} color={colors.gray[700]} />
        </Pressable>

        <Text color='gray.700' fontFamily='bold' fontSize='lg+'>
          Criar anúncio
        </Text>
      </HStack>

      <ScrollView px='6' contentContainerStyle={{ paddingBottom: 20 }}>
        <Text color='gray.600' fontFamily='bold' fontSize='md' mt={6} mb={1}>
          Imagens
        </Text>

        <Text color='gray.500' fontFamily='regular' fontSize='sm'>
          Escolha até 3 imagens para mostrar o quando o seu produto é incrível!
        </Text>

        <FlatList
          data={images}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <VStack>
              <ProductSmallPhoto
                source={{ uri: item.uri }}
                alt='Foto do produto'
                size={PHOTO_SIZE}
              />
              <Pressable
                w='4'
                h='4'
                rounded='full'
                bg='gray.600'
                alignItems='center'
                justifyContent='center'
                position='absolute'
                top={1}
                right={1}
                onPress={() => handleRemovePhoto(item.name)}
              >
                <X size={12} color={'white'} />
              </Pressable>
            </VStack>
          )}
          ListHeaderComponent={
            photoIsLoading ? (
              <Skeleton
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded={6}
                startColor='gray.500'
                endColor='gray.400'
              />
            ) : null
          }
          ListFooterComponent={
            images.length < 3 ? (
              <Pressable
                w={100}
                h={100}
                rounded={6}
                bg='gray.300'
                alignItems='center'
                justifyContent='center'
                onPress={handlePhotoSelect}
              >
                <Plus size={sizes[6]} color={colors.gray[400]} />
              </Pressable>
            ) : null
          }
          contentContainerStyle={{
            paddingVertical: sizes[6],
            gap: 8,
          }}
          horizontal
        />

        <Text color='gray.600' fontFamily='bold' fontSize='md' mb='3'>
          Sobre o produto
        </Text>

        <Input
          placeholder='Título do anúncio'
          value={title}
          onChangeText={setTitle}
        />

        <Input
          placeholder='Descrição do produto'
          value={description}
          onChangeText={setDescription}
          h='40'
          multiline
        />

        <Radio
          data={['Produto novo', 'Produto usado']}
          name='Estado do produto'
          accessibilityLabel='Escolha o estado do produto'
          onChange={(newValue) => {
            setIsNew(newValue === 'Produto novo');
          }}
        />

        <Text color='gray.600' fontFamily='bold' fontSize='md' mt={6} mb={3}>
          Venda
        </Text>

        <Input
          leftElement={
            <Text color='gray.700' fontFamily='regular' fontSize='md' ml='4'>
              R$
            </Text>
          }
          placeholder='Valor do produto'
          value={price}
          onChangeText={(text) => {
            setPrice(toMaskedPrice(text));
          }}
        />

        <Text color='gray.600' fontFamily='bold' fontSize='md' mt={6} mb={3}>
          Aceita troca?
        </Text>
        <Switch
          size='sm'
          alignSelf='flex-start'
          offTrackColor='gray.300'
          onTrackColor='blue.400'
          isChecked={acceptTrade}
          onToggle={setAcceptTrade}
        />

        <Text fontSize='md' fontFamily='bold' color='gray.600' mt={6} mb={3}>
          Meios de pagamento aceitos
        </Text>
        <Checkbox
          value='boleto'
          onChange={() => {
            handlePaymentMethods('boleto');
          }}
          label={'Boleto'}
        />
        <Checkbox
          value='pix'
          onChange={() => {
            handlePaymentMethods('pix');
          }}
          label='Pix'
        />
        <Checkbox
          value='cash'
          onChange={() => {
            handlePaymentMethods('cash');
          }}
          label='Dinheiro'
        />
        <Checkbox
          value='card'
          onChange={() => {
            handlePaymentMethods('card');
          }}
          label='Cartão de Crédito'
        />
        <Checkbox
          value='deposit'
          onChange={() => {
            handlePaymentMethods('deposit');
          }}
          label='Deposito Bancário'
        />
      </ScrollView>

      <HStack w='full' safeAreaBottom bg='white' pt='6' px='6'>
        <Button
          title='Cancelar'
          flex={1}
          bgColor='gray.300'
          marginRight={2}
          onPress={handleCancel}
        />
        <Button
          title='Avançar'
          flex={1}
          bgColor='gray.700'
          marginLeft={2}
          onPress={handleNavigateToAdPreview}
        />
      </HStack>
    </VStack>
  );
}
