import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSignUpViewModel } from './view-model';
import { useAuthContext } from '../../../../contexts/auth/use-auth.hook';
import * as navigationModule from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useToast } from 'native-base';
import { ValidationError } from '../../../../domain/errors/DomainError';
import * as userRepository from '../../../../infra/http/repositories/user.repository';

jest.mock('expo-image-picker', () => {
  return {
    MediaTypeOptions: {
      Images: 'mockedImages',
    },
    requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValueOnce({
      status: 'granted',
    }),
    launchImageLibraryAsync: jest.fn(() =>
      Promise.resolve({
        assets: [
          {
            assetId: null,
            base64: null,
            duration: null,
            exif: null,
            fileName: null,
            fileSize: 183071,
            height: 300,
            type: 'image',
            uri: 'imagePath.png',
            width: 300,
          },
        ],
        canceled: false,
        cancelled: false,
      })
    ),
  };
});
jest.mock('../../../../infra/http/repositories/user.repository', () => ({
  signUp: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../../contexts/auth/use-auth.hook');
jest.mock('native-base');

const mockSignInUser = jest.fn();
(useAuthContext as jest.Mock).mockReturnValue({
  signInUser: mockSignInUser,
});

describe('SignUp view-model [useSignUpViewModel]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const toastShowMock = jest.fn();
  (useToast as jest.Mock).mockReturnValue({
    show: toastShowMock,
  });

  it('should return the correct initial values', () => {
    const { result } = renderHook(() => useSignUpViewModel());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.photoIsLoading).toBe(false);
    expect(result.current.passwordSecureTextEntry).toBe(true);
    expect(result.current.passwordConfirmSecureTextEntry).toBe(true);
    expect(result.current.photo).toEqual({});
  });

  it('should call navigation go back', async () => {
    const goBackMock = jest.fn();
    jest.spyOn(navigationModule, 'useNavigation').mockReturnValue({
      goBack: goBackMock,
    });

    const { result } = renderHook(() => useSignUpViewModel());

    await act(() => {
      result.current.handleGoBack();
    });

    expect(goBackMock).toHaveBeenCalledTimes(1);
  });

  it('should call launchImageLibraryAsync', async () => {
    const { result } = renderHook(() => useSignUpViewModel());

    await act(async () => {
      result.current.handleUserPhotoSelect();
      await waitFor(() => result.current.photoIsLoading === true);
      await waitFor(() => result.current.photoIsLoading === false);
    });

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledTimes(1);
    expect(result.current.photo).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        uri: 'imagePath.png',
        type: expect.any(String),
      })
    );
  });

  it('should show an error toast on handleUserPhotoSelect in error case', async () => {
    const launchImageLibraryAsyncMock = jest.spyOn(
      ImagePicker,
      'launchImageLibraryAsync'
    );
    launchImageLibraryAsyncMock.mockRejectedValueOnce(
      new Error('Some error message')
    );

    const { result } = renderHook(() => useSignUpViewModel());

    await act(async () => {
      result.current.handleUserPhotoSelect();
      await waitFor(() => result.current.photoIsLoading === true);
      await waitFor(() => result.current.photoIsLoading === false);
    });

    expect(toastShowMock).toHaveBeenCalledWith({
      title: 'Não foi possível utilizar a foto. Tente novamente mais tarde.',
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it('should show an error toast on handleUserPhotoSelect in case of DomainError', async () => {
    const launchImageLibraryAsyncMock = jest.spyOn(
      ImagePicker,
      'launchImageLibraryAsync'
    );
    const mockDomainError = new ValidationError('DomainError message');
    launchImageLibraryAsyncMock.mockRejectedValueOnce(mockDomainError);

    const { result } = renderHook(() => useSignUpViewModel());

    await act(async () => {
      result.current.handleUserPhotoSelect();
      await waitFor(() => result.current.photoIsLoading === true);
      await waitFor(() => result.current.photoIsLoading === false);
    });

    expect(toastShowMock).toHaveBeenCalledWith({
      title: mockDomainError.message,
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it('should toggle passwordSecureTextEntry', async () => {
    const { result } = renderHook(() => useSignUpViewModel());

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

  it('should toggle passwordConfirmSecureTextEntry', async () => {
    const { result } = renderHook(() => useSignUpViewModel());

    expect(result.current.passwordConfirmSecureTextEntry).toBe(true);

    await act(() => {
      result.current.handlePasswordConfirmSecureTextEntry();
    });

    await waitFor(() =>
      expect(result.current.passwordConfirmSecureTextEntry).toBe(false)
    );

    await act(() => {
      result.current.handlePasswordConfirmSecureTextEntry();
    });

    await waitFor(() =>
      expect(result.current.passwordConfirmSecureTextEntry).toBe(true)
    );
  });

  it('should call signUp on handleSignUp', async () => {
    const { result } = renderHook(() => useSignUpViewModel());

    const formData = {
      name: 'Rilson Costa de Oliveira',
      email: 'test@example.com',
      password: 'password123',
      password_confirm: 'password123',
      phone: '11111111111',
      photo: {
        name: 'image',
        uri: 'imagePath.png',
        type: 'image',
      },
    };

    await act(async () => {
      result.current.handleUserPhotoSelect();
      await waitFor(() => result.current.photoIsLoading === true);
      await waitFor(() => result.current.photoIsLoading === false);
    });

    await act(async () => {
      result.current.handleSignUp(formData);
      await waitFor(() => result.current.isLoading === true);
      await waitFor(() => result.current.isLoading === false);
    });

    expect(userRepository.signUp).toHaveBeenCalledTimes(1);
    expect(mockSignInUser).toHaveBeenCalledTimes(1);
    expect(mockSignInUser).toHaveBeenCalledWith(
      formData.email,
      formData.password
    );
    expect(userRepository.signUp).toHaveBeenCalledWith({
      name: formData.name,
      password: formData.password,
      email: formData.email,
      phone: formData.phone,
      photo: expect.objectContaining({
        name: expect.any(String),
        uri: 'imagePath.png',
        type: expect.any(String),
      }),
    });
  });

  it(`should show an generic error toast on handleSignUp when throw exception 
      caused by signUp`, async () => {
    const signUpMock = jest.spyOn(userRepository, 'signUp');
    signUpMock.mockRejectedValueOnce(new Error('Some error message'));

    const { result } = renderHook(() => useSignUpViewModel());

    const formData = {
      name: 'Rilson Costa de Oliveira',
      email: 'test@example.com',
      password: 'password123',
      password_confirm: 'password123',
      phone: '11111111111',
      photo: {
        name: 'image',
        uri: 'imagePath.png',
        type: 'image',
      },
    };

    await act(async () => {
      result.current.handleSignUp(formData);
      await waitFor(() => result.current.isLoading === true);
      await waitFor(() => result.current.isLoading === false);
    });

    expect(userRepository.signUp).toHaveBeenCalledTimes(1);
    expect(toastShowMock).toHaveBeenCalledWith({
      title: 'Não foi possível criar a conta. Tente novamente mais tarde.',
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it(`should show an DomainError error toast on handleSignUp when throw exception 
      caused by signUp`, async () => {
    const mockDomainError = new ValidationError('DomainError message');
    const signUpMock = jest.spyOn(userRepository, 'signUp');
    signUpMock.mockRejectedValueOnce(mockDomainError);

    const { result } = renderHook(() => useSignUpViewModel());

    const formData = {
      name: 'Rilson Costa de Oliveira',
      email: 'test@example.com',
      password: 'password123',
      password_confirm: 'password123',
      phone: '11111111111',
      photo: {
        name: 'image',
        uri: 'imagePath.png',
        type: 'image',
      },
    };

    await act(async () => {
      result.current.handleSignUp(formData);
      await waitFor(() => result.current.isLoading === true);
      await waitFor(() => result.current.isLoading === false);
    });

    expect(userRepository.signUp).toHaveBeenCalledTimes(1);
    expect(toastShowMock).toHaveBeenCalledWith({
      title: mockDomainError.message,
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it(`should show an generic error toast on handleSignUp when throw exception 
      caused by signInUser`, async () => {
    const signInUserMock = jest.spyOn(useAuthContext(), 'signInUser');
    signInUserMock.mockRejectedValueOnce(new Error('Some error message'));
    const { result } = renderHook(() => useSignUpViewModel());

    const formData = {
      name: 'Rilson Costa de Oliveira',
      email: 'test@example.com',
      password: 'password123',
      password_confirm: 'password123',
      phone: '11111111111',
      photo: {
        name: 'image',
        uri: 'imagePath.png',
        type: 'image',
      },
    };

    await act(async () => {
      result.current.handleUserPhotoSelect();
      await waitFor(() => result.current.photoIsLoading === true);
      await waitFor(() => result.current.photoIsLoading === false);
    });

    await act(async () => {
      result.current.handleSignUp(formData);
      await waitFor(() => result.current.isLoading === true);
      await waitFor(() => result.current.isLoading === false);
    });

    expect(userRepository.signUp).toHaveBeenCalledTimes(1);
    expect(userRepository.signUp).toHaveBeenCalledWith({
      name: formData.name,
      password: formData.password,
      email: formData.email,
      phone: formData.phone,
      photo: expect.objectContaining({
        name: expect.any(String),
        uri: 'imagePath.png',
        type: expect.any(String),
      }),
    });
    expect(toastShowMock).toHaveBeenCalledWith({
      title: 'Não foi possível criar a conta. Tente novamente mais tarde.',
      placement: 'top',
      bgColor: 'red.500',
    });
  });

  it(`should show an DomainError error toast on handleSignUp when throw exception 
      caused by signInUser`, async () => {
    const appError = new ValidationError('DomainError message');
    const signInUserMock = jest.spyOn(useAuthContext(), 'signInUser');
    signInUserMock.mockRejectedValueOnce(appError);
    const { result } = renderHook(() => useSignUpViewModel());

    const formData = {
      name: 'Rilson Costa de Oliveira',
      email: 'test@example.com',
      password: 'password123',
      password_confirm: 'password123',
      phone: '11111111111',
      photo: {
        name: 'image',
        uri: 'imagePath.png',
        type: 'image',
      },
    };

    await act(async () => {
      result.current.handleUserPhotoSelect();
      await waitFor(() => result.current.photoIsLoading === true);
      await waitFor(() => result.current.photoIsLoading === false);
    });

    await act(async () => {
      result.current.handleSignUp(formData);
      await waitFor(() => result.current.isLoading === true);
      await waitFor(() => result.current.isLoading === false);
    });

    expect(userRepository.signUp).toHaveBeenCalledTimes(1);
    expect(userRepository.signUp).toHaveBeenCalledWith({
      name: formData.name,
      password: formData.password,
      email: formData.email,
      phone: formData.phone,
      photo: expect.objectContaining({
        name: expect.any(String),
        uri: 'imagePath.png',
        type: expect.any(String),
      }),
    });
    expect(toastShowMock).toHaveBeenCalledWith({
      title: appError.message,
      placement: 'top',
      bgColor: 'red.500',
    });
  });
});
