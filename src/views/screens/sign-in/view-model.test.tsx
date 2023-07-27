import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSignInViewModel } from './view-model';
import { useAuthViewModel } from '@hooks/use-auth.hook';
import { useToast } from 'native-base';
import { UserModel } from 'src/models/user.model';
import { AuthContextDataProps } from '@view-models/auth.view-model';
import { AppError } from '@utils/AppError.util';

jest.mock('@hooks/use-auth.hook');
jest.mock('native-base');
const mockSignInUser = jest.fn();
(useAuthViewModel as jest.Mock).mockReturnValue({ signInUser: mockSignInUser });

describe('SignIn view-model [useSignInViewModel]', () => {
  beforeEach(() => {
    console.log('beforeEach is called');

    jest.clearAllMocks();
  });

  it('should return the correct initial values', () => {
    const { result } = renderHook(() => useSignInViewModel());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.passwordSecureTextEntry).toBe(true);
  });

  it('should call handleNewAccount and navigate to sign up', async () => {
    const navigateMock = jest.fn();
    jest
      .spyOn(require('@react-navigation/native'), 'useNavigation')
      .mockReturnValue({
        navigate: navigateMock,
      });

    const { result } = renderHook(() => useSignInViewModel());

    await act(() => {
      result.current.handleNewAccount();
    });

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('signUp');
  });

  it('should toggle passwordSecureTextEntry', async () => {
    const { result } = renderHook(() => useSignInViewModel());

    expect(result.current.passwordSecureTextEntry).toBe(true);

    await act(() => {
      result.current.handlePasswordSecureTextEntry();
    });

    expect(result.current.passwordSecureTextEntry).toBe(false);

    await act(() => {
      result.current.handlePasswordSecureTextEntry();
    });

    expect(result.current.passwordSecureTextEntry).toBe(true);
  });

  it('should call signInUser on handleSignIn and set isLoading to true', async () => {
    const { result } = renderHook(() => useSignInViewModel());

    const formData = {
      email: 'test@example.com',
      password: 'password123',
    };

    await act(() => {
      result.current.handleSignIn(formData);
    });

    expect(mockSignInUser).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(true);
    expect(mockSignInUser).toHaveBeenCalledWith(
      formData.email,
      formData.password
    );
  });

  it('should show an error toast on handleSignIn in error case', async () => {
    (useAuthViewModel as jest.Mock).mockReturnValueOnce({
      signInUser: async () => {
        throw new Error('Some error message');
      },
    });

    const toastShowMock = jest.fn();
    (useToast as jest.Mock).mockReturnValueOnce({
      show: toastShowMock,
    });

    const { result } = renderHook(() => useSignInViewModel());

    const formData = {
      email: 'test@example.com',
      password: 'password123',
    };

    await act(async () => {
      await result.current.handleSignIn(formData);
    });

    expect(result.current.isLoading).toBe(false);
    expect(toastShowMock).toHaveBeenCalledWith({
      title: 'Não foi possível entrar. Tente novamente mais tarde.',
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it('should show an error toast on handleSignIn in case of AppError', async () => {
    const appError = new AppError('AppError message');
    (useAuthViewModel as jest.Mock).mockReturnValueOnce({
      signInUser: async () => {
        throw appError;
      },
    });

    const toastShowMock = jest.fn();
    (useToast as jest.Mock).mockReturnValueOnce({
      show: toastShowMock,
    });

    const { result } = renderHook(() => useSignInViewModel());

    const formData = {
      email: 'test@example.com',
      password: 'password123',
    };

    await act(async () => {
      await result.current.handleSignIn(formData);
    });

    expect(result.current.isLoading).toBe(false);
    expect(toastShowMock).toHaveBeenCalledWith({
      title: appError.message,
      placement: 'top',
      bgColor: 'red.500',
    });
  });
});
