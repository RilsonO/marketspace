import { PaymentMethodsDTO } from './PaymentMethodsDTO';
import { ProductImagesDTO } from './ProductImagesDTO';
import { UserDTO } from './UserDTO';

export type ProductDTO = {
  id: string;
  name: string;
  description: string;
  is_new: boolean;
  price: number;
  accept_trade: boolean;
  payment_methods: PaymentMethodsDTO[];
  product_images: ProductImagesDTO[];
  user: UserDTO;
};
