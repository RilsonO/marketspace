import { User } from '../../entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import {
  storageUserGet,
  storageUserSave,
  storageUserRemove,
} from '../storage/user.storage';

export class UserRepositoryImpl implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const storedUser = await storageUserGet();
      if (!storedUser || storedUser.email !== email) {
        return null;
      }

      return new User(
        storedUser.id,
        storedUser.name,
        storedUser.email,
        storedUser.tel,
        storedUser.avatar
      );
    } catch {
      return null;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const storedUser = await storageUserGet();
      if (!storedUser || storedUser.id !== id) {
        return null;
      }

      return new User(
        storedUser.id,
        storedUser.name,
        storedUser.email,
        storedUser.tel,
        storedUser.avatar
      );
    } catch {
      return null;
    }
  }

  async save(user: User): Promise<void> {
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      tel: user.phone,
      avatar: user.avatar,
    };

    await storageUserSave(userData);
  }

  async update(user: User): Promise<void> {
    await this.save(user);
  }

  async findStored(): Promise<User | null> {
    try {
      const storedUser = await storageUserGet();
      if (!storedUser) {
        return null;
      }

      return new User(
        storedUser.id,
        storedUser.name,
        storedUser.email,
        storedUser.tel,
        storedUser.avatar
      );
    } catch {
      return null;
    }
  }

  async delete(): Promise<void> {
    await storageUserRemove();
  }
}
