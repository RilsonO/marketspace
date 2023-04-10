import { useCallback, useMemo, useRef, useState } from 'react';
import { UserPhoto } from '@components/UserPhoto';
import {
  Center,
  Divider,
  FlatList,
  Flex,
  HStack,
  Pressable,
  Skeleton,
  Switch,
  Text,
  useTheme,
  View,
  VStack,
} from 'native-base';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png';
import { Button } from '@components/Button';
import {
  Plus,
  Tag,
  ArrowRight,
  MagnifyingGlass,
  Faders,
  X,
} from 'phosphor-react-native';
import { Input } from '@components/Input';
import { Ads } from '@components/Ads';
import { Modalize } from 'react-native-modalize';
import { Dimensions } from 'react-native';
import { Portal } from 'react-native-portalize';
import { TagButton } from '@components/TagButton';
import { Checkbox } from '@components/Checkbox';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';

const PHOTO_SIZE = 12;
const { height } = Dimensions.get('screen');

export function Home() {
  const { colors, sizes } = useTheme();
  const { user } = useAuth();

  const modalizeRef = useRef<Modalize>(null);

  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [groupPayments, setGroupPayments] = useState([]);
  const [exchange, setExchange] = useState(false);
  const [boleto, setBoleto] = useState();

  function handleOpenModalize() {
    modalizeRef.current?.open();
  }

  function handleCloseModalize() {
    modalizeRef.current?.close();
  }

  return (
    <VStack flex={1} px='6' safeAreaTop>
      <HStack w='full' mt='2'>
        {photoIsLoading ? (
          <Skeleton
            w={PHOTO_SIZE}
            h={PHOTO_SIZE}
            rounded='full'
            startColor='gray.500'
            endColor='gray.400'
          />
        ) : (
          <UserPhoto
            source={{ uri: `${api.defaults.baseURL}/images/${user.avatar}` }}
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
        />
      </HStack>

      <Text color='gray.500' fontSize='sm' fontFamily='regular' mt='6' mb='2'>
        Seus produtos anunciados para venda
      </Text>

      <Pressable
        p='4'
        bg='blue.400:alpha.10'
        rounded={6}
        alignItems='center'
        flexDirection='row'
      >
        <Tag size={22} color={colors.blue[700]} />

        <VStack flex={1} justifyContent='center' px='2'>
          <Text color='gray.600' fontSize='lg+' fontFamily='bold'>
            4
          </Text>
          <Text color='gray.600' fontSize='xs' fontFamily='regular'>
            anúncios ativos
          </Text>
        </VStack>

        <Text color='blue.700' fontSize='xs' fontFamily='bold' marginRight='2'>
          Meus anúncios
        </Text>

        <ArrowRight size={16} color={colors.blue[700]} />
      </Pressable>

      <Text color='gray.500' fontSize='sm' fontFamily='regular' mt='6' mb='2'>
        Compre produtos variados
      </Text>

      <Input
        placeholder='Buscar anúncio'
        autoComplete='off'
        autoCorrect={false}
        InputRightElement={
          <HStack w='16' marginRight={4}>
            <Flex direction='row'>
              <Pressable
                flex={1}
                onPress={() => {
                  console.log('search is called');
                }}
              >
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

      <FlatList
        data={[0, 1, 2, 3, 4]}
        keyExtractor={(item) => String(item)}
        renderItem={({ item }) => <Ads />}
        horizontal={false}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
        showsVerticalScrollIndicator={false}
      />

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
              <TagButton title='NOVO' checked />
              <TagButton title='USADO' />
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
              isChecked={exchange}
              onToggle={setExchange}
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
              value='boleto'
              onChange={(value) => {
                console.log('boleto', value);
              }}
              label={'Boleto'}
            />
            <Checkbox value='pix' label='Pix' />
            <Checkbox value='dinheiro' label='Dinheiro' />
            <Checkbox value='cartao' label='Cartão de Crédito' />
            <Checkbox value='deposito' label='Deposito Bancário' />

            <HStack my={10}>
              <Button
                title='Resetar filtros'
                bgColor='gray.300'
                flex={1}
                marginRight={2}
              />
              <Button
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
