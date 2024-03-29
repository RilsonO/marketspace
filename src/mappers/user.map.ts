import { SignInResponseDTO } from '@dtos/sign-in.dtos';
import { IUserProduct } from 'src/interfaces/user-product.interface';
import { BaseUserModel, UserModel } from 'src/models/user.model';

interface FromBaseUserModelToUserModelProps {
  user: BaseUserModel;
  signOut: () => Promise<void>;
  updateProfile: () => Promise<void>;
  fetchProducts: () => Promise<void>;
}

class UserMap {
  static fromSignInResponseDTOToUserModel(
    { user: { id, avatar, name, email, tel } }: SignInResponseDTO,
    signOut: () => Promise<void>,
    updateProfile: () => Promise<void>,
    fetchProducts: () => Promise<void>
  ): UserModel {
    return {
      id,
      avatar,
      name,
      email,
      tel,
      products: [] as IUserProduct[],
      signOut,
      updateProfile,
      fetchProducts,
    } as UserModel;
  }

  static fromUserModelToBaseUserModel({
    id,
    avatar,
    name,
    email,
    tel,
  }: UserModel): BaseUserModel {
    return {
      id,
      avatar,
      name,
      email,
      tel,
    } as BaseUserModel;
  }

  static fromBaseUserModelToUserModel({
    user,
    signOut,
    updateProfile,
    fetchProducts,
  }: FromBaseUserModelToUserModelProps): UserModel {
    const { id, avatar, name, email, tel } = user;

    return {
      id,
      avatar,
      name,
      email,
      tel,
      products: [] as IUserProduct[],
      signOut,
      updateProfile,
      fetchProducts,
    } as UserModel;
  }
}

export { UserMap };
