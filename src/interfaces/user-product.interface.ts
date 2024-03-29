import { IPhoto } from './photo.interface';
import { IPaymentMethods } from './payment-methods.interface';

export interface IUserProduct {
  id?: string;
  name: string;
  description: string;
  is_new: boolean;
  price: number;
  accept_trade: boolean;
  payment_methods: IPaymentMethods[];
  product_images: IPhoto[];
  is_active?: boolean;
  user_id?: string;
}
