import { UserMap } from './user.map';
import { SignInResponseDTO } from '../../application/dtos/auth/sign-in.dtos';
import { BaseUserModel, UserModel } from '../../entities/User';
import { IUserProduct } from '../../shared/types/interfaces/user-product.interface';

describe('UserMap', () => {
  describe('fromSignInResponseDTOToUserModel', () => {
    it('should convert SignInResponseDTO to UserModel with injected functions', () => {
      const signInResponse: SignInResponseDTO = {
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
          tel: '1234567890',
          avatar: 'avatar.jpg',
        },
        token: 'jwt-token',
        refresh_token: 'refresh-token',
      };

      const mockSignOut = jest.fn();
      const mockUpdateProfile = jest.fn();
      const mockFetchProducts = jest.fn();

      const result = UserMap.fromSignInResponseDTOToUserModel(
        signInResponse,
        mockSignOut,
        mockUpdateProfile,
        mockFetchProducts
      );

      expect(result).toEqual({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
        products: [],
        signOut: mockSignOut,
        updateProfile: mockUpdateProfile,
        fetchProducts: mockFetchProducts,
      });
    });

    it('should handle user with null avatar', () => {
      const signInResponse: SignInResponseDTO = {
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
          tel: '1234567890',
          avatar: null,
        },
        token: 'jwt-token',
        refresh_token: 'refresh-token',
      };

      const mockSignOut = jest.fn();
      const mockUpdateProfile = jest.fn();
      const mockFetchProducts = jest.fn();

      const result = UserMap.fromSignInResponseDTOToUserModel(
        signInResponse,
        mockSignOut,
        mockUpdateProfile,
        mockFetchProducts
      );

      expect(result.avatar).toBeNull();
      expect(result.id).toBe('user-123');
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.tel).toBe('1234567890');
      expect(result.products).toEqual([]);
    });

    it('should handle user with empty string avatar', () => {
      const signInResponse: SignInResponseDTO = {
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
          tel: '1234567890',
          avatar: '',
        },
        token: 'jwt-token',
        refresh_token: 'refresh-token',
      };

      const mockSignOut = jest.fn();
      const mockUpdateProfile = jest.fn();
      const mockFetchProducts = jest.fn();

      const result = UserMap.fromSignInResponseDTOToUserModel(
        signInResponse,
        mockSignOut,
        mockUpdateProfile,
        mockFetchProducts
      );

      expect(result.avatar).toBe('');
      expect(result.id).toBe('user-123');
    });

    it('should initialize products as empty array', () => {
      const signInResponse: SignInResponseDTO = {
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
          tel: '1234567890',
          avatar: 'avatar.jpg',
        },
        token: 'jwt-token',
        refresh_token: 'refresh-token',
      };

      const mockSignOut = jest.fn();
      const mockUpdateProfile = jest.fn();
      const mockFetchProducts = jest.fn();

      const result = UserMap.fromSignInResponseDTOToUserModel(
        signInResponse,
        mockSignOut,
        mockUpdateProfile,
        mockFetchProducts
      );

      expect(result.products).toEqual([]);
      expect(Array.isArray(result.products)).toBe(true);
    });
  });

  describe('fromUserModelToBaseUserModel', () => {
    it('should convert UserModel to BaseUserModel', () => {
      const userModel: UserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
        products: [],
        signOut: jest.fn(),
        updateProfile: jest.fn(),
        fetchProducts: jest.fn(),
      };

      const result = UserMap.fromUserModelToBaseUserModel(userModel);

      expect(result).toEqual({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      });
    });

    it('should exclude methods and products from BaseUserModel', () => {
      const userModel: UserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
        products: [
          {
            id: 'product-1',
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            is_new: true,
            is_active: true,
            accept_trade: true,
            payment_methods: [],
            product_images: [],
            user_id: 'user-123',
          } as IUserProduct,
        ],
        signOut: jest.fn(),
        updateProfile: jest.fn(),
        fetchProducts: jest.fn(),
      };

      const result = UserMap.fromUserModelToBaseUserModel(userModel);

      expect(result).toEqual({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      });
      expect(result).not.toHaveProperty('products');
      expect(result).not.toHaveProperty('signOut');
      expect(result).not.toHaveProperty('updateProfile');
      expect(result).not.toHaveProperty('fetchProducts');
    });

    it('should handle null avatar', () => {
      const userModel: UserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: null,
        products: [],
        signOut: jest.fn(),
        updateProfile: jest.fn(),
        fetchProducts: jest.fn(),
      };

      const result = UserMap.fromUserModelToBaseUserModel(userModel);

      expect(result.avatar).toBeNull();
    });
  });

  describe('fromBaseUserModelToUserModel', () => {
    it('should convert BaseUserModel to UserModel with injected functions', () => {
      const baseUser: BaseUserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      };

      const mockSignOut = jest.fn();
      const mockUpdateProfile = jest.fn();
      const mockFetchProducts = jest.fn();

      const result = UserMap.fromBaseUserModelToUserModel({
        user: baseUser,
        signOut: mockSignOut,
        updateProfile: mockUpdateProfile,
        fetchProducts: mockFetchProducts,
      });

      expect(result).toEqual({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
        products: [],
        signOut: mockSignOut,
        updateProfile: mockUpdateProfile,
        fetchProducts: mockFetchProducts,
      });
    });

    it('should handle null avatar', () => {
      const baseUser: BaseUserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: null,
      };

      const mockSignOut = jest.fn();
      const mockUpdateProfile = jest.fn();
      const mockFetchProducts = jest.fn();

      const result = UserMap.fromBaseUserModelToUserModel({
        user: baseUser,
        signOut: mockSignOut,
        updateProfile: mockUpdateProfile,
        fetchProducts: mockFetchProducts,
      });

      expect(result.avatar).toBeNull();
      expect(result.products).toEqual([]);
    });

    it('should initialize products as empty array', () => {
      const baseUser: BaseUserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
      };

      const mockSignOut = jest.fn();
      const mockUpdateProfile = jest.fn();
      const mockFetchProducts = jest.fn();

      const result = UserMap.fromBaseUserModelToUserModel({
        user: baseUser,
        signOut: mockSignOut,
        updateProfile: mockUpdateProfile,
        fetchProducts: mockFetchProducts,
      });

      expect(result.products).toEqual([]);
      expect(Array.isArray(result.products)).toBe(true);
    });
  });

  describe('Round-trip conversion', () => {
    it('should maintain data integrity through UserModel ↔ BaseUserModel conversion', () => {
      const originalUserModel: UserModel = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        tel: '1234567890',
        avatar: 'avatar.jpg',
        products: [],
        signOut: jest.fn(),
        updateProfile: jest.fn(),
        fetchProducts: jest.fn(),
      };

      const baseUser = UserMap.fromUserModelToBaseUserModel(originalUserModel);
      const backToUserModel = UserMap.fromBaseUserModelToUserModel({
        user: baseUser,
        signOut: originalUserModel.signOut,
        updateProfile: originalUserModel.updateProfile,
        fetchProducts: originalUserModel.fetchProducts,
      });

      expect(backToUserModel.id).toBe(originalUserModel.id);
      expect(backToUserModel.name).toBe(originalUserModel.name);
      expect(backToUserModel.email).toBe(originalUserModel.email);
      expect(backToUserModel.tel).toBe(originalUserModel.tel);
      expect(backToUserModel.avatar).toBe(originalUserModel.avatar);
      expect(backToUserModel.products).toEqual([]);
    });
  });

  describe('Edge cases', () => {
    it('should handle special characters in user data', () => {
      const signInResponse: SignInResponseDTO = {
        user: {
          id: 'user-ção-ñ',
          name: 'João & Maria',
          email: 'joão.maria@example.com',
          tel: '+55 (11) 99999-9999',
          avatar: 'avatar with spaces.jpg',
        },
        token: 'jwt-token',
        refresh_token: 'refresh-token',
      };

      const mockSignOut = jest.fn();
      const mockUpdateProfile = jest.fn();
      const mockFetchProducts = jest.fn();

      const result = UserMap.fromSignInResponseDTOToUserModel(
        signInResponse,
        mockSignOut,
        mockUpdateProfile,
        mockFetchProducts
      );

      expect(result.id).toBe('user-ção-ñ');
      expect(result.name).toBe('João & Maria');
      expect(result.email).toBe('joão.maria@example.com');
      expect(result.tel).toBe('+55 (11) 99999-9999');
      expect(result.avatar).toBe('avatar with spaces.jpg');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const signInResponse: SignInResponseDTO = {
        user: {
          id: 'user-123',
          name: longString,
          email: `${longString}@example.com`,
          tel: longString,
          avatar: `${longString}.jpg`,
        },
        token: 'jwt-token',
        refresh_token: 'refresh-token',
      };

      const mockSignOut = jest.fn();
      const mockUpdateProfile = jest.fn();
      const mockFetchProducts = jest.fn();

      const result = UserMap.fromSignInResponseDTOToUserModel(
        signInResponse,
        mockSignOut,
        mockUpdateProfile,
        mockFetchProducts
      );

      expect(result.name).toBe(longString);
      expect(result.email).toBe(`${longString}@example.com`);
      expect(result.tel).toBe(longString);
      expect(result.avatar).toBe(`${longString}.jpg`);
    });

    it('should handle empty strings', () => {
      const signInResponse: SignInResponseDTO = {
        user: {
          id: '',
          name: '',
          email: '',
          tel: '',
          avatar: '',
        },
        token: 'jwt-token',
        refresh_token: 'refresh-token',
      };

      const mockSignOut = jest.fn();
      const mockUpdateProfile = jest.fn();
      const mockFetchProducts = jest.fn();

      const result = UserMap.fromSignInResponseDTOToUserModel(
        signInResponse,
        mockSignOut,
        mockUpdateProfile,
        mockFetchProducts
      );

      expect(result.id).toBe('');
      expect(result.name).toBe('');
      expect(result.email).toBe('');
      expect(result.tel).toBe('');
      expect(result.avatar).toBe('');
      expect(result.products).toEqual([]);
    });
  });

  describe('Function injection', () => {
    it('should properly inject and preserve function references', () => {
      const mockSignOut = jest.fn();
      const mockUpdateProfile = jest.fn();
      const mockFetchProducts = jest.fn();

      const signInResponse: SignInResponseDTO = {
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
          tel: '1234567890',
          avatar: 'avatar.jpg',
        },
        token: 'jwt-token',
        refresh_token: 'refresh-token',
      };

      const result = UserMap.fromSignInResponseDTOToUserModel(
        signInResponse,
        mockSignOut,
        mockUpdateProfile,
        mockFetchProducts
      );

      expect(result.signOut).toBe(mockSignOut);
      expect(result.updateProfile).toBe(mockUpdateProfile);
      expect(result.fetchProducts).toBe(mockFetchProducts);

      // Test that functions can be called
      result.signOut();
      result.updateProfile();
      result.fetchProducts();

      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
      expect(mockFetchProducts).toHaveBeenCalledTimes(1);
    });

    it('should handle different function implementations', () => {
      const asyncSignOut = jest.fn().mockResolvedValue(undefined);
      const asyncUpdateProfile = jest.fn().mockResolvedValue(undefined);
      const asyncFetchProducts = jest.fn().mockResolvedValue(undefined);

      const signInResponse: SignInResponseDTO = {
        user: {
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
          tel: '1234567890',
          avatar: 'avatar.jpg',
        },
        token: 'jwt-token',
        refresh_token: 'refresh-token',
      };

      const result = UserMap.fromSignInResponseDTOToUserModel(
        signInResponse,
        asyncSignOut,
        asyncUpdateProfile,
        asyncFetchProducts
      );

      expect(result.signOut).toBe(asyncSignOut);
      expect(result.updateProfile).toBe(asyncUpdateProfile);
      expect(result.fetchProducts).toBe(asyncFetchProducts);
    });
  });
});
