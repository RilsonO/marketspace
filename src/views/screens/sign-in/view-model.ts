import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { AppError } from '@utils/AppError.util';
import { useAuthViewModel } from '@hooks/use-auth.hook';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useToast } from 'native-base';
import {
  Control,
  FieldErrors,
  useForm,
  UseFormHandleSubmit,
} from 'react-hook-form';

const signInSchema = yup.object({
  email: yup.string().required('Informe o email.').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha.'),
});

type FormDataProps = yup.InferType<typeof signInSchema>;

export interface SignInViewModel {
  control: Control<FormDataProps>;
  handleSubmit: UseFormHandleSubmit<FormDataProps>;
  errors: FieldErrors<FormDataProps>;
  isLoading: boolean;
  passwordSecureTextEntry: boolean;
  // eslint-disable-next-line no-unused-vars
  handleSignIn: ({ password, email }: FormDataProps) => Promise<void>;
  handleNewAccount: () => void;
  handlePasswordSecureTextEntry: () => void;
}

function useSignInViewModel(): SignInViewModel {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  });
  const toast = useToast();

  const { signInUser } = useAuthViewModel();

  const [passwordSecureTextEntry, setPasswordSecureTextEntry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn({ password, email }: FormDataProps) {
    try {
      setIsLoading(true);
      await signInUser(email, password);
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

  function handlePasswordSecureTextEntry() {
    setPasswordSecureTextEntry((prev) => !prev);
  }

  return {
    control,
    handleSubmit,
    errors,
    isLoading,
    passwordSecureTextEntry,
    handleSignIn,
    handleNewAccount,
    handlePasswordSecureTextEntry,
  };
}

export { useSignInViewModel };
