import {
  act,
  fireEvent,
  render,
  renderHook,
} from '@testing-library/react-native';
import { SignUp } from './view';
import { THEME } from '../../../../shared/theme';
import {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  useForm,
} from 'react-hook-form';
import * as yup from 'yup';
import { SignUpViewModel, useSignUpViewModel } from './view-model';
import { NativeBaseProvider } from 'native-base';
import { IPhoto } from '../../../../shared/types/interfaces/photo.interface';
import { PencilSimpleLine } from 'phosphor-react-native';

jest.mock('expo-image-picker', () => {
  return {
    requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValueOnce({
      status: 'granted',
    }),
    launchImageLibraryAsync: jest.fn().mockResolvedValue({
      cancelled: false,
      type: 'image',
      uri: 'abc.jpeg',
      width: '200',
      height: '200',
    }),
  };
});
jest.mock('./view-model');
jest.mock('../../../../assets/logo.svg', () => 'LogoSvg');

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

interface CreateMockSignUpView {
  control: Control<FormDataProps>;
  handleSubmit: UseFormHandleSubmit<FormDataProps>;
  errors: FieldErrors<FormDataProps>;
  isLoading: boolean;
  passwordSecureTextEntry?: boolean;
  passwordConfirmSecureTextEntry?: boolean;
  photoIsLoading?: boolean;
  photo?: IPhoto;
}

const createMockSignUpViewModel = ({
  isLoading,
  passwordSecureTextEntry,
  photoIsLoading,
  photo,
  control,
  errors,
  handleSubmit,
}: CreateMockSignUpView): SignUpViewModel => ({
  control,
  errors,
  isLoading,
  passwordSecureTextEntry: passwordSecureTextEntry ?? true,
  passwordConfirmSecureTextEntry: passwordSecureTextEntry ?? true,
  photoIsLoading: photoIsLoading ?? false,
  photo: photo ?? ({} as IPhoto),
  handleSubmit,
  handleUserPhotoSelect: jest.fn(),
  handleSignUp: jest.fn(),
  handlePasswordSecureTextEntry: jest.fn(),
  handlePasswordConfirmSecureTextEntry: jest.fn(),
  handleGoBack: jest.fn(),
});

interface FactoryProps {
  isLoading?: boolean;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  passwordConfirm?: string;
  passwordSecureTextEntry?: boolean;
  passwordConfirmSecureTextEntry?: boolean;
  photoIsLoading?: boolean;
  photo?: IPhoto;
}

function makeSut({
  name,
  email,
  phone,
  photo = {} as IPhoto,
  password,
  passwordConfirm,
  isLoading = false,
  photoIsLoading = false,
  passwordSecureTextEntry = true,
  passwordConfirmSecureTextEntry = true,
}: FactoryProps) {
  const { result } = renderHook(() => useForm<FormDataProps>());
  const errors = result.current.formState.errors;
  const control = result.current.control;

  if (name) {
    control._defaultValues.name = name;
  }

  if (email) {
    control._defaultValues.email = email;
  }

  if (phone) {
    control._defaultValues.phone = phone;
  }

  if (password) {
    control._defaultValues.password = password;
  }

  if (passwordConfirm) {
    control._defaultValues.password_confirm = passwordConfirm;
  }

  const mockHandleSubmit = jest.fn();

  const mockSignUpViewModel = createMockSignUpViewModel({
    isLoading,
    passwordSecureTextEntry,
    passwordConfirmSecureTextEntry,
    photoIsLoading,
    photo,
    control,
    errors,
    handleSubmit: mockHandleSubmit,
  });

  (useSignUpViewModel as jest.Mock).mockReturnValueOnce(mockSignUpViewModel);

  const inset = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  };

  const sut = render(
    <NativeBaseProvider theme={THEME} initialWindowMetrics={inset}>
      <SignUp />
    </NativeBaseProvider>
  );

  return { ...sut, ...mockSignUpViewModel, result };
}

describe('SignUp view', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { toJSON } = makeSut({});

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render correctly with name', async () => {
    const name = 'Rilson Costa de Oliveira';

    const { toJSON, findByPlaceholderText } = makeSut({
      name,
    });

    const nameInput = await findByPlaceholderText('Nome');

    expect(nameInput.props.value).toEqual(name);
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

  it('should render correctly with phone', async () => {
    const phone = '123456';

    const { toJSON, findByPlaceholderText } = makeSut({ phone });

    const phoneInput = await findByPlaceholderText('Telefone');
    expect(phoneInput.props.value).toEqual(phone);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render correctly with password', async () => {
    const password = '123456';

    const { toJSON, findByPlaceholderText } = makeSut({ password });

    const passwordInput = await findByPlaceholderText('Senha');
    expect(passwordInput.props.value).toEqual(password);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render correctly with password confirmation', async () => {
    const passwordConfirm = '123456';

    const { toJSON, findByPlaceholderText } = makeSut({ passwordConfirm });

    const passwordConfirmInput = await findByPlaceholderText(
      'Confirme a senha'
    );
    expect(passwordConfirmInput.props.value).toEqual(passwordConfirm);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render correctly with password confirmation secure text entry off', async () => {
    const { toJSON, findByPlaceholderText } = makeSut({
      passwordConfirmSecureTextEntry: false,
    });

    const passwordConfirmInput = await findByPlaceholderText(
      'Confirme a senha'
    );
    expect(passwordConfirmInput.props.passwordSecureTextEntry).toBeFalsy();

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render buttons with prop `disabled` true', async () => {
    const { toJSON, findByTestId } = makeSut({
      isLoading: true,
    });

    const createButton = await findByTestId('create-button');
    const backButton = await findByTestId('back-button');

    expect(createButton.props.accessibilityState.disabled).toBeTruthy();
    expect(backButton.props.accessibilityState.disabled).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call handleUserPhotoSelect when edit photo button is pressed', async () => {
    const { UNSAFE_getByType, handleUserPhotoSelect } = makeSut({
      isLoading: true,
    });

    await act(() => {
      fireEvent.press(UNSAFE_getByType(PencilSimpleLine));
    });

    expect(handleUserPhotoSelect).toHaveBeenCalled();
  });

  it('should call handleGoBack when back button is pressed', async () => {
    const { findByTestId, handleGoBack } = makeSut({});

    const backButton = await findByTestId('back-button');

    await act(() => {
      fireEvent.press(backButton);
    });

    expect(handleGoBack).toHaveBeenCalled();
  });

  it('should call handleSubmit when create button is pressed', async () => {
    const { findByTestId, handleSubmit, handleSignUp } = makeSut({});

    const createButton = await findByTestId('create-button');

    await act(() => {
      fireEvent.press(createButton);
    });

    expect(handleSubmit).toHaveBeenCalledWith(handleSignUp);
  });
});
