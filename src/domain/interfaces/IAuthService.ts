import { User } from '../../entities/User';

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar?: File;
}

export interface IAuthService {
  signIn(request: SignInRequest): Promise<{ user: User; tokens: AuthTokens }>;
  signUp(request: SignUpRequest): Promise<{ user: User; tokens: AuthTokens }>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  updateProfile(user: User): Promise<User>;
}

