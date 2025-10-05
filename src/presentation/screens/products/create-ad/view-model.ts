import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '../../../../main/routes/app.routes';
import { useToast } from 'native-base';
import { useEffect, useState } from 'react';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import { HomeTabsNavigatorRoutesProps } from '../../../../main/routes/home-tabs.routes';
import { IProduct } from '../../../../shared/types/interfaces/product.interface';
import { IPhoto } from '../../../../shared/types/interfaces/photo.interface';
import { PaymentMethod } from '../../../../entities/Product';
import { DomainError } from '../../../../domain/errors/DomainError';
import { useAuthContext } from '../../../../contexts/auth/use-auth.hook';
import {
  maskedPriceToNumber,
  toMaskedPrice,
} from '../../../../shared/utils/Masks.util';
import { client } from '../../../../infra/http/client.http';

export interface CreateAdViewModel {
  images: IPhoto[];
  name: string;
  description: string;
  isNew: string;
  price: string;
  acceptTrade: boolean;
  photoIsLoading: boolean;
  headerTitle: string;
  handleName: (value: string) => void;
  handleDescription: (value: string) => void;
  handleIsNew: (value: string) => void;
  handlePrice: (value: string) => void;
  handleAcceptTrade: (value: boolean) => void;
  handleGoBackToMyAdsScreen: () => void;
  handlePhotoSelect: () => Promise<void>;
  handleRemovePhoto: (photo: IPhoto) => void;
  findPaymentMethod: (payment_method: PaymentMethod) => boolean;
  handlePaymentMethods: (payment_method: PaymentMethod) => void;
  handleNavigateToAdPreview: () => void;
}

function useCreateAdViewModel(): CreateAdViewModel {
  const { user } = useAuthContext();
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const { navigate: navigateTabs } =
    useNavigation<HomeTabsNavigatorRoutesProps>();
  const toast = useToast();
  const route = useRoute();

  const params = route.params as IProduct;

  const [images, setImages] = useState<IPhoto[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isNew, setIsNew] = useState<string>('');
  const [price, setPrice] = useState('');
  const [acceptTrade, setAcceptTrade] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [headerTitle, setHeaderTitle] = useState('Criar anúncio');

  function handleName(value: string) {
    setName(value);
  }

  function handleDescription(value: string) {
    setDescription(value);
  }

  function handleIsNew(value: string) {
    setIsNew(value);
  }

  function handlePrice(value: string) {
    setPrice(value);
  }

  function handleAcceptTrade(value: boolean) {
    setAcceptTrade(value);
  }

  function handleGoBackToMyAdsScreen() {
    navigateTabs('myAds');
  }

  async function handlePhotoSelect() {
    setPhotoIsLoading(true);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });
      if (photoSelected.canceled) return;
      if (photoSelected.assets[0].uri) {
        const fileExtension = photoSelected.assets[0].uri.split('.').pop();
        const photoFile = {
          name: `${String(uuid.v4())}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        };
        setImages((prev) => [photoFile, ...prev]);
      }
    } catch (error) {
      const isDomainError = error instanceof DomainError;
      const title = isDomainError
        ? error.message
        : 'Não foi possível utilizar a foto. Tente novamente mais tarde.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setPhotoIsLoading(false);
    }
  }

  function handleRemovePhoto(photo: IPhoto) {
    setImages((prev) =>
      prev.filter((item) => {
        if (
          item.name === photo.name &&
          photo.uri.match(`${client.defaults.baseURL}/images/`)
        ) {
          setImagesToDelete((prev) => [...prev, photo.name]);
        }
        return item.name !== photo.name;
      })
    );
  }

  function findPaymentMethod(payment_method: PaymentMethod): boolean {
    return paymentMethods.includes(payment_method);
  }

  function handlePaymentMethods(payment_method: PaymentMethod) {
    const existMethod = findPaymentMethod(payment_method);
    if (existMethod) {
      setPaymentMethods((prev) =>
        prev.filter((item) => item !== payment_method)
      );
    } else {
      setPaymentMethods((prev) => [...prev, payment_method]);
    }
  }

  function handleNavigateToAdPreview() {
    if (images.length <= 0) {
      return toast.show({
        title: 'Adicione ao menos uma foto do seu produto.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
    if (name === '') {
      return toast.show({
        title: 'Informe o título do seu anúncio.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
    if (description === '') {
      return toast.show({
        title: 'Informe a descrição do seu anúncio.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
    if (isNew === '') {
      return toast.show({
        title: 'Informe o estado do seu produto.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
    const rawPrice = Number(maskedPriceToNumber(price)) * 100;
    if (price === '' || rawPrice <= 0) {
      return toast.show({
        title: 'Informe o valor do seu produto.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
    if (paymentMethods.length <= 0) {
      return toast.show({
        title: 'Informe ao menos um método de pagamento.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
    navigate('previewAd', {
      user: {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        tel: user!.phone,
        avatar: user!.avatar,
      },
      product_images: images,
      name,
      description,
      is_new: isNew === 'Produto novo',
      price: rawPrice,
      accept_trade: acceptTrade,
      payment_methods: paymentMethods,
      imagesToDelete: imagesToDelete,
      id: params?.id,
      is_active: isActive,
    });
  }

  useEffect(() => {
    if (params) {
      setImages(params.product_images);
      setName(params.name);
      setDescription(params.description);
      setIsNew(params.is_new ? 'Produto novo' : 'Produto usado');
      setPrice(toMaskedPrice(String(params.price)));
      setAcceptTrade(params.accept_trade);
      setPaymentMethods(params.payment_methods);
      setIsActive(params?.is_active ?? true);
      setImagesToDelete([]);
      setHeaderTitle('Editar anúncio');
    }
  }, [params]);

  return {
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
  };
}

export { useCreateAdViewModel };
