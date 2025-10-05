import { client } from '../client.http';
import {
  ProductCreateRequestDTO,
  ProductCreateResponseDTO,
  ProductDeleteImagesRequestDTO,
  ProductDTO,
  ProductInsertImagesRequestDTO,
  ProductInsertImagesResponseDTO,
  ProductRequestDTO,
  ProductsRequestDTO,
  ProductToggleDisableRequestDTO,
  ProductUpdateRequestDTO,
} from '../../../application/dtos/products/product.dtos';
import { PhotoMap } from '../../mappers/photo.map';

export async function fetchProducts({ filter }: ProductsRequestDTO) {
  const { data } = await client.get<ProductDTO[]>(`/products${filter}`);
  return data;
}

export async function fetchUserProducts() {
  const { data } = await client.get<ProductDTO[]>(`/users/products`);
  return data;
}

export async function productDeleteById({ id }: ProductRequestDTO) {
  return await client.delete<Promise<void>>(`/products/${id}`);
}

export async function productCreate(body: ProductCreateRequestDTO) {
  return await client.post<ProductCreateResponseDTO>(`/products`, body);
}

export async function productUpdate({ id, ...body }: ProductUpdateRequestDTO) {
  return await client.put(`/products/${id}`, { ...body });
}

export async function productToggleDisableById({
  id,
  is_active,
}: ProductToggleDisableRequestDTO) {
  return await client.patch<Promise<void>>(`/products/${id}`, { is_active });
}

export async function productInsertImages({
  product_id,
  product_images,
}: ProductInsertImagesRequestDTO) {
  const formData = new FormData();
  formData.append('product_id', product_id);
  product_images.map((photo) => {
    if (photo.uri) {
      const formDataEntry = PhotoMap.toFormDataEntry(photo);
      formData.append('images', formDataEntry);
    }
  });

  return await client.post<ProductInsertImagesResponseDTO>(
    `/products/images`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

export async function productDeleteImagesById({
  productImagesIds,
}: ProductDeleteImagesRequestDTO) {
  return await client.delete(`/products/images`, {
    data: { productImagesIds },
  });
}
