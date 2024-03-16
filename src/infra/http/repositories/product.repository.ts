import { client } from '../client.http';
import {
  ProductCreateRequestDTO,
  ProductCreateResponseDTO,
  ProductDTO,
  ProductDeleteImagesRequestDTO,
  ProductDetailDTO,
  ProductInsertImagesRequestDTO,
  ProductInsertImagesResponseDTO,
  ProductRequestDTO,
  ProductToggleDisableRequestDTO,
  ProductUpdateRequestDTO,
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

async function productCreate(body: ProductCreateRequestDTO) {
  return await client.post<ProductCreateResponseDTO>(`/products`, body);
}

async function productUpdate({ id, ...body }: ProductUpdateRequestDTO) {
  return await client.put(`/products/${id}`, { ...body });
}

async function productInsertImages({
  product_id,
  product_images,
}: ProductInsertImagesRequestDTO) {
  const formData = new FormData();
  formData.append('product_id', product_id);
  product_images.map((photo) => {
    if (photo.uri) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formData.append('images', photo as any);
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

async function productDeleteImagesById({
  productImagesIds,
}: ProductDeleteImagesRequestDTO) {
  return await client.delete(`/products/images`, {
    data: { productImagesIds },
  });
}
export {
  fetchProducts,
  fetchProductById,
  productToggleDisableById,
  productDeleteById,
  productCreate,
  productInsertImages,
  productDeleteImagesById,
  productUpdate,
};
