import { IUserProduct } from 'src/interfaces/user-product.interface';

export interface BaseUserModel {
  id: string;
  avatar: string;
  name: string;
  email: string;
  tel: string;
}

export interface UserModel extends BaseUserModel {
  products: IUserProduct[];
  fetchProducts: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: () => Promise<void>;
}
