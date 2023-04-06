import { useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import {
  VStack,
  Text,
  Center,
  Heading,
  ScrollView,
  KeyboardAvoidingView,
  Box,
  useTheme,
  useToast,
} from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import LogoSvg from '@assets/logo_with_name.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { AppError } from '@utils/AppError';
import { useAuth } from '@hooks/useAuth';

const signInSchema = yup.object({
  email: yup.string().required('Informe o email.').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha.'),
});

type FormDataProps = yup.InferType<typeof signInSchema>;

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const { colors, sizes } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  });
  const { signIn } = useAuth();
  const toast = useToast();

  const [passwordSecureTextEntry, setPasswordSecureTextEntry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn({ password, email }: FormDataProps) {
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível entrar. Tente novamente mais tarde.';

      setIsLoading(false);

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  function handleNewAccount() {
    navigation.navigate('signUp');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack flex={1} bg='gray.100'>
          <Box bg='gray.200' px={10} pb={10} flex={1} borderBottomRadius={24}>
            <Center my={24}>
              <LogoSvg />
              <Text color='gray.500' fontSize='sm' fontFamily='light'>
                Treine sua mente e o seu corpo
              </Text>
            </Center>

            <Center>
              <Heading
                color='gray.600'
                fontSize='sm'
                mb={6}
                fontFamily='regular'
              >
                Acesse sua conta
              </Heading>

              <Controller
                control={control}
                name='email'
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder='E-mail'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    value={value}
                    onChangeText={onChange}
                    errorMessage={errors.email?.message}
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

              <Button
                title='Entrar'
                bgColor='blue.400'
                onPress={handleSubmit(handleSignIn)}
                isLoading={isLoading}
              />
            </Center>
          </Box>

          <Center flex={1} p={10}>
            <Text color='gray.600' fontSize='sm' mb={3} fontFamily='regular'>
              Ainda não tem acesso?
            </Text>
            <Button
              disabled={isLoading}
              title='Criar uma conta'
              bgColor='gray.300'
              onPress={handleNewAccount}
            />
          </Center>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
