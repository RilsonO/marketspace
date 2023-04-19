import { Ads } from '@components/Ads';
import { useNavigation } from '@react-navigation/native';
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
import { useState } from 'react';

export function MyAds() {
  const { colors, sizes } = useTheme();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const [filter, setFilter] = useState('Todos');
  const [filterIsOpened, setFilterIsOpened] = useState(false);

  function handleOpenCreateAd() {
    navigate('createAd');
  }

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
          9 anúncios
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

      {/* <FlatList
        data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        keyExtractor={(item) => String(item)}
        renderItem={({ item }) => <Ads showAvatar={false} />}
        horizontal={false}
        numColumns={2}
        style={{
          marginTop: 15,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
        showsVerticalScrollIndicator={false}
      /> */}
    </VStack>
  );
}
