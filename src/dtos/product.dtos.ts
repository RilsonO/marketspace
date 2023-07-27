import { PaymentMethodsDTO, ProductImageDTO } from './common.dtos';

export type UserProductResponseDTO = {
  id: string;
  name: string;
  description: string;
  is_new: boolean;
  price: number;
  accept_trade: boolean;
  user_id: string;
  is_active: boolean;
  product_images: ProductImageDTO[];
  payment_methods: PaymentMethodsDTO[];
  created_at: string;
  updated_at: string;
};

export interface ProductDTO extends UserProductResponseDTO {
  user: {
    avatar: string;
  };
}

export interface ProductDetailDTO extends UserProductResponseDTO {
  user: {
    avatar: string;
    name: string;
    tel: string;
  };
}
