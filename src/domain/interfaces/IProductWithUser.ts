export interface IProductWithUser {
  id: string;
  name: string;
  description: string;
  price: number;
  isNew: boolean;
  acceptTrade: boolean;
  paymentMethods: string[];
  images: Array<{ id: string; path: string }>;
  userId: string;
  isActive: boolean;
  userAvatar: string;
}
