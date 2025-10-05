import { UpdateUserProfileUseCase } from './UpdateUserProfileUseCase';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { IAuthService } from '../../../domain/interfaces/IAuthService';
import { User } from '../../../entities/User';
import {
  ValidationError,
  NotFoundError,
  DomainError,
} from '../../../domain/errors/DomainError';

describe('UpdateUserProfileUseCase', () => {
  let updateUserProfileUseCase: UpdateUserProfileUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findStored: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockAuthService = {
      signUp: jest.fn(),
      signIn: jest.fn(),
      refreshToken: jest.fn(),
      signOut: jest.fn(),
      getCurrentUser: jest.fn(),
      updateProfile: jest.fn(),
    };

    updateUserProfileUseCase = new UpdateUserProfileUseCase(
      mockUserRepository,
      mockAuthService
    );
  });

  describe('execute', () => {
    const userId = 'user-123';
    const validRequest = {
      name: 'John Doe',
      phone: '1234567890',
      avatar: 'path/to/avatar.jpg',
    };

    const mockUser = new User(
      userId,
      'Old Name',
      'old@example.com',
      '9876543210',
      'old-avatar.jpg'
    );

    const mockUpdatedUser = new User(
      userId,
      'John Doe',
      'old@example.com',
      '1234567890',
      'path/to/avatar.jpg'
    );

    it('should update user profile successfully', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockAuthService.updateProfile.mockResolvedValue(mockUpdatedUser);
      mockUserRepository.update.mockResolvedValue(undefined);

      const result = await updateUserProfileUseCase.execute(
        userId,
        validRequest
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockAuthService.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          phone: '1234567890',
          avatar: 'path/to/avatar.jpg',
        })
      );
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUpdatedUser);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw ValidationError when name is empty', async () => {
      const invalidRequest = { ...validRequest, name: '' };

      await expect(
        updateUserProfileUseCase.execute(userId, invalidRequest)
      ).rejects.toThrow(new ValidationError('Name is required'));

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockAuthService.updateProfile).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when name is only whitespace', async () => {
      const invalidRequest = { ...validRequest, name: '   ' };

      await expect(
        updateUserProfileUseCase.execute(userId, invalidRequest)
      ).rejects.toThrow(new ValidationError('Name is required'));

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockAuthService.updateProfile).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when phone is empty', async () => {
      const invalidRequest = { ...validRequest, phone: '' };

      await expect(
        updateUserProfileUseCase.execute(userId, invalidRequest)
      ).rejects.toThrow(new ValidationError('Phone is required'));

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockAuthService.updateProfile).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when phone is only whitespace', async () => {
      const invalidRequest = { ...validRequest, phone: '   ' };

      await expect(
        updateUserProfileUseCase.execute(userId, invalidRequest)
      ).rejects.toThrow(new ValidationError('Phone is required'));

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockAuthService.updateProfile).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when avatar is empty', async () => {
      const invalidRequest = { ...validRequest, avatar: '' };

      await expect(
        updateUserProfileUseCase.execute(userId, invalidRequest)
      ).rejects.toThrow(new ValidationError('Avatar is required'));

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockAuthService.updateProfile).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when avatar is only whitespace', async () => {
      const invalidRequest = { ...validRequest, avatar: '   ' };

      await expect(
        updateUserProfileUseCase.execute(userId, invalidRequest)
      ).rejects.toThrow(new ValidationError('Avatar is required'));

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockAuthService.updateProfile).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError when user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        updateUserProfileUseCase.execute(userId, validRequest)
      ).rejects.toThrow(new NotFoundError('User'));

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockAuthService.updateProfile).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError when user is undefined', async () => {
      mockUserRepository.findById.mockResolvedValue(undefined as any);

      await expect(
        updateUserProfileUseCase.execute(userId, validRequest)
      ).rejects.toThrow(new NotFoundError('User'));

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockAuthService.updateProfile).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should propagate DomainError from authService.updateProfile', async () => {
      const domainError = new DomainError('Auth service error');
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockAuthService.updateProfile.mockRejectedValue(domainError);

      await expect(
        updateUserProfileUseCase.execute(userId, validRequest)
      ).rejects.toThrow(domainError);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockAuthService.updateProfile).toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should propagate DomainError from userRepository.update', async () => {
      const domainError = new DomainError('Repository error');
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockAuthService.updateProfile.mockResolvedValue(mockUpdatedUser);
      mockUserRepository.update.mockRejectedValue(domainError);

      await expect(
        updateUserProfileUseCase.execute(userId, validRequest)
      ).rejects.toThrow(domainError);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockAuthService.updateProfile).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalled();
    });

    it('should throw generic error when authService.updateProfile fails with non-DomainError', async () => {
      const genericError = new Error('Network error');
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockAuthService.updateProfile.mockRejectedValue(genericError);

      await expect(
        updateUserProfileUseCase.execute(userId, validRequest)
      ).rejects.toThrow('Failed to update user profile');

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockAuthService.updateProfile).toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should throw generic error when userRepository.update fails with non-DomainError', async () => {
      const genericError = new Error('Database error');
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockAuthService.updateProfile.mockResolvedValue(mockUpdatedUser);
      mockUserRepository.update.mockRejectedValue(genericError);

      await expect(
        updateUserProfileUseCase.execute(userId, validRequest)
      ).rejects.toThrow('Failed to update user profile');

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockAuthService.updateProfile).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalled();
    });

    it('should call updateProfile method on user entity with correct parameters', async () => {
      const updateProfileSpy = jest.spyOn(mockUser, 'updateProfile');
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockAuthService.updateProfile.mockResolvedValue(mockUpdatedUser);
      mockUserRepository.update.mockResolvedValue(undefined);

      await updateUserProfileUseCase.execute(userId, validRequest);

      expect(updateProfileSpy).toHaveBeenCalledWith(
        'John Doe',
        '1234567890',
        'path/to/avatar.jpg'
      );
    });

    it('should handle different user IDs correctly', async () => {
      const differentUserId = 'user-456';
      const differentUser = new User(
        differentUserId,
        'Different User',
        'different@example.com',
        '1111111111',
        'different-avatar.jpg'
      );
      const differentUpdatedUser = new User(
        differentUserId,
        'John Doe',
        'different@example.com',
        '1234567890',
        'path/to/avatar.jpg'
      );

      mockUserRepository.findById.mockResolvedValue(differentUser);
      mockAuthService.updateProfile.mockResolvedValue(differentUpdatedUser);
      mockUserRepository.update.mockResolvedValue(undefined);

      const result = await updateUserProfileUseCase.execute(
        differentUserId,
        validRequest
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(differentUserId);
      expect(result).toEqual(differentUpdatedUser);
    });

    it('should maintain correct order of operations', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockAuthService.updateProfile.mockResolvedValue(mockUpdatedUser);
      mockUserRepository.update.mockResolvedValue(undefined);

      await updateUserProfileUseCase.execute(userId, validRequest);

      // Verify that all expected calls were made
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockAuthService.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          phone: '1234567890',
          avatar: 'path/to/avatar.jpg',
        })
      );
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUpdatedUser);

      // Verify call counts
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockAuthService.updateProfile).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should handle user with empty strings in profile', async () => {
      const requestWithEmptyStrings = {
        name: 'Valid Name',
        phone: 'Valid Phone',
        avatar: 'Valid Avatar',
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockAuthService.updateProfile.mockResolvedValue(mockUpdatedUser);
      mockUserRepository.update.mockResolvedValue(undefined);

      const result = await updateUserProfileUseCase.execute(
        userId,
        requestWithEmptyStrings
      );

      expect(result).toEqual(mockUpdatedUser);
      expect(mockAuthService.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Valid Name',
          phone: 'Valid Phone',
          avatar: 'Valid Avatar',
        })
      );
    });
  });
});
