import { useAuthViewModel } from '@hooks/use-auth.hook';
import { client } from '@infra/http/client.http';
import {
  productCreate,
  productDeleteImagesById,
  productInsertImages,
  productUpdate,
} from '@infra/http/repositories/product.repository';
import { IPhoto } from '@interfaces/photo.interface';
import { IProduct } from '@interfaces/product.interface';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { AppError } from '@utils/AppError.util';
import { useToast } from 'native-base';
import { useState } from 'react';

export interface PreviewAdViewModel {
  isLoading: boolean;
  handleGoBack: () => void;
  handlePublish: () => Promise<void>;
  handleUpdate: () => Promise<void>;
  params: IProduct & { imagesToDelete: string[] };
}

function usePreviewAdViewModel(): PreviewAdViewModel {
  const { navigate, goBack } = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const toast = useToast();
  const { user } = useAuthViewModel();

  const params = route.params as IProduct & { imagesToDelete: string[] };

  const [isLoading, setIsLoading] = useState(false);

  function handleGoBack() {
    goBack();
  }

  async function handlePublish() {
    try {
      setIsLoading(true);
      const { data } = await productCreate({
        name: params.name,
        description: params.description,
        is_new: params.is_new,
        price: Number(params.price.toFixed(0)),
        accept_trade: params.accept_trade,
        payment_methods: params.payment_methods,
      });

      await productInsertImages({
        product_id: data.id,
        product_images: params.product_images,
      });
      await user.fetchProducts();
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
    if (!params.id) return;
    try {
      setIsLoading(true);
      if (params.imagesToDelete?.length > 0) {
        console.log('Entrei aqui', params.imagesToDelete);

        await productDeleteImagesById({
          productImagesIds: params.imagesToDelete,
        });
      }
      await productUpdate({
        id: params.id,
        name: params.name,
        description: params.description,
        is_new: params.is_new,
        price: Number(params.price.toFixed(0)),
        accept_trade: params.accept_trade,
        payment_methods: params.payment_methods,
      });

      let imagesToUpload = [] as IPhoto[];
      params.product_images.map((photo) => {
        if (!photo.uri.match(`${client.defaults.baseURL}/images/`)) {
          imagesToUpload = [...imagesToUpload, photo];
        }
      });
      if (imagesToUpload?.length > 0) {
        await productInsertImages({
          product_id: params.id as string,
          product_images: imagesToUpload,
        });
      }
      await user.fetchProducts();
      navigate('adDetails', { id: params.id as string });
    } catch (error) {
      console.log('Error=>', error);

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

  return {
    isLoading,
    params,
    handleGoBack,
    handlePublish,
    handleUpdate,
  };
}

export { usePreviewAdViewModel };
