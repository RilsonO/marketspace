import { IUserProduct } from '../shared/types/interfaces/user-product.interface';

// Base interface for user data (used in storage and DTOs)
export interface BaseUserModel {
  id: string;
  avatar: string;
  name: string;
  email: string;
  tel: string;
}

// Extended interface for legacy compatibility (will be removed)
export interface UserModel extends BaseUserModel {
  products: IUserProduct[];
  fetchProducts: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: () => Promise<void>;
}

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly avatar: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id || this.id.trim() === '') {
      throw new Error('User ID is required');
    }
    if (!this.name || this.name.trim() === '') {
      throw new Error('User name is required');
    }
    if (!this.email || this.email.trim() === '') {
      throw new Error('User email is required');
    }
    if (!this.isValidEmail()) {
      throw new Error('Invalid email format');
    }
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  hasValidPhone(): boolean {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(this.phone);
  }

  updateProfile(name: string, phone: string, avatar: string): User {
    return new User(this.id, name, this.email, phone, avatar);
  }

  equals(other: User): boolean {
    return this.id === other.id;
  }

  // Convert to BaseUserModel for storage/DTOs
  toBaseUserModel(): BaseUserModel {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      tel: this.phone,
      avatar: this.avatar,
    };
  }

  // Create User from BaseUserModel
  static fromBaseUserModel(model: BaseUserModel): User {
    return new User(model.id, model.name, model.email, model.tel, model.avatar);
  }
}
