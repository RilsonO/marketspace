import { User } from '../../../entities/User';
import {
  IAuthService,
  SignUpRequest,
  AuthTokens,
} from '../../../domain/interfaces/IAuthService';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import {
  ValidationError,
  ConflictError,
  DomainError,
} from '../../../domain/errors/DomainError';

export class SignUpUseCase {
  constructor(
    private authService: IAuthService,
    private userRepository: IUserRepository
  ) {}

  async execute(
    request: SignUpRequest
  ): Promise<{ user: User; tokens: AuthTokens }> {
    this.validateRequest(request);

    // Verificar se usuário já existe
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ConflictError('User already exists with this email');
    }

    try {
      const { user, tokens } = await this.authService.signUp(request);

      // Salvar usuário no repositório local
      await this.userRepository.save(user);

      return { user, tokens };
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw new ConflictError('Failed to create user');
    }
  }

  private validateRequest(request: SignUpRequest): void {
    if (!request.name || request.name.trim() === '') {
      throw new ValidationError('Name is required');
    }
    if (!request.email || request.email.trim() === '') {
      throw new ValidationError('Email is required');
    }
    if (!request.phone || request.phone.trim() === '') {
      throw new ValidationError('Phone is required');
    }
    if (!request.password || request.password.trim() === '') {
      throw new ValidationError('Password is required');
    }
    if (!request.email.includes('@')) {
      throw new ValidationError('Invalid email format');
    }
    if (request.password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }
  }
}
