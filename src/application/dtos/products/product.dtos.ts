import { PaymentMethodsDTO, ProductImageDTO } from '../common.dtos';
import { IPhoto } from '../../../shared/types/interfaces/photo.interface';

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

export interface ProductsRequestDTO {
  filter: string;
}

export interface ProductRequestDTO {
  id: string;
}

export interface ProductToggleDisableRequestDTO {
  id: string;
  is_active: boolean;
}

export interface ProductCreateRequestDTO {
  name: string;
  description: string;
  is_new: boolean;
  price: number;
  accept_trade: boolean;
  payment_methods: string[];
}

export interface ProductCreateResponseDTO {
  id: string;
  name: string;
  description: string;
  is_new: boolean;
  price: number;
  accept_trade: boolean;
  user_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductUpdateRequestDTO extends ProductCreateRequestDTO {
  id: string;
}

export interface ProductInsertImagesRequestDTO {
  product_id: string;
  product_images: IPhoto[];
}

export interface ProductInsertImagesResponseDTO {
  id: string;
  product_images: IPhoto[];
}

export interface ProductDeleteImagesRequestDTO {
  productImagesIds: string[];
}
