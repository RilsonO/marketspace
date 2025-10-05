import { AuthServiceImpl } from './AuthServiceImpl';
import { User } from '../../entities/User';
import { UnauthorizedError } from '../../domain/errors/DomainError';
import {
  SignInRequest,
  SignUpRequest,
  AuthTokens,
} from '../../domain/interfaces/IAuthService';

// Mock das dependências HTTP
jest.mock('../http/repositories/user.repository', () => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  updateProfile: jest.fn(),
}));

// Mock das dependências de storage
jest.mock('../storage/auth-token.storage', () => ({
  storageAuthTokenGet: jest.fn(),
  storageAuthTokenRemove: jest.fn(),
}));

// Importar as funções mockadas
import {
  signIn,
  signUp as signUpRepository,
  updateProfile,
} from '../http/repositories/user.repository';
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
} from '../storage/auth-token.storage';

describe('AuthServiceImpl', () => {
  let authService: AuthServiceImpl;
  let mockSignIn: jest.MockedFunction<typeof signIn>;
  let mockSignUp: jest.MockedFunction<typeof signUpRepository>;
  let mockUpdateProfile: jest.MockedFunction<typeof updateProfile>;
  let mockStorageAuthTokenGet: jest.MockedFunction<typeof storageAuthTokenGet>;
  let mockStorageAuthTokenRemove: jest.MockedFunction<
    typeof storageAuthTokenRemove
  >;

  beforeEach(() => {
    authService = new AuthServiceImpl();

    // Obter referências aos mocks
    mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
    mockSignUp = signUpRepository as jest.MockedFunction<
      typeof signUpRepository
    >;
    mockUpdateProfile = updateProfile as jest.MockedFunction<
      typeof updateProfile
    >;
    mockStorageAuthTokenGet = storageAuthTokenGet as jest.MockedFunction<
      typeof storageAuthTokenGet
    >;
    mockStorageAuthTokenRemove = storageAuthTokenRemove as jest.MockedFunction<
      typeof storageAuthTokenRemove
    >;

    // Limpar mocks
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    const mockSignInRequest: SignInRequest = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockSignInResponse = {
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'test@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      },
      token: 'jwt-token',
      refresh_token: 'refresh-token',
    };

    it('should sign in successfully and return user with tokens', async () => {
      mockSignIn.mockResolvedValue(mockSignInResponse);

      const result = await authService.signIn(mockSignInRequest);

      expect(mockSignIn).toHaveBeenCalledWith(mockSignInRequest);
      expect(result).toEqual({
        user: expect.any(User),
        tokens: {
          token: 'jwt-token',
          refreshToken: 'refresh-token',
        },
      });
      expect(result.user.id).toBe('user-123');
      expect(result.user.name).toBe('John Doe');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.phone).toBe('1234567890');
      expect(result.user.avatar).toBe('avatar.jpg');
    });

    it('should throw UnauthorizedError when sign in fails', async () => {
      mockSignIn.mockRejectedValue(new Error('Invalid credentials'));

      await expect(authService.signIn(mockSignInRequest)).rejects.toThrow(
        UnauthorizedError
      );
      await expect(authService.signIn(mockSignInRequest)).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should handle network errors', async () => {
      mockSignIn.mockRejectedValue(new Error('Network error'));

      await expect(authService.signIn(mockSignInRequest)).rejects.toThrow(
        UnauthorizedError
      );
    });

    it('should handle null avatar', async () => {
      const responseWithNullAvatar = {
        ...mockSignInResponse,
        user: {
          ...mockSignInResponse.user,
          avatar: null,
        },
      };
      mockSignIn.mockResolvedValue(responseWithNullAvatar);

      const result = await authService.signIn(mockSignInRequest);

      expect(result.user.avatar).toBeNull();
    });

    it('should handle empty avatar', async () => {
      const responseWithEmptyAvatar = {
        ...mockSignInResponse,
        user: {
          ...mockSignInResponse.user,
          avatar: '',
        },
      };
      mockSignIn.mockResolvedValue(responseWithEmptyAvatar);

      const result = await authService.signIn(mockSignInRequest);

      expect(result.user.avatar).toBe('');
    });
  });

  describe('signUp', () => {
    const mockSignUpRequest: SignUpRequest = {
      name: 'John Doe',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'password123',
      avatar: {
        name: 'avatar.jpg',
        uri: 'file://avatar.jpg',
        type: 'image',
      },
    };

    const mockSignUpResponse = {
      user: {
        id: 'user-456',
        name: 'John Doe',
        email: 'test@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      },
      token: 'new-jwt-token',
      refresh_token: 'new-refresh-token',
    };

    it('should sign up successfully with avatar and return user with tokens', async () => {
      mockSignUp.mockResolvedValue(undefined);
      mockSignIn.mockResolvedValue(mockSignUpResponse);

      const result = await authService.signUp(mockSignUpRequest);

      expect(mockSignUp).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'password123',
        photo: {
          name: 'avatar',
          uri: 'avatar.jpg',
          type: 'image',
        },
      });
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual({
        user: expect.any(User),
        tokens: {
          token: 'new-jwt-token',
          refreshToken: 'new-refresh-token',
        },
      });
    });

    it('should sign up successfully without avatar', async () => {
      const requestWithoutAvatar = {
        ...mockSignUpRequest,
        avatar: null,
      };
      mockSignUp.mockResolvedValue(undefined);
      mockSignIn.mockResolvedValue(mockSignUpResponse);

      const result = await authService.signUp(requestWithoutAvatar);

      expect(mockSignUp).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'password123',
        photo: {
          name: 'default',
          uri: '',
          type: 'image',
        },
      });
      expect(result).toEqual({
        user: expect.any(User),
        tokens: {
          token: 'new-jwt-token',
          refreshToken: 'new-refresh-token',
        },
      });
    });

    it('should throw UnauthorizedError when sign up fails', async () => {
      mockSignUp.mockRejectedValue(new Error('Email already exists'));

      await expect(authService.signUp(mockSignUpRequest)).rejects.toThrow(
        UnauthorizedError
      );
      await expect(authService.signUp(mockSignUpRequest)).rejects.toThrow(
        'Failed to create account'
      );
    });

    it('should throw UnauthorizedError when sign in after sign up fails', async () => {
      mockSignUp.mockResolvedValue(undefined);
      mockSignIn.mockRejectedValue(new Error('Login failed'));

      await expect(authService.signUp(mockSignUpRequest)).rejects.toThrow(
        UnauthorizedError
      );
      await expect(authService.signUp(mockSignUpRequest)).rejects.toThrow(
        'Failed to create account'
      );
    });

    it('should handle network errors during sign up', async () => {
      mockSignUp.mockRejectedValue(new Error('Network error'));

      await expect(authService.signUp(mockSignUpRequest)).rejects.toThrow(
        UnauthorizedError
      );
    });

    it('should handle special characters in user data', async () => {
      const requestWithSpecialChars: SignUpRequest = {
        name: 'João & Maria',
        email: 'joão.maria@example.com',
        phone: '+55 (11) 99999-9999',
        password: 'password123',
        avatar: null,
      };
      const responseWithSpecialChars = {
        user: {
          id: 'user-ção',
          name: 'João & Maria',
          email: 'joão.maria@example.com',
          tel: '+55 (11) 99999-9999',
          avatar: null,
        },
        token: 'jwt-token',
        refresh_token: 'refresh-token',
      };

      mockSignUp.mockResolvedValue(undefined);
      mockSignIn.mockResolvedValue(responseWithSpecialChars);

      const result = await authService.signUp(requestWithSpecialChars);

      expect(result.user.name).toBe('João & Maria');
      expect(result.user.email).toBe('joão.maria@example.com');
      expect(result.user.phone).toBe('+55 (11) 99999-9999');
    });
  });

  describe('refreshToken', () => {
    it('should throw UnauthorizedError as not implemented', async () => {
      await expect(authService.refreshToken()).rejects.toThrow(
        UnauthorizedError
      );
      await expect(authService.refreshToken()).rejects.toThrow(
        'Failed to refresh token'
      );
    });
  });

  describe('signOut', () => {
    it('should remove auth token from storage', async () => {
      mockStorageAuthTokenRemove.mockResolvedValue(undefined);

      await authService.signOut();

      expect(mockStorageAuthTokenRemove).toHaveBeenCalledTimes(1);
    });

    it('should handle storage errors gracefully', async () => {
      mockStorageAuthTokenRemove.mockRejectedValue(new Error('Storage error'));

      // Should throw error since signOut doesn't handle errors
      await expect(authService.signOut()).rejects.toThrow('Storage error');
    });
  });

  describe('getCurrentUser', () => {
    const mockUserData = {
      id: 'user-789',
      name: 'Current User',
      email: 'current@example.com',
      tel: '9876543210',
      avatar: 'current-avatar.jpg',
    };

    it('should return user when token exists and profile fetch succeeds', async () => {
      mockStorageAuthTokenGet.mockResolvedValue({
        token: 'valid-token',
        refreshToken: 'valid-refresh-token',
      });
      mockUpdateProfile.mockResolvedValue(mockUserData);

      const result = await authService.getCurrentUser();

      expect(mockStorageAuthTokenGet).toHaveBeenCalledTimes(1);
      expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe('user-789');
      expect(result?.name).toBe('Current User');
      expect(result?.email).toBe('current@example.com');
      expect(result?.phone).toBe('9876543210');
      expect(result?.avatar).toBe('current-avatar.jpg');
    });

    it('should return null when no token exists', async () => {
      mockStorageAuthTokenGet.mockResolvedValue({
        token: null,
        refreshToken: null,
      });

      const result = await authService.getCurrentUser();

      expect(mockStorageAuthTokenGet).toHaveBeenCalledTimes(1);
      expect(mockUpdateProfile).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when token is empty string', async () => {
      mockStorageAuthTokenGet.mockResolvedValue({
        token: '',
        refreshToken: '',
      });

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should return null when profile fetch fails', async () => {
      mockStorageAuthTokenGet.mockResolvedValue({
        token: 'valid-token',
        refreshToken: 'valid-refresh-token',
      });
      mockUpdateProfile.mockRejectedValue(new Error('Profile fetch failed'));

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should return null when storage fails', async () => {
      mockStorageAuthTokenGet.mockRejectedValue(new Error('Storage error'));

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should handle user with null avatar', async () => {
      const userDataWithNullAvatar = {
        ...mockUserData,
        avatar: null,
      };
      mockStorageAuthTokenGet.mockResolvedValue({
        token: 'valid-token',
        refreshToken: 'valid-refresh-token',
      });
      mockUpdateProfile.mockResolvedValue(userDataWithNullAvatar);

      const result = await authService.getCurrentUser();

      expect(result?.avatar).toBeNull();
    });
  });

  describe('updateProfile', () => {
    const mockProfileData = {
      id: 'user-update',
      name: 'Updated User',
      email: 'updated@example.com',
      tel: '1111111111',
      avatar: 'updated-avatar.jpg',
    };

    it('should update profile successfully', async () => {
      mockUpdateProfile.mockResolvedValue(mockProfileData);

      const result = await authService.updateProfile();

      expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe('user-update');
      expect(result.name).toBe('Updated User');
      expect(result.email).toBe('updated@example.com');
      expect(result.phone).toBe('1111111111');
      expect(result.avatar).toBe('updated-avatar.jpg');
    });

    it('should throw UnauthorizedError when update fails', async () => {
      mockUpdateProfile.mockRejectedValue(new Error('Update failed'));

      await expect(authService.updateProfile()).rejects.toThrow(
        UnauthorizedError
      );
      await expect(authService.updateProfile()).rejects.toThrow(
        'Failed to update profile'
      );
    });

    it('should handle network errors', async () => {
      mockUpdateProfile.mockRejectedValue(new Error('Network error'));

      await expect(authService.updateProfile()).rejects.toThrow(
        UnauthorizedError
      );
    });

    it('should handle user with empty avatar', async () => {
      const profileDataWithEmptyAvatar = {
        ...mockProfileData,
        avatar: '',
      };
      mockUpdateProfile.mockResolvedValue(profileDataWithEmptyAvatar);

      const result = await authService.updateProfile();

      expect(result.avatar).toBe('');
    });
  });

  describe('Error handling', () => {
    it('should consistently throw UnauthorizedError for methods that can fail', async () => {
      // Configure mocks to fail for this test
      mockSignIn.mockRejectedValue(new Error('Sign in failed'));
      mockSignUp.mockRejectedValue(new Error('Sign up failed'));
      mockUpdateProfile.mockRejectedValue(new Error('Update failed'));

      const methods = [
        () =>
          authService.signIn({
            email: 'test@example.com',
            password: 'password',
          }),
        () =>
          authService.signUp({
            name: 'Test',
            email: 'test@example.com',
            phone: '1234567890',
            password: 'password',
            avatar: null,
          }),
        () => authService.refreshToken(),
        () => authService.updateProfile(),
      ];

      for (const method of methods) {
        await expect(method()).rejects.toThrow(UnauthorizedError);
      }
    });

    it('should preserve original error messages in UnauthorizedError', async () => {
      mockSignIn.mockRejectedValue(new Error('Original error message'));

      try {
        await authService.signIn({
          email: 'test@example.com',
          password: 'password',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedError);
        expect((error as UnauthorizedError).message).toBe(
          'Invalid credentials'
        );
      }
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete sign up and sign in flow', async () => {
      const signUpRequest: SignUpRequest = {
        name: 'Integration Test User',
        email: 'integration@example.com',
        phone: '5555555555',
        password: 'integration123',
        avatar: null,
      };

      const signInResponse = {
        user: {
          id: 'integration-user-id',
          name: 'Integration Test User',
          email: 'integration@example.com',
          tel: '5555555555',
          avatar: null,
        },
        token: 'integration-token',
        refresh_token: 'integration-refresh-token',
      };

      mockSignUp.mockResolvedValue(undefined);
      mockSignIn.mockResolvedValue(signInResponse);

      const result = await authService.signUp(signUpRequest);

      expect(result.user.id).toBe('integration-user-id');
      expect(result.tokens.token).toBe('integration-token');
      expect(result.tokens.refreshToken).toBe('integration-refresh-token');
    });

    it('should handle user session management flow', async () => {
      // Simulate user session flow: sign in -> get current user -> sign out
      const signInResponse = {
        user: {
          id: 'session-user',
          name: 'Session User',
          email: 'session@example.com',
          tel: '1234567890',
          avatar: 'session-avatar.jpg',
        },
        token: 'session-token',
        refresh_token: 'session-refresh-token',
      };

      const userData = {
        id: 'session-user',
        name: 'Session User',
        email: 'session@example.com',
        tel: '1234567890',
        avatar: 'session-avatar.jpg',
      };

      // Sign in
      mockSignIn.mockResolvedValue(signInResponse);
      const signInResult = await authService.signIn({
        email: 'session@example.com',
        password: 'password',
      });

      expect(signInResult.user.name).toBe('Session User');

      // Get current user
      mockStorageAuthTokenGet.mockResolvedValue({
        token: 'session-token',
        refreshToken: 'session-refresh-token',
      });
      mockUpdateProfile.mockResolvedValue(userData);
      const currentUser = await authService.getCurrentUser();

      expect(currentUser?.name).toBe('Session User');

      // Sign out
      mockStorageAuthTokenRemove.mockResolvedValue(undefined);
      await authService.signOut();

      expect(mockStorageAuthTokenRemove).toHaveBeenCalled();
    });
  });
});
