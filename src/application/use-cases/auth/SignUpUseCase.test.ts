import { SignUpUseCase } from '../auth/SignUpUseCase';
import { User } from '../../../entities/User';
import {
  ValidationError,
  ConflictError,
} from '../../../domain/errors/DomainError';

describe('SignUpUseCase', () => {
  let signUpUseCase: SignUpUseCase;
  let mockAuthService: {
    signUp: jest.Mock;
    signIn: jest.Mock;
    refreshToken: jest.Mock;
    signOut: jest.Mock;
    getCurrentUser: jest.Mock;
    updateProfile: jest.Mock;
  };
  let mockUserRepository: {
    findByEmail: jest.Mock;
    save: jest.Mock;
    findById: jest.Mock;
    findStored: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(() => {
    mockAuthService = {
      signUp: jest.fn(),
      signIn: jest.fn(),
      refreshToken: jest.fn(),
      signOut: jest.fn(),
      getCurrentUser: jest.fn(),
      updateProfile: jest.fn(),
    };

    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findStored: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    signUpUseCase = new SignUpUseCase(mockAuthService, mockUserRepository);
  });

  describe('execute', () => {
    const validRequest = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      password: 'password123',
    };

    const mockUser = new User(
      'user-1',
      'John Doe',
      'john@example.com',
      '1234567890',
      ''
    );

    const mockTokens = {
      access_token: 'access-token',
      refresh_token: 'refresh-token',
    };

    it('should sign up user successfully with valid data', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockAuthService.signUp.mockResolvedValue({
        user: mockUser,
        tokens: mockTokens,
      });
      mockUserRepository.save.mockResolvedValue(undefined);

      const result = await signUpUseCase.execute(validRequest);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'john@example.com'
      );
      expect(mockAuthService.signUp).toHaveBeenCalledWith(validRequest);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        user: mockUser,
        tokens: mockTokens,
      });
    });

    it('should throw ValidationError when name is empty', async () => {
      const invalidRequest = { ...validRequest, name: '' };

      await expect(signUpUseCase.execute(invalidRequest)).rejects.toThrow(
        new ValidationError('Name is required')
      );
    });

    it('should throw ValidationError when name is only whitespace', async () => {
      const invalidRequest = { ...validRequest, name: '   ' };

      await expect(signUpUseCase.execute(invalidRequest)).rejects.toThrow(
        new ValidationError('Name is required')
      );
    });

    it('should throw ValidationError when email is empty', async () => {
      const invalidRequest = { ...validRequest, email: '' };

      await expect(signUpUseCase.execute(invalidRequest)).rejects.toThrow(
        new ValidationError('Email is required')
      );
    });

    it('should throw ValidationError when phone is empty', async () => {
      const invalidRequest = { ...validRequest, phone: '' };

      await expect(signUpUseCase.execute(invalidRequest)).rejects.toThrow(
        new ValidationError('Phone is required')
      );
    });

    it('should throw ValidationError when password is empty', async () => {
      const invalidRequest = { ...validRequest, password: '' };

      await expect(signUpUseCase.execute(invalidRequest)).rejects.toThrow(
        new ValidationError('Password is required')
      );
    });

    it('should throw ValidationError when email format is invalid', async () => {
      const invalidRequest = { ...validRequest, email: 'invalid-email' };

      await expect(signUpUseCase.execute(invalidRequest)).rejects.toThrow(
        new ValidationError('Invalid email format')
      );
    });

    it('should throw ValidationError when password is too short', async () => {
      const invalidRequest = { ...validRequest, password: '12345' };

      await expect(signUpUseCase.execute(invalidRequest)).rejects.toThrow(
        new ValidationError('Password must be at least 6 characters')
      );
    });

    it('should throw ConflictError when user already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(signUpUseCase.execute(validRequest)).rejects.toThrow(
        new ConflictError('User already exists with this email')
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'john@example.com'
      );
      expect(mockAuthService.signUp).not.toHaveBeenCalled();
    });

    it('should throw ConflictError when auth service fails', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockAuthService.signUp.mockRejectedValue(new Error('Auth service error'));

      await expect(signUpUseCase.execute(validRequest)).rejects.toThrow(
        new ConflictError('Failed to create user')
      );
    });

    it('should throw ConflictError when user repository save fails', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockAuthService.signUp.mockResolvedValue({
        user: mockUser,
        tokens: mockTokens,
      });
      mockUserRepository.save.mockRejectedValue(new Error('Save error'));

      await expect(signUpUseCase.execute(validRequest)).rejects.toThrow(
        new ConflictError('Failed to create user')
      );
    });

    it('should propagate DomainError from auth service', async () => {
      const domainError = new ValidationError('Auth validation error');
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockAuthService.signUp.mockRejectedValue(domainError);

      await expect(signUpUseCase.execute(validRequest)).rejects.toThrow(
        domainError
      );
    });
  });
});
