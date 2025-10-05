import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'native-base';
import {
  useForm,
  Control,
  UseFormHandleSubmit,
  FieldErrors,
} from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthContext } from '../../../../contexts/auth/use-auth.hook';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { DomainError } from '../../../../domain/errors/DomainError';
import uuid from 'react-native-uuid';
import { IPhoto } from '../../../../shared/types/interfaces/photo.interface';
import { signUp } from '../../../../infra/http/repositories/user.repository';

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  phone: yup
    .string()
    .required('Informe o telefone.')
    .min(14, 'Infome um telefone válido'),
  email: yup.string().required('Informe o email.').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Informe a senha.')
    .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_confirm: yup
    .string()
    .required('Confirme a senha.')
    .oneOf([yup.ref('password')], 'A confirmação da senha não confere.'),
});

type FormDataProps = yup.InferType<typeof signUpSchema>;

export interface SignUpViewModel {
  control: Control<FormDataProps>;
  handleSubmit: UseFormHandleSubmit<FormDataProps>;
  errors: FieldErrors<FormDataProps>;
  isLoading: boolean;
  photoIsLoading: boolean;
  photo: IPhoto;
  passwordSecureTextEntry: boolean;
  passwordConfirmSecureTextEntry: boolean;
  handleSignUp: (params: FormDataProps) => Promise<void>;
  handleUserPhotoSelect: () => void;
  handleGoBack: () => void;
  handlePasswordConfirmSecureTextEntry: () => void;
  handlePasswordSecureTextEntry: () => void;
}

function useSignUpViewModel(): SignUpViewModel {
  const navigation = useNavigation();

  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  });

  const { signInUser } = useAuthContext();

  const [photo, setPhoto] = useState<IPhoto>({} as IPhoto);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [passwordSecureTextEntry, setPasswordSecureTextEntry] = useState(true);
  const [passwordConfirmSecureTextEntry, setPasswordConfirmSecureTextEntry] =
    useState(true);
  const [isLoading, setIsLoading] = useState(false);

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleSignUp({ name, password, email, phone }: FormDataProps) {
    try {
      setIsLoading(true);
      await signUp({ name, password, email, phone, photo });
      await signInUser(email, password);
    } catch (error) {
      const isDomainError = error instanceof DomainError;
      const title = isDomainError
        ? error.message
        : 'Não foi possível criar a conta. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUserPhotoSelect() {
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
        const photoInfo = (await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        )) as FileSystem.FileInfo & { size?: number };

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          setPhoto({} as IPhoto);
          return toast.show({
            title: 'Essa Imagem é muito grande. Escolha uma de até 5MB',
            placement: 'top',
            bgColor: 'red.500',
          });
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${String(uuid.v4())}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        };

        setPhoto(photoFile);
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

  function handlePasswordConfirmSecureTextEntry() {
    setPasswordConfirmSecureTextEntry((prev) => !prev);
  }

  function handlePasswordSecureTextEntry() {
    setPasswordSecureTextEntry((prev) => !prev);
  }

  return {
    control,
    handleSubmit,
    errors,
    isLoading,
    photoIsLoading,
    photo,
    passwordSecureTextEntry,
    passwordConfirmSecureTextEntry,
    handleUserPhotoSelect,
    handleSignUp,
    handleGoBack,
    handlePasswordConfirmSecureTextEntry,
    handlePasswordSecureTextEntry,
  };
}

export { useSignUpViewModel };
