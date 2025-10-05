import { User } from '../../../entities/User';
import {
  IAuthService,
  SignInRequest,
  AuthTokens,
} from '../../../domain/interfaces/IAuthService';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import {
  DomainError,
  ValidationError,
  UnauthorizedError,
} from '../../../domain/errors/DomainError';

export class SignInUseCase {
  constructor(
    private authService: IAuthService,
    private userRepository: IUserRepository
  ) {}

  async execute(
    request: SignInRequest
  ): Promise<{ user: User; tokens: AuthTokens }> {
    this.validateRequest(request);

    try {
      const { user, tokens } = await this.authService.signIn(request);

      // Salvar usuário no repositório local
      await this.userRepository.save(user);

      return { user, tokens };
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw new UnauthorizedError('Invalid credentials');
    }
  }

  private validateRequest(request: SignInRequest): void {
    if (!request.email || request.email.trim() === '') {
      throw new ValidationError('Email is required');
    }
    if (!request.password || request.password.trim() === '') {
      throw new ValidationError('Password is required');
    }
    if (!request.email.includes('@')) {
      throw new ValidationError('Invalid email format');
    }
  }
}
