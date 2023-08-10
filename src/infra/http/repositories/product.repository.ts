import { client } from '../client.http';
import { ProductDTO, ProductsRequestDTO } from '@dtos/product.dtos';

async function fetchProducts({ filter }: ProductsRequestDTO) {
  const { data } = await client.get<ProductDTO[]>(`/products${filter}`);
  return data;
}

export { fetchProducts };
