import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSignInViewModel } from './view-model';
import { useAuthContext } from '../../../../contexts/auth/use-auth.hook';
import { useToast } from 'native-base';
import { ValidationError } from '../../../../domain/errors/DomainError';
import * as navigationModule from '@react-navigation/native';

jest.mock('../../../../contexts/auth/use-auth.hook');
jest.mock('native-base');
const mockSignInUser = jest.fn();
(useAuthContext as jest.Mock).mockReturnValue({ signInUser: mockSignInUser });

describe('SignIn view-model [useSignInViewModel]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct initial values', () => {
    const { result } = renderHook(() => useSignInViewModel());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.passwordSecureTextEntry).toBe(true);
  });

  it('should call handleNewAccount and navigate to sign up', async () => {
    const navigateMock = jest.fn();
    jest.spyOn(navigationModule, 'useNavigation').mockReturnValue({
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

    await waitFor(() =>
      expect(result.current.passwordSecureTextEntry).toBe(false)
    );

    await act(() => {
      result.current.handlePasswordSecureTextEntry();
    });

    await waitFor(() =>
      expect(result.current.passwordSecureTextEntry).toBe(true)
    );
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
    (useAuthContext as jest.Mock).mockReturnValueOnce({
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
      await waitFor(() => result.current.handleSignIn(formData));
    });

    expect(result.current.isLoading).toBe(false);
    expect(toastShowMock).toHaveBeenCalledWith({
      title: 'Não foi possível entrar. Tente novamente mais tarde.',
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it('should show an error toast on handleSignIn in case of DomainError', async () => {
    const appError = new ValidationError('ValidationError message');
    (useAuthContext as jest.Mock).mockReturnValueOnce({
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
