import {
  storageUserSave,
  storageUserGet,
  storageUserRemove,
} from './user.storage';
import { BaseUserModel } from '../../entities/User';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock do config.storage
jest.mock('./config.storage', () => ({
  USER_STORAGE: '@rilson-market-space:user',
}));

import AsyncStorage from '@react-native-async-storage/async-storage';

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('User Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('storageUserSave', () => {
    it('should save user data successfully', async () => {
      const user: BaseUserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await storageUserSave(user);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:user',
        JSON.stringify(user)
      );
      expect(mockAsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it('should save user with null avatar', async () => {
      const user: BaseUserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: null,
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await storageUserSave(user);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:user',
        JSON.stringify(user)
      );
    });

    it('should save user with empty avatar', async () => {
      const user: BaseUserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: '',
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await storageUserSave(user);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:user',
        JSON.stringify(user)
      );
    });

    it('should save user with empty strings', async () => {
      const user: BaseUserModel = {
        id: '',
        name: '',
        email: '',
        tel: '',
        avatar: '',
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await storageUserSave(user);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:user',
        JSON.stringify(user)
      );
    });

    it('should handle AsyncStorage errors', async () => {
      const user: BaseUserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      };

      const error = new Error('Storage error');
      mockAsyncStorage.setItem.mockRejectedValue(error);

      await expect(storageUserSave(user)).rejects.toThrow('Storage error');
    });

    it('should handle special characters in user data', async () => {
      const user: BaseUserModel = {
        id: 'user-ção-ñ',
        name: 'João & Maria',
        email: 'joão.maria@example.com',
        tel: '+55 (11) 99999-9999',
        avatar: 'avatar with spaces.jpg',
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await storageUserSave(user);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:user',
        JSON.stringify(user)
      );
    });

    it('should handle very long user data', async () => {
      const longString = 'a'.repeat(1000);
      const user: BaseUserModel = {
        id: longString,
        name: longString,
        email: `${longString}@example.com`,
        tel: longString,
        avatar: `${longString}.jpg`,
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await storageUserSave(user);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:user',
        JSON.stringify(user)
      );
    });

    it('should handle user with complex email', async () => {
      const user: BaseUserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john.doe+test@example-domain.co.uk',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await storageUserSave(user);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:user',
        JSON.stringify(user)
      );
    });
  });

  describe('storageUserGet', () => {
    it('should retrieve user data successfully', async () => {
      const user: BaseUserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(user));

      const result = await storageUserGet();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(
        '@rilson-market-space:user'
      );
      expect(result).toEqual(user);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('should return empty object when storage is empty', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await storageUserGet();

      expect(result).toEqual({
        id: undefined,
        avatar: undefined,
        name: undefined,
        email: undefined,
        tel: undefined,
      });
    });

    it('should return empty object when storage returns empty string', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('');

      const result = await storageUserGet();

      expect(result).toEqual({
        id: undefined,
        avatar: undefined,
        name: undefined,
        email: undefined,
        tel: undefined,
      });
    });

    it('should handle user with null avatar', async () => {
      const user: BaseUserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: null,
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(user));

      const result = await storageUserGet();

      expect(result).toEqual(user);
    });

    it('should handle user with empty strings', async () => {
      const user: BaseUserModel = {
        id: '',
        name: '',
        email: '',
        tel: '',
        avatar: '',
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(user));

      const result = await storageUserGet();

      expect(result).toEqual(user);
    });

    it('should throw error when JSON is malformed', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid-json{');

      await expect(storageUserGet()).rejects.toThrow('Unexpected token');
    });

    it('should handle partial user data', async () => {
      const partialUser = {
        id: 'user-123',
        name: 'John Doe',
        // email, tel, avatar are missing
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(partialUser));

      const result = await storageUserGet();

      expect(result).toEqual({
        id: 'user-123',
        name: 'John Doe',
        email: undefined,
        tel: undefined,
        avatar: undefined,
      });
    });

    it('should handle AsyncStorage errors', async () => {
      const error = new Error('Storage read error');
      mockAsyncStorage.getItem.mockRejectedValue(error);

      await expect(storageUserGet()).rejects.toThrow('Storage read error');
    });

    it('should handle special characters in stored user data', async () => {
      const user: BaseUserModel = {
        id: 'user-ção-ñ',
        name: 'João & Maria',
        email: 'joão.maria@example.com',
        tel: '+55 (11) 99999-9999',
        avatar: 'avatar with spaces.jpg',
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(user));

      const result = await storageUserGet();

      expect(result).toEqual(user);
    });

    it('should handle very long user data', async () => {
      const longString = 'a'.repeat(1000);
      const user: BaseUserModel = {
        id: longString,
        name: longString,
        email: `${longString}@example.com`,
        tel: longString,
        avatar: `${longString}.jpg`,
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(user));

      const result = await storageUserGet();

      expect(result).toEqual(user);
    });

    it('should handle user with complex email', async () => {
      const user: BaseUserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john.doe+test@example-domain.co.uk',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(user));

      const result = await storageUserGet();

      expect(result).toEqual(user);
    });
  });

  describe('storageUserRemove', () => {
    it('should remove user data successfully', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue(undefined);

      await storageUserRemove();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
        '@rilson-market-space:user'
      );
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledTimes(1);
    });

    it('should handle AsyncStorage errors', async () => {
      const error = new Error('Storage remove error');
      mockAsyncStorage.removeItem.mockRejectedValue(error);

      await expect(storageUserRemove()).rejects.toThrow('Storage remove error');
    });

    it('should handle removal when item does not exist', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue(undefined);

      await storageUserRemove();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
        '@rilson-market-space:user'
      );
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete save-get-remove flow', async () => {
      const user: BaseUserModel = {
        id: 'integration-user',
        name: 'Integration Test User',
        email: 'integration@example.com',
        tel: '9876543210',
        avatar: 'integration-avatar.jpg',
      };

      // Save
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await storageUserSave(user);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:user',
        JSON.stringify(user)
      );

      // Get
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(user));
      const retrievedUser = await storageUserGet();
      expect(retrievedUser).toEqual(user);

      // Remove
      mockAsyncStorage.removeItem.mockResolvedValue(undefined);
      await storageUserRemove();
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
        '@rilson-market-space:user'
      );
    });

    it('should handle save-get-update flow', async () => {
      const initialUser: BaseUserModel = {
        id: 'user-123',
        name: 'Initial User',
        email: 'initial@example.com',
        tel: '1111111111',
        avatar: 'initial-avatar.jpg',
      };

      const updatedUser: BaseUserModel = {
        id: 'user-123',
        name: 'Updated User',
        email: 'updated@example.com',
        tel: '2222222222',
        avatar: 'updated-avatar.jpg',
      };

      // Save initial user
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await storageUserSave(initialUser);

      // Get initial user
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(initialUser));
      const retrievedInitial = await storageUserGet();
      expect(retrievedInitial).toEqual(initialUser);

      // Update user
      await storageUserSave(updatedUser);

      // Get updated user
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(updatedUser));
      const retrievedUpdated = await storageUserGet();
      expect(retrievedUpdated).toEqual(updatedUser);
    });

    it('should handle concurrent operations', async () => {
      const user1: BaseUserModel = {
        id: 'user-1',
        name: 'User One',
        email: 'user1@example.com',
        tel: '1111111111',
        avatar: 'avatar1.jpg',
      };

      const user2: BaseUserModel = {
        id: 'user-2',
        name: 'User Two',
        email: 'user2@example.com',
        tel: '2222222222',
        avatar: 'avatar2.jpg',
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(user1));

      // Start multiple operations concurrently
      const savePromise1 = storageUserSave(user1);
      const savePromise2 = storageUserSave(user2);
      const getPromise = storageUserGet();

      await Promise.all([savePromise1, savePromise2, getPromise]);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledTimes(2);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined values', async () => {
      const user = {
        id: undefined,
        name: undefined,
        email: undefined,
        tel: undefined,
        avatar: undefined,
      } as any;

      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await storageUserSave(user);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:user',
        JSON.stringify(user)
      );
    });

    it('should handle empty object', async () => {
      const user = {} as any;

      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await storageUserSave(user);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:user',
        JSON.stringify(user)
      );
    });

    it('should handle extra properties in stored data', async () => {
      const storedData = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
        extraProperty: 'should-be-ignored',
        products: ['product1', 'product2'],
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedData));

      const result = await storageUserGet();

      expect(result).toEqual({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
        extraProperty: 'should-be-ignored',
        products: ['product1', 'product2'],
      });
    });

    it('should handle JSON with nested objects', async () => {
      const complexUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
        preferences: {
          theme: 'dark',
          notifications: true,
        },
        metadata: {
          created_at: Date.now(),
          last_login: Date.now(),
        },
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await storageUserSave(complexUser as any);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:user',
        JSON.stringify(complexUser)
      );
    });

    it('should handle user with array values', async () => {
      const userWithArrays = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
        tags: ['developer', 'react-native', 'mobile'],
        socialLinks: ['twitter.com/john', 'github.com/john'],
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await storageUserSave(userWithArrays as any);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:user',
        JSON.stringify(userWithArrays)
      );
    });
  });
});
