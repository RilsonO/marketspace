import { client } from '../client.http';
import {
  ProductDTO,
  ProductDetailDTO,
  ProductRequestDTO,
  ProductToggleDisableRequestDTO,
  ProductsRequestDTO,
} from '@dtos/product.dtos';

async function fetchProducts({ filter }: ProductsRequestDTO) {
  const { data } = await client.get<ProductDTO[]>(`/products${filter}`);
  return data;
}

async function fetchProductById({ id }: ProductRequestDTO) {
  const { data } = await client.get<ProductDetailDTO>(`/products/${id}`);
  return data;
}

async function productDeleteById({ id }: ProductRequestDTO) {
  return await client.delete<Promise<void>>(`/products/${id}`);
}

async function productToggleDisableById({
  id,
  is_active,
}: ProductToggleDisableRequestDTO) {
  return await client.patch<Promise<void>>(`/products/${id}`, { is_active });
}

export {
  fetchProducts,
  fetchProductById,
  productToggleDisableById,
  productDeleteById,
};
