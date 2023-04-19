import { PaymentMethodsDTO } from './PaymentMethodsDTO';
import { ProductImageDTO } from './ProductImageDTO';
import { UserDTO } from './UserDTO';

export type ProductDTO = {
  id: string;
  user_id?: string;
  name: string;
  description: string;
  is_new: boolean;
  price: number;
  accept_trade: boolean;
  payment_methods: PaymentMethodsDTO[];
  product_images: ProductImageDTO[];
  user: UserDTO;
};
