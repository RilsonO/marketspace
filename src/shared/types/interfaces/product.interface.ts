import { UpdateProfileResponseDTO } from '../../../application/dtos/user/update-profile.dtos';
import { IPhoto } from './photo.interface';
import { PaymentMethod } from '../../../entities/Product';

export interface IProduct {
  id?: string;
  name: string;
  description: string;
  is_new: boolean;
  price: number;
  accept_trade: boolean;
  payment_methods: PaymentMethod[];
  product_images: IPhoto[];
  is_active?: boolean;
  user_id?: string;
  user: UpdateProfileResponseDTO;
}
