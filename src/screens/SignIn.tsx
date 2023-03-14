import { Platform } from 'react-native';
import {
  VStack,
  Text,
  Center,
  Heading,
  ScrollView,
  KeyboardAvoidingView,
  Box,
} from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import EyeSvg from '@assets/eye.svg';
import LogoSvg from '@assets/logo_with_name.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

const signInSchema = yup.object({
  email: yup.string().required('Informe o email.').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha.'),
});

type FormDataProps = yup.InferType<typeof signInSchema>;

export function SignIn() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  });

  function handleSignIn({ password, email }: FormDataProps) {
    console.log(email, password);
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
        <VStack flex={1}>
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
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    errorMessage={errors.password?.message}
                    InputRightElement={
                      <EyeSvg
                        width={20}
                        height={20}
                        fill='#000000'
                        style={{ marginRight: 10 }}
                      />
                    }
                  />
                )}
              />

              <Button
                title='Entrar'
                bgColor='blue.400'
                onPress={handleSubmit(handleSignIn)}
                // isLoading={isLoading}
              />
            </Center>
          </Box>

          <Center flex={1} p={10}>
            <Text color='gray.600' fontSize='sm' mb={3} fontFamily='regular'>
              Ainda não tem acesso?
            </Text>
            <Button
              title='Criar uma conta'
              bgColor='gray.300'
              // onPress={handleNewAccount}
            />
          </Center>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
