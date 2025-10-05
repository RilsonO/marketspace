import { User } from '../../entities/User';
import {
  IAuthService,
  SignInRequest,
  SignUpRequest,
  AuthTokens,
} from '../../domain/interfaces/IAuthService';
import {
  signIn,
  signUp as signUpRepository,
  updateProfile,
} from '../http/repositories/user.repository';
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
} from '../storage/auth-token.storage';
import { UnauthorizedError } from '../../domain/errors/DomainError';

export class AuthServiceImpl implements IAuthService {
  async signIn(
    request: SignInRequest
  ): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response = await signIn(request);

      const user = new User(
        response.user.id,
        response.user.name,
        response.user.email,
        response.user.tel,
        response.user.avatar
      );

      const tokens: AuthTokens = {
        token: response.token,
        refreshToken: response.refresh_token,
      };

      return { user, tokens };
    } catch (error) {
      throw new UnauthorizedError('Invalid credentials');
    }
  }

  async signUp(
    request: SignUpRequest
  ): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      // Mapear SignUpRequest para SignUpRequestDTO
      const signUpRequest = {
        name: request.name,
        email: request.email,
        phone: request.phone,
        password: request.password,
        photo: request.avatar
          ? {
              name: 'avatar',
              uri: request.avatar.name,
              type: 'image',
            }
          : {
              name: 'default',
              uri: '',
              type: 'image',
            },
      };

      await signUpRepository(signUpRequest);

      // Após o signup, fazer login para obter os tokens
      const loginResponse = await signIn({
        email: request.email,
        password: request.password,
      });

      const user = new User(
        loginResponse.user.id,
        loginResponse.user.name,
        loginResponse.user.email,
        loginResponse.user.tel,
        loginResponse.user.avatar
      );

      const tokens: AuthTokens = {
        token: loginResponse.token,
        refreshToken: loginResponse.refresh_token,
      };

      return { user, tokens };
    } catch (error) {
      throw new UnauthorizedError('Failed to create account');
    }
  }

  async refreshToken(): Promise<AuthTokens> {
    try {
      // Implementar lógica de refresh token
      // Por enquanto, retornar erro para forçar novo login
      throw new UnauthorizedError('Token refresh not implemented');
    } catch (error) {
      throw new UnauthorizedError('Failed to refresh token');
    }
  }

  async signOut(): Promise<void> {
    await storageAuthTokenRemove();
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { token } = await storageAuthTokenGet();
      if (!token) {
        return null;
      }

      const userData = await updateProfile();
      return new User(
        userData.id,
        userData.name,
        userData.email,
        userData.tel,
        userData.avatar
      );
    } catch {
      return null;
    }
  }

  async updateProfile(): Promise<User> {
    try {
      const response = await updateProfile();
      return new User(
        response.id,
        response.name,
        response.email,
        response.tel,
        response.avatar
      );
    } catch (error) {
      throw new UnauthorizedError('Failed to update profile');
    }
  }
}
