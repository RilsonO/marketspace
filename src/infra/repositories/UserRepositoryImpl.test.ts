import { UserRepositoryImpl } from './UserRepositoryImpl';
import { User } from '../../entities/User';

// Mock das dependências
jest.mock('../storage/user.storage', () => ({
  storageUserGet: jest.fn(),
  storageUserSave: jest.fn(),
  storageUserRemove: jest.fn(),
}));

import {
  storageUserGet,
  storageUserSave,
  storageUserRemove,
} from '../storage/user.storage';

const mockStorageUserGet = storageUserGet as jest.MockedFunction<
  typeof storageUserGet
>;
const mockStorageUserSave = storageUserSave as jest.MockedFunction<
  typeof storageUserSave
>;
const mockStorageUserRemove = storageUserRemove as jest.MockedFunction<
  typeof storageUserRemove
>;

describe('UserRepositoryImpl', () => {
  let repository: UserRepositoryImpl;

  beforeEach(() => {
    repository = new UserRepositoryImpl();
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user when email matches', async () => {
      const mockStoredUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      };

      mockStorageUserGet.mockResolvedValue(mockStoredUser);

      const result = await repository.findByEmail('john@example.com');

      expect(mockStorageUserGet).toHaveBeenCalled();
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe('user-1');
      expect(result?.name).toBe('John Doe');
      expect(result?.email).toBe('john@example.com');
      expect(result?.phone).toBe('1234567890');
      expect(result?.avatar).toBe('avatar.jpg');
    });

    it('should return null when email does not match', async () => {
      const mockStoredUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      };

      mockStorageUserGet.mockResolvedValue(mockStoredUser);

      const result = await repository.findByEmail('different@example.com');

      expect(mockStorageUserGet).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when no user is stored', async () => {
      mockStorageUserGet.mockResolvedValue(null);

      const result = await repository.findByEmail('john@example.com');

      expect(mockStorageUserGet).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when storage throws error', async () => {
      mockStorageUserGet.mockRejectedValue(new Error('Storage error'));

      const result = await repository.findByEmail('john@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when id matches', async () => {
      const mockStoredUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      };

      mockStorageUserGet.mockResolvedValue(mockStoredUser);

      const result = await repository.findById('user-1');

      expect(mockStorageUserGet).toHaveBeenCalled();
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe('user-1');
      expect(result?.name).toBe('John Doe');
      expect(result?.email).toBe('john@example.com');
      expect(result?.phone).toBe('1234567890');
      expect(result?.avatar).toBe('avatar.jpg');
    });

    it('should return null when id does not match', async () => {
      const mockStoredUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      };

      mockStorageUserGet.mockResolvedValue(mockStoredUser);

      const result = await repository.findById('different-id');

      expect(mockStorageUserGet).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when no user is stored', async () => {
      mockStorageUserGet.mockResolvedValue(null);

      const result = await repository.findById('user-1');

      expect(mockStorageUserGet).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when storage throws error', async () => {
      mockStorageUserGet.mockRejectedValue(new Error('Storage error'));

      const result = await repository.findById('user-1');

      expect(result).toBeNull();
    });
  });

  describe('findStored', () => {
    it('should return stored user when available', async () => {
      const mockStoredUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      };

      mockStorageUserGet.mockResolvedValue(mockStoredUser);

      const result = await repository.findStored();

      expect(mockStorageUserGet).toHaveBeenCalled();
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe('user-1');
      expect(result?.name).toBe('John Doe');
      expect(result?.email).toBe('john@example.com');
      expect(result?.phone).toBe('1234567890');
      expect(result?.avatar).toBe('avatar.jpg');
    });

    it('should return null when no user is stored', async () => {
      mockStorageUserGet.mockResolvedValue(null);

      const result = await repository.findStored();

      expect(mockStorageUserGet).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when storage throws error', async () => {
      mockStorageUserGet.mockRejectedValue(new Error('Storage error'));

      const result = await repository.findStored();

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save user correctly', async () => {
      const user = new User(
        'user-1',
        'John Doe',
        'john@example.com',
        '1234567890',
        'avatar.jpg'
      );

      mockStorageUserSave.mockResolvedValue(undefined);

      await repository.save(user);

      expect(mockStorageUserSave).toHaveBeenCalledWith({
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      });
    });

    it('should handle user with empty avatar', async () => {
      const user = new User(
        'user-1',
        'John Doe',
        'john@example.com',
        '1234567890',
        ''
      );

      mockStorageUserSave.mockResolvedValue(undefined);

      await repository.save(user);

      expect(mockStorageUserSave).toHaveBeenCalledWith({
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: '',
      });
    });
  });

  describe('update', () => {
    it('should update user by calling save', async () => {
      const user = new User(
        'user-1',
        'Updated Name',
        'updated@example.com',
        '9876543210',
        'new-avatar.jpg'
      );

      mockStorageUserSave.mockResolvedValue(undefined);

      await repository.update(user);

      expect(mockStorageUserSave).toHaveBeenCalledWith({
        id: 'user-1',
        name: 'Updated Name',
        email: 'updated@example.com',
        tel: '9876543210',
        avatar: 'new-avatar.jpg',
      });
    });
  });

  describe('delete', () => {
    it('should remove user from storage', async () => {
      mockStorageUserRemove.mockResolvedValue(undefined);

      await repository.delete();

      expect(mockStorageUserRemove).toHaveBeenCalled();
    });
  });

  describe('User entity creation', () => {
    it('should create User entity with correct constructor parameters', async () => {
      const mockStoredUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      };

      mockStorageUserGet.mockResolvedValue(mockStoredUser);

      const result = await repository.findById('user-1');

      expect(result).toBeInstanceOf(User);
      // Verify the User constructor was called with correct parameters
      // by checking the properties are set correctly
      expect(result?.id).toBe('user-1');
      expect(result?.name).toBe('John Doe');
      expect(result?.email).toBe('john@example.com');
      expect(result?.phone).toBe('1234567890');
      expect(result?.avatar).toBe('avatar.jpg');
    });

    it('should handle user with null avatar', async () => {
      const mockStoredUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: null,
      };

      mockStorageUserGet.mockResolvedValue(mockStoredUser);

      const result = await repository.findById('user-1');

      expect(result).toBeInstanceOf(User);
      expect(result?.avatar).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should handle storage errors gracefully in read methods', async () => {
      const error = new Error('Storage connection failed');
      mockStorageUserGet.mockRejectedValue(error);

      const findByEmailResult = await repository.findByEmail(
        'test@example.com'
      );
      const findByIdResult = await repository.findById('test-id');
      const findStoredResult = await repository.findStored();

      expect(findByEmailResult).toBeNull();
      expect(findByIdResult).toBeNull();
      expect(findStoredResult).toBeNull();
    });

    it('should propagate errors for write methods', async () => {
      const error = new Error('Storage connection failed');
      mockStorageUserSave.mockRejectedValue(error);
      mockStorageUserRemove.mockRejectedValue(error);

      // These should throw errors (propagate errors)
      await expect(
        repository.save(new User('1', 'Test', 'test@test.com', '123', ''))
      ).rejects.toThrow(error);
      await expect(
        repository.update(new User('1', 'Test', 'test@test.com', '123', ''))
      ).rejects.toThrow(error);
      await expect(repository.delete()).rejects.toThrow(error);
    });
  });
});
