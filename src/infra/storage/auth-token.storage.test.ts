import {
  storageAuthTokenSave,
  storageAuthTokenGet,
  storageAuthTokenRemove,
} from './auth-token.storage';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock do config.storage
jest.mock('./config.storage', () => ({
  AUTH_TOKEN_STORAGE: '@rilson-market-space:token',
}));

import AsyncStorage from '@react-native-async-storage/async-storage';

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('Auth Token Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('storageAuthTokenSave', () => {
    it('should save auth tokens successfully', async () => {
      const tokens = {
        token: 'jwt-token-123',
        refresh_token: 'refresh-token-456',
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await storageAuthTokenSave(tokens);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:token',
        JSON.stringify(tokens)
      );
      expect(mockAsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it('should save tokens with empty strings', async () => {
      const tokens = {
        token: '',
        refresh_token: '',
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await storageAuthTokenSave(tokens);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:token',
        JSON.stringify(tokens)
      );
    });

    it('should save tokens with null values', async () => {
      const tokens = {
        token: null as any,
        refresh_token: null as any,
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await storageAuthTokenSave(tokens);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:token',
        JSON.stringify(tokens)
      );
    });

    it('should handle AsyncStorage errors', async () => {
      const tokens = {
        token: 'jwt-token-123',
        refresh_token: 'refresh-token-456',
      };

      const error = new Error('Storage error');
      mockAsyncStorage.setItem.mockRejectedValue(error);

      await expect(storageAuthTokenSave(tokens)).rejects.toThrow(
        'Storage error'
      );
    });

    it('should handle special characters in tokens', async () => {
      const tokens = {
        token: 'jwt-token-with-special-chars-!@#$%^&*()',
        refresh_token: 'refresh-token-with-unicode-ñ-ç-ã',
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await storageAuthTokenSave(tokens);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:token',
        JSON.stringify(tokens)
      );
    });

    it('should handle very long tokens', async () => {
      const longToken = 'a'.repeat(10000);
      const tokens = {
        token: longToken,
        refresh_token: longToken,
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await storageAuthTokenSave(tokens);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:token',
        JSON.stringify(tokens)
      );
    });
  });

  describe('storageAuthTokenGet', () => {
    it('should retrieve auth tokens successfully', async () => {
      const tokens = {
        token: 'jwt-token-123',
        refresh_token: 'refresh-token-456',
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(tokens));

      const result = await storageAuthTokenGet();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(
        '@rilson-market-space:token'
      );
      expect(result).toEqual(tokens);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('should return empty object when storage is empty', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await storageAuthTokenGet();

      expect(result).toEqual({
        token: undefined,
        refresh_token: undefined,
      });
    });

    it('should return empty object when storage returns empty string', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('');

      const result = await storageAuthTokenGet();

      expect(result).toEqual({
        token: undefined,
        refresh_token: undefined,
      });
    });

    it('should handle tokens with null values', async () => {
      const tokens = {
        token: null,
        refresh_token: null,
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(tokens));

      const result = await storageAuthTokenGet();

      expect(result).toEqual(tokens);
    });

    it('should handle tokens with empty strings', async () => {
      const tokens = {
        token: '',
        refresh_token: '',
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(tokens));

      const result = await storageAuthTokenGet();

      expect(result).toEqual(tokens);
    });

    it('should throw error when JSON is malformed', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid-json{');

      await expect(storageAuthTokenGet()).rejects.toThrow('Unexpected token');
    });

    it('should handle partial token data', async () => {
      const partialTokens = {
        token: 'jwt-token-123',
        // refresh_token is missing
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(partialTokens));

      const result = await storageAuthTokenGet();

      expect(result).toEqual({
        token: 'jwt-token-123',
        refresh_token: undefined,
      });
    });

    it('should handle AsyncStorage errors', async () => {
      const error = new Error('Storage read error');
      mockAsyncStorage.getItem.mockRejectedValue(error);

      await expect(storageAuthTokenGet()).rejects.toThrow('Storage read error');
    });

    it('should handle special characters in stored tokens', async () => {
      const tokens = {
        token: 'jwt-token-with-special-chars-!@#$%^&*()',
        refresh_token: 'refresh-token-with-unicode-ñ-ç-ã',
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(tokens));

      const result = await storageAuthTokenGet();

      expect(result).toEqual(tokens);
    });

    it('should handle very long tokens', async () => {
      const longToken = 'a'.repeat(10000);
      const tokens = {
        token: longToken,
        refresh_token: longToken,
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(tokens));

      const result = await storageAuthTokenGet();

      expect(result).toEqual(tokens);
    });
  });

  describe('storageAuthTokenRemove', () => {
    it('should remove auth tokens successfully', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue(undefined);

      await storageAuthTokenRemove();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
        '@rilson-market-space:token'
      );
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledTimes(1);
    });

    it('should handle AsyncStorage errors', async () => {
      const error = new Error('Storage remove error');
      mockAsyncStorage.removeItem.mockRejectedValue(error);

      await expect(storageAuthTokenRemove()).rejects.toThrow(
        'Storage remove error'
      );
    });

    it('should handle removal when item does not exist', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue(undefined);

      await storageAuthTokenRemove();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
        '@rilson-market-space:token'
      );
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete save-get-remove flow', async () => {
      const tokens = {
        token: 'integration-token',
        refresh_token: 'integration-refresh-token',
      };

      // Save
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await storageAuthTokenSave(tokens);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:token',
        JSON.stringify(tokens)
      );

      // Get
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(tokens));
      const retrievedTokens = await storageAuthTokenGet();
      expect(retrievedTokens).toEqual(tokens);

      // Remove
      mockAsyncStorage.removeItem.mockResolvedValue(undefined);
      await storageAuthTokenRemove();
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
        '@rilson-market-space:token'
      );
    });

    it('should handle save-get-update flow', async () => {
      const initialTokens = {
        token: 'initial-token',
        refresh_token: 'initial-refresh-token',
      };

      const updatedTokens = {
        token: 'updated-token',
        refresh_token: 'updated-refresh-token',
      };

      // Save initial tokens
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await storageAuthTokenSave(initialTokens);

      // Get initial tokens
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(initialTokens));
      const retrievedInitial = await storageAuthTokenGet();
      expect(retrievedInitial).toEqual(initialTokens);

      // Update tokens
      await storageAuthTokenSave(updatedTokens);

      // Get updated tokens
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(updatedTokens));
      const retrievedUpdated = await storageAuthTokenGet();
      expect(retrievedUpdated).toEqual(updatedTokens);
    });

    it('should handle concurrent operations', async () => {
      const tokens1 = {
        token: 'token-1',
        refresh_token: 'refresh-token-1',
      };

      const tokens2 = {
        token: 'token-2',
        refresh_token: 'refresh-token-2',
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(tokens1));

      // Start multiple operations concurrently
      const savePromise1 = storageAuthTokenSave(tokens1);
      const savePromise2 = storageAuthTokenSave(tokens2);
      const getPromise = storageAuthTokenGet();

      await Promise.all([savePromise1, savePromise2, getPromise]);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledTimes(2);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined values', async () => {
      const tokens = {
        token: undefined as any,
        refresh_token: undefined as any,
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await storageAuthTokenSave(tokens);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:token',
        JSON.stringify(tokens)
      );
    });

    it('should handle empty object', async () => {
      const tokens = {} as any;

      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await storageAuthTokenSave(tokens);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:token',
        JSON.stringify(tokens)
      );
    });

    it('should handle extra properties in stored data', async () => {
      const storedData = {
        token: 'jwt-token-123',
        refresh_token: 'refresh-token-456',
        extraProperty: 'should-be-ignored',
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedData));

      const result = await storageAuthTokenGet();

      expect(result).toEqual({
        token: 'jwt-token-123',
        refresh_token: 'refresh-token-456',
      });
    });

    it('should handle JSON with nested objects', async () => {
      const fixedTimestamp = 1640995200000; // Fixed timestamp for testing
      const complexTokens = {
        token: 'jwt-token-123',
        refresh_token: 'refresh-token-456',
        metadata: {
          issued_at: fixedTimestamp,
          expires_in: 3600,
        },
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      await storageAuthTokenSave(complexTokens);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledTimes(1);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@rilson-market-space:token',
        expect.any(String)
      );
    });
  });
});
