import { SignInUseCase } from '../auth/SignInUseCase';
import {
  IAuthService,
  SignInRequest,
} from '../../../domain/interfaces/IAuthService';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { User } from '../../../entities/User';
import { ValidationError } from '../../../domain/errors/DomainError';

describe('SignInUseCase', () => {
  let signInUseCase: SignInUseCase;
  let mockAuthService: jest.Mocked<IAuthService>;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockAuthService = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      refreshToken: jest.fn(),
      signOut: jest.fn(),
      getCurrentUser: jest.fn(),
      updateProfile: jest.fn(),
    };

    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findStored: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    signInUseCase = new SignInUseCase(mockAuthService, mockUserRepository);
  });

  describe('execute', () => {
    it('should sign in user successfully with valid credentials', async () => {
      const request: SignInRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = new User(
        '1',
        'Test User',
        'test@example.com',
        '(11) 99999-9999',
        'avatar.jpg'
      );

      const mockTokens = {
        token: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockAuthService.signIn.mockResolvedValue({
        user: mockUser,
        tokens: mockTokens,
      });

      const result = await signInUseCase.execute(request);

      expect(result.user).toEqual(mockUser);
      expect(result.tokens).toEqual(mockTokens);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(request);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw ValidationError when email is empty', async () => {
      const request: SignInRequest = {
        email: '',
        password: 'password123',
      };

      await expect(signInUseCase.execute(request)).rejects.toThrow(
        ValidationError
      );
      expect(mockAuthService.signIn).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when password is empty', async () => {
      const request: SignInRequest = {
        email: 'test@example.com',
        password: '',
      };

      await expect(signInUseCase.execute(request)).rejects.toThrow(
        ValidationError
      );
      expect(mockAuthService.signIn).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when email format is invalid', async () => {
      const request: SignInRequest = {
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(signInUseCase.execute(request)).rejects.toThrow(
        ValidationError
      );
      expect(mockAuthService.signIn).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedError when auth service fails', async () => {
      const request: SignInRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.signIn.mockRejectedValue(new Error('Auth failed'));

      await expect(signInUseCase.execute(request)).rejects.toThrow(
        'Invalid credentials'
      );
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});
