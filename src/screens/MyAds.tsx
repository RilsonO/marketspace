import { Ads } from '@components/Ads';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import {
  Center,
  HStack,
  Text,
  VStack,
  useTheme,
  Pressable,
  Select,
  Menu,
  HamburgerIcon,
  FlatList,
} from 'native-base';
import { CaretDown, CaretUp, Plus } from 'phosphor-react-native';
import { useCallback, useEffect, useState } from 'react';
import { IProduct } from 'src/interfaces/IProduct';

export function MyAds() {
  const { colors, sizes } = useTheme();
  const { userProducts } = useAuth();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const [filter, setFilter] = useState('Todos');
  const [filterIsOpened, setFilterIsOpened] = useState(false);
  const [data, setData] = useState<IProduct[]>([] as IProduct[]);

  function handleOpenCreateAd() {
    navigate('createAd');
  }

  useEffect(() => {
    if (filter === 'Todos') {
      setData(userProducts);
    }
    if (filter === 'Ativos') {
      setData(userProducts.filter((product) => product.is_active === true));
    }
    if (filter === 'Inativos') {
      setData(userProducts.filter((product) => product.is_active === false));
    }
  }, [filter, userProducts]);

  return (
    <VStack flex={1} px='6' safeAreaTop>
      <HStack alignItems='center' justifyContent='center' mt='2' mb='4'>
        <Text fontFamily='bold' fontSize='lg+' color='gray.700'>
          Meus anúncios
        </Text>

        <Pressable position='absolute' right={0} onPress={handleOpenCreateAd}>
          <Plus size={sizes[6]} color={colors.gray[700]} weight='bold' />
        </Pressable>
      </HStack>

      <HStack justifyContent='space-between' alignItems='center'>
        <Text fontFamily='regular' fontSize='sm' color='gray.600'>
          {userProducts.length} anúncio{userProducts.length > 1 && 's'}
        </Text>

        <Menu
          w={111}
          trigger={(triggerProps) => {
            return (
              <Pressable
                accessibilityLabel='More options menu'
                flexDirection='row'
                borderRadius={6}
                borderWidth={1}
                borderColor='gray.400'
                alignItems='center'
                justifyContent='space-between'
                px='3'
                py='2'
                w={111}
                {...triggerProps}
              >
                <Text fontFamily='regular' fontSize='sm' color='gray.700'>
                  {filter}
                </Text>

                {filterIsOpened ? (
                  <CaretUp size={sizes[4]} color={colors.gray[500]} />
                ) : (
                  <CaretDown size={sizes[4]} color={colors.gray[500]} />
                )}
              </Pressable>
            );
          }}
          onOpen={() => setFilterIsOpened(true)}
          onClose={() => setFilterIsOpened(false)}
          bgColor='white'
          mt='1'
        >
          <Menu.Item
            onPress={() => setFilter('Todos')}
            _text={{
              fontFamily: filter === 'Todos' ? 'bold' : 'regular',
              fontSize: 'sm',
              color: 'gray.600',
            }}
          >
            Todos
          </Menu.Item>
          <Menu.Item
            onPress={() => setFilter('Ativos')}
            _text={{
              fontFamily: filter === 'Ativos' ? 'bold' : 'regular',
              fontSize: 'sm',
              color: 'gray.600',
            }}
          >
            Ativos
          </Menu.Item>
          <Menu.Item
            onPress={() => setFilter('Inativos')}
            _text={{
              fontFamily: filter === 'Inativos' ? 'bold' : 'regular',
              fontSize: 'sm',
              color: 'gray.600',
            }}
          >
            Inativos
          </Menu.Item>
        </Menu>
      </HStack>

      <FlatList
        data={data}
        keyExtractor={(item) => String(item)}
        renderItem={({ item }) => <Ads showAvatar={false} {...item} />}
        horizontal={false}
        numColumns={2}
        style={{
          marginTop: 15,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}
