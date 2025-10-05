import { User } from '../../../entities/User';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { IAuthService } from '../../../domain/interfaces/IAuthService';
import {
  DomainError,
  ValidationError,
  NotFoundError,
} from '../../../domain/errors/DomainError';

export interface UpdateProfileRequest {
  name: string;
  phone: string;
  avatar: string;
}

export class UpdateUserProfileUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(userId: string, request: UpdateProfileRequest): Promise<User> {
    this.validateRequest(request);

    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundError('User');
    }

    try {
      const updatedUser = existingUser.updateProfile(
        request.name,
        request.phone,
        request.avatar
      );

      // Atualizar no serviço de autenticação
      const savedUser = await this.authService.updateProfile(updatedUser);

      // Atualizar no repositório local
      await this.userRepository.update(savedUser);

      return savedUser;
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw new Error('Failed to update user profile');
    }
  }

  private validateRequest(request: UpdateProfileRequest): void {
    if (!request.name || request.name.trim() === '') {
      throw new ValidationError('Name is required');
    }
    if (!request.phone || request.phone.trim() === '') {
      throw new ValidationError('Phone is required');
    }
    if (!request.avatar || request.avatar.trim() === '') {
      throw new ValidationError('Avatar is required');
    }
  }
}
