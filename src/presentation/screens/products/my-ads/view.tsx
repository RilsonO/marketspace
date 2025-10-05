import {
  HStack,
  Text,
  VStack,
  useTheme,
  Pressable,
  Menu,
  FlatList,
} from 'native-base';
import { CaretDown, CaretUp, Plus } from 'phosphor-react-native';
import { useEffect } from 'react';
import { useMyAdsViewModel } from './view-model';
import { Ads } from '../../../components/ads/view';

export function MyAds() {
  const { colors, sizes } = useTheme();
  const {
    products,
    filter,
    filterIsOpened,
    productsUpdate,
    handleOpenCreateAd,
    handleFilterIsOpened,
    handleFilter,
  } = useMyAdsViewModel();

  useEffect(() => {
    productsUpdate();
  }, [filter]);

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
          {products.length} anúncio{products.length > 1 && 's'}
        </Text>

        <Menu
          w={111}
          trigger={(triggerProps) => {
            return (
              <Pressable
                testID='filter-button'
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
          onOpen={() => handleFilterIsOpened(true)}
          onClose={() => handleFilterIsOpened(false)}
          bgColor='white'
          mt='1'
        >
          <Menu.Item
            testID='todos-filter-item'
            onPress={() => handleFilter('Todos')}
            _text={{
              fontFamily: filter === 'Todos' ? 'bold' : 'regular',
              fontSize: 'sm',
              color: 'gray.600',
            }}
          >
            Todos
          </Menu.Item>
          <Menu.Item
            testID='ativos-filter-item'
            onPress={() => handleFilter('Ativos')}
            _text={{
              fontFamily: filter === 'Ativos' ? 'bold' : 'regular',
              fontSize: 'sm',
              color: 'gray.600',
            }}
          >
            Ativos
          </Menu.Item>
          <Menu.Item
            testID='inativos-filter-item'
            onPress={() => handleFilter('Inativos')}
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
        data={products}
        keyExtractor={(item) => String(item?.id || Math.random())}
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
