import { AdDetails } from '../../../components/ad-details/view';
import { Button } from '../../../components/button/view';
import { HStack, Text, VStack, useTheme } from 'native-base';
import { ArrowLeft, Tag } from 'phosphor-react-native';
import { usePreviewAdViewModel } from './view-model';

export function PreviewAd() {
  const { colors, sizes } = useTheme();
  const { isLoading, params, handleGoBack, handlePublish, handleUpdate } =
    usePreviewAdViewModel();

  return (
    <VStack flex={1}>
      <VStack safeAreaTop bg='blue.400' alignItems='center' p='4'>
        <Text fontFamily='bold' fontSize='md' color='gray.100'>
          Pré visualização do anúncio
        </Text>
        <Text fontFamily='regular' fontSize='sm' color='gray.100'>
          É assim que seu produto vai aparecer!
        </Text>
      </VStack>

      <AdDetails {...params} />

      <HStack w='full' safeAreaBottom bg='white' pt='6' px='6'>
        <Button
          title='Voltar e editar'
          flex={1}
          bgColor='gray.300'
          marginRight={2}
          leftIcon={<ArrowLeft size={sizes[4]} color={colors.gray[600]} />}
          onPress={handleGoBack}
          disabled={isLoading}
        />
        <Button
          title='Publicar'
          flex={1}
          bgColor='blue.400'
          leftIcon={<Tag size={sizes[4]} color={colors.gray[200]} />}
          marginLeft={2}
          onPress={params.id ? handleUpdate : handlePublish}
          isLoading={isLoading}
        />
      </HStack>
    </VStack>
  );
}
