import { IProduct } from 'src/interfaces/product.interface';
import uuid from 'react-native-uuid';
import { PhotoMap } from './photo.map';
import { PaymentMethodsMap } from './payment-methods.map';
import { ProductDTO, UserProductResponseDTO } from '@dtos/product.dtos';
import { IUserProduct } from 'src/interfaces/user-product.interface';

class ProductMap {
  static toIProduct({
    id,
    name,
    description,
    is_new,
    price,
    accept_trade,
    payment_methods,
    product_images,
    user,
    user_id,
    is_active,
  }: ProductDTO): IProduct {
    return {
      id: id ?? String(uuid.v4()),
      user_id: user_id ?? String(uuid.v4()),
      name,
      description,
      is_new,
      is_active,
      price,
      accept_trade,
      payment_methods: payment_methods.map((item) =>
        PaymentMethodsMap.toIPaymentMethods(item)
      ),
      product_images: product_images.map((item) => PhotoMap.toIPhoto(item)),
      user,
    };
  }

  static toIUserProduct({
    id,
    name,
    description,
    is_new,
    price,
    accept_trade,
    payment_methods,
    product_images,
    user_id,
    is_active,
  }: UserProductResponseDTO): IUserProduct {
    return {
      id,
      user_id,
      name,
      description,
      is_new,
      is_active,
      price,
      accept_trade,
      payment_methods: payment_methods.map((item) =>
        PaymentMethodsMap.toIPaymentMethods(item)
      ),
      product_images: product_images.map((item) => PhotoMap.toIPhoto(item)),
    };
  }
}

export { ProductMap };
