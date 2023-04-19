import { Button } from '@components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { HStack, Text, VStack, useTheme, useToast } from 'native-base';
import { ArrowLeft, Tag } from 'phosphor-react-native';
import { api } from '@services/api';
import { AdDetails } from '@components/AdDetails';
import { useState } from 'react';
import { AppError } from '@utils/AppError';
import { IPhoto } from 'src/interfaces/IPhoto';
import { IProduct } from 'src/interfaces/IProduct';

export function PreviewAd() {
  const { colors, sizes } = useTheme();
  const { navigate, goBack } = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const toast = useToast();

  const params = route.params as IProduct & { imagesToDelete: string[] };

  const [isLoading, setIsLoading] = useState(false);

  function handleGoBack() {
    goBack();
  }

  async function handlePublish() {
    try {
      setIsLoading(true);

      const { data } = await api.post('/products', {
        name: params.name,
        description: params.description,
        is_new: params.is_new,
        price: Number(params.price.toFixed(0)),
        accept_trade: params.accept_trade,
        payment_methods: params.payment_methods,
      });

      const formData = new FormData();
      formData.append('product_id', data.id);

      params.product_images.map((photo) => {
        formData.append('images', photo as any);
      });

      await api.post('/products/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('adDetails', { id: data.id });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível cadastrar o seu produto. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdate() {
    try {
      setIsLoading(true);
      if (params.imagesToDelete.length > 0) {
        await api.delete('/products/images', {
          data: { productImagesIds: params.imagesToDelete },
        });
      }

      await api.put(`/products/${params.id}`, {
        name: params.name,
        description: params.description,
        is_new: params.is_new,
        price: Number(params.price.toFixed(0)),
        accept_trade: params.accept_trade,
        payment_methods: params.payment_methods,
      });

      let imagesToUpload = [] as IPhoto[];
      params.product_images.map((photo) => {
        if (!photo.uri.match(`${api.defaults.baseURL}/images/`)) {
          imagesToUpload = [...imagesToUpload, photo];
        }
      });

      if (imagesToUpload.length > 0) {
        const formData = new FormData();
        formData.append('product_id', params.id as string);

        imagesToUpload.map((photo) => {
          if (!photo.uri.match(`${api.defaults.baseURL}/images/`)) {
            formData.append('images', photo as any);
          }
        });

        await api.post('/products/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      navigate('adDetails', { id: params.id as string });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar o seu produto. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

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
          onPress={!!params.id ? handleUpdate : handlePublish}
          isLoading={isLoading}
        />
      </HStack>
    </VStack>
  );
}
