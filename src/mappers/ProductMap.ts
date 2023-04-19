import { ProductDTO } from '@dtos/ProductDTO';
import { api } from '@services/api';
import { IProduct } from 'src/interfaces/IProduct';
import uuid from 'react-native-uuid';
import { PhotoMap } from './PhotoMap';
import { PaymentMethodsMap } from './PaymentMethodsMap';

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
  }: ProductDTO): IProduct {
    return {
      id: id ?? String(uuid.v4()),
      user_id: user_id ?? String(uuid.v4()),
      name,
      description,
      is_new,
      price,
      accept_trade,
      payment_methods: payment_methods.map((item) =>
        PaymentMethodsMap.toIPaymentMethods(item)
      ),
      product_images: product_images.map((item) => PhotoMap.toIPhoto(item)),
      user,
    };
  }
}

export { ProductMap };
