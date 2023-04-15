import React, { useRef, useState } from 'react';
import { ViewToken, Dimensions } from 'react-native';
import { ImageIndicator } from './ImageIndicator';
import { Box, FlatList, HStack, Image, Text, VStack } from 'native-base';

const { width: WIDTH } = Dimensions.get('screen');

export type PhotoProps = {
  name: string;
  uri: string;
  type: string;
};

type Props = {
  imagesUrl: PhotoProps[];
};

interface ChangeImageProps {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

export function ImageSlider({ imagesUrl }: Props) {
  const [imageIndex, setImageIndex] = useState(0);

  const indexChanged = useRef((info: ChangeImageProps) => {
    const index = info.viewableItems[0].index!;
    setImageIndex(index);
  });

  return (
    <VStack w='full' h='72'>
      <FlatList
        data={imagesUrl}
        keyExtractor={(item, index) => item + String(index)}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.uri }}
            width={WIDTH}
            h='72'
            resizeMode='cover'
            alt='Foto do produto'
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={indexChanged.current}
        pagingEnabled
        scrollEnabled={imagesUrl.length > 1}
      />
      {imagesUrl.length > 1 && (
        <HStack
          w='full'
          alignItems='center'
          justifyContent='center'
          style={{ gap: 3 }}
          position='absolute'
          bottom={2}
        >
          {imagesUrl.map((item, index) => (
            <ImageIndicator
              key={String(item + String(index))}
              active={index === imageIndex}
              width={WIDTH / imagesUrl.length - 6}
            />
          ))}
        </HStack>
      )}
    </VStack>
  );
}
