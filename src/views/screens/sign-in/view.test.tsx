import {
  act,
  fireEvent,
  render,
  renderHook,
} from '@testing-library/react-native';
import { SignIn } from './view';
import { THEME } from '../../../theme';
import {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  useForm,
} from 'react-hook-form';
import * as yup from 'yup';
import { SignInViewModel, useSignInViewModel } from './view-model';
import { NativeBaseProvider } from 'native-base';

jest.mock('./view-model');

jest.mock('@assets/logo_with_name.svg', () => 'LogoSvg');

const signInSchema = yup.object({
  email: yup.string().required('Informe o email.').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha.'),
});

type FormDataProps = yup.InferType<typeof signInSchema>;

interface CreateMockSignInView {
  control: Control<FormDataProps>;
  handleSubmit: UseFormHandleSubmit<FormDataProps>;
  errors: FieldErrors<FormDataProps>;
  isLoading: boolean;
  passwordSecureTextEntry?: boolean;
}

const createMockLoginViewModel = ({
  isLoading,
  passwordSecureTextEntry,
  control,
  handleSubmit,
  errors,
}: CreateMockSignInView): SignInViewModel => ({
  control,
  handleSubmit,
  errors,
  isLoading,
  passwordSecureTextEntry: passwordSecureTextEntry ?? true,
  handleSignIn: jest.fn(),
  handleNewAccount: jest.fn(),
  handlePasswordSecureTextEntry: jest.fn(),
});

interface FactoryProps {
  passwordSecureTextEntry?: boolean;
  isLoading?: boolean;
  email?: string;
  password?: string;
}

function makeSut({
  passwordSecureTextEntry = true,
  isLoading = false,
  email,
  password,
}: FactoryProps) {
  const { result } = renderHook(() => useForm<FormDataProps>());
  const errors = result.current.formState.errors;
  const control = result.current.control;

  if (email) {
    control._defaultValues.email = email;
  }

  if (password) {
    control._defaultValues.password = password;
  }

  const mockHandleSubmit = jest.fn();

  const mockLoginViewModel = createMockLoginViewModel({
    isLoading,
    passwordSecureTextEntry,
    control,
    handleSubmit: mockHandleSubmit,
    errors,
  });
  (useSignInViewModel as jest.Mock).mockReturnValueOnce(mockLoginViewModel);
  const inset = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  };

  const sut = render(
    <NativeBaseProvider theme={THEME} initialWindowMetrics={inset}>
      <SignIn />
    </NativeBaseProvider>
  );

  return { ...sut, ...mockLoginViewModel, result };
}

describe('SignIn view', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { toJSON } = makeSut({});

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render correctly with email', async () => {
    const email = 'test@example.com';

    const { toJSON, findByPlaceholderText } = makeSut({
      email,
    });

    const emailInput = await findByPlaceholderText('E-mail');

    expect(emailInput.props.value).toEqual(email);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render correctly with password', async () => {
    const password = '123456';

    const { toJSON, findByPlaceholderText } = makeSut({ password });

    const passwordInput = await findByPlaceholderText('Senha');
    expect(passwordInput.props.value).toEqual(password);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render correctly with password with secure text entry off', async () => {
    const { toJSON, findByPlaceholderText } = makeSut({
      passwordSecureTextEntry: false,
    });

    const passwordInput = await findByPlaceholderText('Senha');
    expect(passwordInput.props.passwordSecureTextEntry).toBeFalsy();

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render buttons with prop `disabled` true', async () => {
    const { toJSON, findByTestId } = makeSut({
      isLoading: true,
    });

    const enterButton = await findByTestId('enter-button');
    const createButton = await findByTestId('create-button');

    expect(enterButton.props.accessibilityState.disabled).toBeTruthy();
    expect(createButton.props.accessibilityState.disabled).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call handleSubmit when "Entrar" button is pressed', async () => {
    const { findByTestId, handleSubmit, handleSignIn } = makeSut({});

    const enterButton = await findByTestId('enter-button');

    await act(() => {
      fireEvent.press(enterButton);
    });

    expect(handleSubmit).toHaveBeenCalledWith(handleSignIn);
  });

  it('should call handleNewAccount when "Criar uma conta" button is pressed', async () => {
    const { findByTestId, handleNewAccount } = makeSut({});

    const createButton = await findByTestId('create-button');

    await act(() => {
      fireEvent.press(createButton);
    });

    expect(handleNewAccount).toHaveBeenCalled();
  });
});
