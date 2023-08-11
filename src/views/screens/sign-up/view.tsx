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
} from 'native-base';
import LogoSvg from '@assets/logo.svg';
import { useSignUpViewModel } from './view-model';
import { UserPhoto } from '@views/components/UserPhoto';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png';
import { Eye, EyeSlash, PencilSimpleLine } from 'phosphor-react-native';
import { Controller } from 'react-hook-form';
import { Button } from '@views/components/Button';
import { Input } from '@views/components/Input';
import { toMaskedPhone } from '@utils/Masks.util';

const PHOTO_SIZE = 22;

export function SignUp() {
  const { colors, sizes } = useTheme();
  const {
    control,
    errors,
    isLoading,
    photoIsLoading,
    photo,
    passwordSecureTextEntry,
    passwordConfirmSecureTextEntry,
    handleSubmit,
    handleUserPhotoSelect,
    handleSignUp,
    handleGoBack,
    handlePasswordSecureTextEntry,
    handlePasswordConfirmSecureTextEntry,
  } = useSignUpViewModel();

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
                  source={photo.uri ? { uri: photo.uri } : defaultUserPhotoImg}
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
                      onPress={() => handlePasswordSecureTextEntry()}
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
                      onPress={() => handlePasswordConfirmSecureTextEntry()}
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
              testID='create-button'
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
              testID='back-button'
              title='Ir para o login'
              bgColor='gray.300'
              onPress={handleGoBack}
              disabled={isLoading}
            />
          </Center>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
