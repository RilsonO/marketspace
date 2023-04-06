import { Platform, TouchableOpacity } from 'react-native';
import {
  VStack,
  Text,
  Center,
  Heading,
  ScrollView,
  KeyboardAvoidingView,
  Box,
  Skeleton,
  useTheme,
  Button as NativeButton,
  useToast,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import EyeSvg from '@assets/eye.svg';
import EyeSlashSvg from '@assets/eye_slash.svg';
import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useState } from 'react';
import { UserPhoto } from '@components/UserPhoto';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png';
import { PencilSimpleLine, Eye, EyeSlash } from 'phosphor-react-native';
import { toMaskedPhone } from '@utils/Masks';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { AppError } from '@utils/AppError';
import uuid from 'react-native-uuid';
import { api } from '@services/api';

const signInSchema = yup.object({
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

type FormDataProps = yup.InferType<typeof signInSchema>;

type PhotoProps = {
  name: string;
  uri: string;
  type: string;
};

const PHOTO_SIZE = 22;

export function SignUp() {
  const navigation = useNavigation();
  const { colors, sizes } = useTheme();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  });

  const [photo, setPhoto] = useState<PhotoProps>({} as PhotoProps);
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
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('tel', phone);
      formData.append('password', password);
      if (!!photo.uri) {
        formData.append('avatar', photo as any);
      }
      setIsLoading(true);
      await api.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleGoBack();
      toast.show({
        title: 'Conta criada com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      });
    } catch (error) {
      setIsLoading(false);
      console.log('error: ', error);

      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível criar a conta. Tente novamente mais tarde.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
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
          setPhoto({} as PhotoProps);
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
        } as any;

        setPhoto(photoFile);

        toast.show({
          title: 'Foto selecionada!',
          placement: 'top',
          bgColor: 'green.500',
        });
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.gray[200] }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack flex={1} px={10} pb={10}>
          <Center mt={12} mb={6}>
            <LogoSvg />

            <Heading color='gray.700' fontFamily='bold' fontSize='lg+'>
              Boas vindas!
            </Heading>

            <Text
              color='gray.600'
              fontSize='sm'
              fontFamily='regular'
              textAlign='center'
            >
              Crie sua conta e use o espaço para comprar itens variados e vender
              seus produtos
            </Text>
          </Center>

          <Center flex={1}>
            <Box mb={6}>
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
                  source={
                    !!photo.uri ? { uri: photo.uri } : defaultUserPhotoImg
                  }
                  alt='Foto do usuário'
                  size={PHOTO_SIZE}
                />
              )}

              <NativeButton
                bg='blue.400'
                w='10'
                h='10'
                rounded='full'
                _pressed={{
                  bg: 'blue.300',
                }}
                alignItems='center'
                justifyContent='center'
                position='absolute'
                right={-10}
                bottom={0}
                onPress={handleUserPhotoSelect}
              >
                <PencilSimpleLine size={sizes[4]} color={colors.gray[200]} />
              </NativeButton>
            </Box>

            <Controller
              control={control}
              name='name'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='Nome'
                  value={value}
                  autoCorrect={false}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='E-mail'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='phone'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='Telefone'
                  keyboardType='phone-pad'
                  value={value}
                  onChangeText={(text) => onChange(toMaskedPhone(text))}
                  errorMessage={errors.phone?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='password'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='Senha'
                  secureTextEntry={passwordSecureTextEntry}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                  InputRightElement={
                    <TouchableOpacity
                      onPress={() =>
                        setPasswordSecureTextEntry((prev) => !prev)
                      }
                    >
                      {passwordSecureTextEntry ? (
                        <Eye
                          size={sizes[5]}
                          color={colors.gray[500]}
                          style={{ marginRight: 10 }}
                        />
                      ) : (
                        <EyeSlash
                          size={sizes[5]}
                          color={colors.gray[500]}
                          style={{ marginRight: 10 }}
                        />
                      )}
                    </TouchableOpacity>
                  }
                />
              )}
            />

            <Controller
              control={control}
              name='password_confirm'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='Confirme a senha'
                  secureTextEntry={passwordConfirmSecureTextEntry}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.password_confirm?.message}
                  InputRightElement={
                    <TouchableOpacity
                      onPress={() =>
                        setPasswordConfirmSecureTextEntry((prev) => !prev)
                      }
                    >
                      {passwordConfirmSecureTextEntry ? (
                        <Eye
                          size={sizes[5]}
                          color={colors.gray[500]}
                          style={{ marginRight: 10 }}
                        />
                      ) : (
                        <EyeSlash
                          size={sizes[5]}
                          color={colors.gray[500]}
                          style={{ marginRight: 10 }}
                        />
                      )}
                    </TouchableOpacity>
                  }
                />
              )}
            />

            <Button
              mt={3}
              title='Criar'
              bgColor='gray.700'
              onPress={handleSubmit(handleSignUp)}
              isLoading={isLoading}
            />
          </Center>

          <Center flex={1} py={10}>
            <Text color='gray.600' fontSize='sm' mb={3} fontFamily='regular'>
              Já tem uma conta?
            </Text>
            <Button
              title='Ir para o login'
              bgColor='gray.300'
              onPress={handleGoBack}
            />
          </Center>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
