import { IPhoto } from './photo.interface';
import { PaymentMethod } from '../../../entities/Product';

export interface IUserProduct {
  id: string;
  user_id: string;
  name: string;
  description: string;
  is_new: boolean;
  is_active?: boolean;
  price: number;
  accept_trade: boolean;
  payment_methods: PaymentMethod[];
  product_images: IPhoto[];
}
