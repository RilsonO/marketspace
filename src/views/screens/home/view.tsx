import { UserPhoto } from '@views/components/UserPhoto';
import {
  Divider,
  FlatList,
  Flex,
  HStack,
  Pressable,
  Skeleton,
  Switch,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import { Button } from '@views/components/Button';
import {
  Plus,
  Tag,
  ArrowRight,
  MagnifyingGlass,
  Faders,
  X,
} from 'phosphor-react-native';
import { Input } from '@views/components/Input';
import { Ads } from '@views/components/Ads';
import { Modalize } from 'react-native-modalize';
import { Dimensions } from 'react-native';
import { Portal } from 'react-native-portalize';
import { TagButton } from '@views/components/TagButton';
import { Checkbox } from '@views/components/Checkbox';
import { Loading } from '@views/components/Loading';
import { client } from '@infra/http/client.http';
import { useHomeViewModel } from './view-model';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';

const PHOTO_SIZE = 12;
const { height } = Dimensions.get('screen');

export function Home() {
  const { colors, sizes } = useTheme();
  const {
    user,
    isFetchLoading,
    search,
    isLoading,
    data,
    modalizeRef,
    isNew,
    acceptTrade,
    handleOpenCreateAd,
    handleNavigateToMyAds,
    countActiveAds,
    fetchFilteredProducts,
    handleOpenModalize,
    handleCloseModalize,
    handleIsNew,
    findPaymentMethod,
    handlePaymentMethods,
    handleResetFilters,
    onChangeSearch,
    onToggleAcceptTrade,
    fetchUserData,
  } = useHomeViewModel();

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  useEffect(() => {
    fetchFilteredProducts();
  }, []);

  return (
    <VStack flex={1} px='6' safeAreaTop>
      <HStack w='full' mt='2'>
        {!user.avatar ? (
          <Skeleton
            testID='user-photo-skeleton'
            w={PHOTO_SIZE}
            h={PHOTO_SIZE}
            rounded='full'
            startColor='gray.500'
            endColor='gray.400'
          />
        ) : (
          <UserPhoto
            testID='user-photo'
            source={{ uri: `${client.defaults.baseURL}/images/${user.avatar}` }}
            alt='Foto do usuário'
            borderWidth={2}
            size={PHOTO_SIZE}
          />
        )}

        <VStack flex={1} justifyContent='center' px='2'>
          <Text color='gray.700' fontSize='md' fontFamily='regular'>
            Boas vindas,
          </Text>

          <Text color='gray.700' fontSize='md' fontFamily='bold'>
            {user.name}
          </Text>
        </VStack>

        <Button
          flex={1}
          title='Criar anúncio'
          bgColor='gray.700'
          leftIcon={<Plus size={16} color={colors.gray[200]} />}
          onPress={handleOpenCreateAd}
        />
      </HStack>

      <Text color='gray.500' fontSize='sm' fontFamily='regular' mt='6' mb='2'>
        Seus produtos anunciados para venda
      </Text>

      {isFetchLoading && user.products?.length <= 0 ? (
        <Skeleton
          w='full'
          h={16}
          rounded={6}
          startColor='gray.500'
          endColor='gray.400'
        />
      ) : (
        <Pressable
          p='4'
          bg='blue.400:alpha.10'
          rounded={6}
          alignItems='center'
          flexDirection='row'
          onPress={handleNavigateToMyAds}
        >
          <Tag size={22} color={colors.blue[700]} />

          <VStack flex={1} justifyContent='center' px='2'>
            <Text color='gray.600' fontSize='lg+' fontFamily='bold'>
              {countActiveAds()}
            </Text>
            <Text color='gray.600' fontSize='xs' fontFamily='regular'>
              anúncios ativos
            </Text>
          </VStack>

          <Text
            color='blue.700'
            fontSize='xs'
            fontFamily='bold'
            marginRight='2'
          >
            Meus anúncios
          </Text>

          <ArrowRight size={16} color={colors.blue[700]} />
        </Pressable>
      )}

      <Text color='gray.500' fontSize='sm' fontFamily='regular' mt='6' mb='2'>
        Compre produtos variados
      </Text>

      <Input
        placeholder='Buscar anúncio'
        autoComplete='off'
        autoCorrect={false}
        value={search}
        onChangeText={onChangeSearch}
        onSubmitEditing={fetchFilteredProducts}
        returnKeyType='search'
        InputRightElement={
          <HStack w='16' marginRight={4}>
            <Flex direction='row'>
              <Pressable flex={1} onPress={fetchFilteredProducts}>
                <MagnifyingGlass size={20} color={colors.gray[600]} />
              </Pressable>

              <Divider bg='gray.400' orientation='vertical' />

              <Pressable
                flex={1}
                alignItems='flex-end'
                onPress={handleOpenModalize}
              >
                <Faders size={20} color={colors.gray[600]} />
              </Pressable>
            </Flex>
          </HStack>
        }
      />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <Ads {...item} />}
          horizontal={false}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          contentContainerStyle={
            data.length <= 0 && {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              color='gray.500'
              fontSize='sm'
              fontFamily='regular'
              mt='6'
              mb='2'
            >
              Nenhum anúncio encontrado!
            </Text>
          }
        />
      )}

      <Portal>
        <Modalize
          ref={modalizeRef}
          snapPoint={height - height * 0.1}
          modalHeight={height - height * 0.1}
          avoidKeyboardLikeIOS
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          handlePosition='inside'
          HeaderComponent={
            <HStack mt='10' alignItems='center' justifyContent='space-between'>
              <Text fontFamily='bold' fontSize='lg+' color='gray.700'>
                Filtrar anúncios
              </Text>

              <Pressable px='4' onPress={handleCloseModalize}>
                <X size={25} color={colors.gray[400]} />
              </Pressable>
            </HStack>
          }
          modalStyle={{
            backgroundColor: colors.gray[200],
            paddingHorizontal: sizes[6],
          }}
        >
          <VStack flex={1}>
            <Text
              fontSize='sm'
              fontFamily='bold'
              color='gray.600'
              mt={6}
              mb={3}
            >
              Condição
            </Text>
            <HStack>
              <TagButton
                title='NOVO'
                checked={isNew === true}
                onPress={() => handleIsNew(true)}
              />
              <TagButton
                title='USADO'
                checked={isNew === false}
                onPress={() => handleIsNew(false)}
              />
            </HStack>

            <Text
              fontSize='sm'
              fontFamily='bold'
              color='gray.600'
              mt={6}
              mb={3}
            >
              Aceita troca?
            </Text>
            <Switch
              size='sm'
              alignSelf='flex-start'
              offTrackColor='gray.300'
              onTrackColor='blue.400'
              isChecked={acceptTrade === null ? false : acceptTrade}
              onToggle={onToggleAcceptTrade}
            />

            <Text
              fontSize='sm'
              fontFamily='bold'
              color='gray.600'
              mt={6}
              mb={3}
            >
              Meios de pagamento aceitos
            </Text>
            <Checkbox
              isChecked={findPaymentMethod('boleto')}
              value='boleto'
              onChange={() => {
                handlePaymentMethods('boleto');
              }}
              label={'Boleto'}
            />
            <Checkbox
              isChecked={findPaymentMethod('pix')}
              value='pix'
              label='Pix'
              onChange={() => {
                handlePaymentMethods('pix');
              }}
            />
            <Checkbox
              isChecked={findPaymentMethod('cash')}
              value='cash'
              label='Dinheiro'
              onChange={() => {
                handlePaymentMethods('cash');
              }}
            />
            <Checkbox
              isChecked={findPaymentMethod('card')}
              value='card'
              label='Cartão de Crédito'
              onChange={() => {
                handlePaymentMethods('card');
              }}
            />
            <Checkbox
              isChecked={findPaymentMethod('deposit')}
              value='deposit'
              label='Deposito Bancário'
              onChange={() => {
                handlePaymentMethods('deposit');
              }}
            />

            <HStack my={10}>
              <Button
                onPress={handleResetFilters}
                title='Resetar filtros'
                bgColor='gray.300'
                flex={1}
                marginRight={2}
              />
              <Button
                onPress={fetchFilteredProducts}
                title='Aplicar filtros'
                bgColor='gray.700'
                flex={1}
                marginLeft={2}
              />
            </HStack>
          </VStack>
        </Modalize>
      </Portal>
    </VStack>
  );
}
