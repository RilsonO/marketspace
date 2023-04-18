import { UserDTO } from '@dtos/UserDTO';
import { IPhoto } from './IPhoto';
import { IPaymentMethods } from './IPaymentMethods';

export interface IProduct {
  id?: string;
  name: string;
  description: string;
  is_new: boolean;
  price: number;
  accept_trade: boolean;
  payment_methods: IPaymentMethods[];
  product_images: IPhoto[];
  is_active?: boolean;
  user: UserDTO;
}
