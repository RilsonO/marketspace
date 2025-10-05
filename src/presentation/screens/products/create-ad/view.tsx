import {
  FlatList,
  HStack,
  Pressable,
  ScrollView,
  Skeleton,
  Switch,
  Text,
  VStack,
  useTheme,
} from 'native-base';
import { ArrowLeft, Plus, X } from 'phosphor-react-native';
import { useCreateAdViewModel } from './view-model';
import { Input } from '../../../components/input/view';
import {
  maskedPriceToNumber,
  toMaskedPrice,
} from '../../../../shared/utils/Masks.util';
import { Checkbox } from '../../../components/checkbox/view';
import { Radio } from '../../../components/radio/view';
import { Button } from '../../../components/button/view';
import { ProductSmallPhoto } from '../../../components/product-small-photo/view';
import { PaymentMethod } from '../../../../entities/Product';

const PHOTO_SIZE = 100;

export function CreateAd() {
  const { colors, sizes } = useTheme();
  const {
    images,
    name,
    description,
    isNew,
    price,
    acceptTrade,
    photoIsLoading,
    headerTitle,
    handleName,
    handleDescription,
    handleIsNew,
    handlePrice,
    handleAcceptTrade,
    handleGoBackToMyAdsScreen,
    handlePhotoSelect,
    handleRemovePhoto,
    findPaymentMethod,
    handlePaymentMethods,
    handleNavigateToAdPreview,
  } = useCreateAdViewModel();

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
          {headerTitle}
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
                onPress={() => handleRemovePhoto(item)}
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
          value={name}
          onChangeText={handleName}
        />

        <Input
          placeholder='Descrição do produto'
          value={description}
          onChangeText={handleDescription}
          h='40'
          multiline
        />

        <Radio
          data={['Produto novo', 'Produto usado']}
          name='Estado do produto'
          accessibilityLabel='Escolha o estado do produto'
          value={isNew}
          onChange={(newValue) => {
            handleIsNew(newValue);
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
            if (text === '0,0' || text === '0,') {
              handlePrice('');
              return;
            }

            const firstMaskedText = toMaskedPrice(text);
            const firstMaskedTextConvertToNumber =
              maskedPriceToNumber(firstMaskedText);
            const cleanMaskedText = toMaskedPrice(
              firstMaskedTextConvertToNumber
            );
            handlePrice(cleanMaskedText);
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
          onToggle={handleAcceptTrade}
        />

        <Text fontSize='md' fontFamily='bold' color='gray.600' mt={6} mb={3}>
          Meios de pagamento aceitos
        </Text>
        <Checkbox
          value='boleto'
          isChecked={findPaymentMethod(PaymentMethod.BOLETO)}
          onChange={() => {
            handlePaymentMethods(PaymentMethod.BOLETO);
          }}
          label={'Boleto'}
        />
        <Checkbox
          value='pix'
          isChecked={findPaymentMethod(PaymentMethod.PIX)}
          onChange={() => {
            handlePaymentMethods(PaymentMethod.PIX);
          }}
          label='Pix'
        />
        <Checkbox
          value='cash'
          isChecked={findPaymentMethod(PaymentMethod.DINHEIRO)}
          onChange={() => {
            handlePaymentMethods(PaymentMethod.DINHEIRO);
          }}
          label='Dinheiro'
        />
        <Checkbox
          value='card'
          isChecked={findPaymentMethod(PaymentMethod.CARTAO_CREDITO)}
          onChange={() => {
            handlePaymentMethods(PaymentMethod.CARTAO_CREDITO);
          }}
          label='Cartão de Crédito'
        />
        <Checkbox
          value='deposit'
          isChecked={findPaymentMethod(PaymentMethod.DEPOSITO_BANCARIO)}
          onChange={() => {
            handlePaymentMethods(PaymentMethod.DEPOSITO_BANCARIO);
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
          onPress={handleGoBackToMyAdsScreen}
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
