export interface UserModel {
  id: string;
  avatar: string;
  name: string;
  email: string;
  tel: string;
  signOut: () => Promise<void>;
  updateProfile: () => Promise<void>;
}
