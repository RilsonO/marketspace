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
} from 'native-base';
import { Controller } from 'react-hook-form';

import LogoSvg from '@assets/logo_with_name.svg';
import { Input } from '@views/components/Input';
import { Button } from '@views/components/Button';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { useSignInViewModel } from './view-model';

export function SignIn() {
  const { colors, sizes } = useTheme();
  const {
    handleSubmit,
    errors,
    control,
    passwordSecureTextEntry,
    isLoading,
    handleNewAccount,
    handlePasswordSecureTextEntry,
    handleSignIn,
  } = useSignInViewModel();

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
                Seu espaço de compra e venda
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
                      <TouchableOpacity onPress={handlePasswordSecureTextEntry}>
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
                testID='enter-button'
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
              testID='create-button'
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
