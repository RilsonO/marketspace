import { IProduct } from '../../shared/types/interfaces/product.interface';
import uuid from 'react-native-uuid';
import { PhotoMap } from './photo.map';
import { PaymentMethodsMap } from './payment-methods.map';
import { PaymentMethod } from '../../entities/Product';
import {
  ProductDTO,
  UserProductResponseDTO,
} from '../../application/dtos/products/product.dtos';
import { IUserProduct } from '../../shared/types/interfaces/user-product.interface';
import { BaseUserModel } from '../../entities/User';
import { Product } from '../../entities/Product';

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
      payment_methods: payment_methods.map((item) => item.key as PaymentMethod),
      product_images: product_images.map((item) => PhotoMap.toIPhoto(item)),
      user: user as BaseUserModel,
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
      payment_methods: payment_methods.map((item) => item.key as PaymentMethod),
      product_images: product_images.map((item) => PhotoMap.toIPhoto(item)),
    };
  }

  static toProduct({
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
  }: ProductDTO): Product {
    return new Product(
      id || '',
      name || '',
      description || 'Sem descrição',
      price || 0,
      is_new || false,
      accept_trade || false,
      PaymentMethodsMap.fromPaymentMethodsDTOArrayToPaymentMethodArray(
        payment_methods || []
      ),
      product_images?.map((img) => ({ id: img.id, path: img.path })) || [],
      user_id || '',
      is_active
    );
  }
}

export { ProductMap };
