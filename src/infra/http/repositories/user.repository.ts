import { SignInRequestDTO, SignInResponseDTO } from '@dtos/sign-in.dtos';
import { client } from '../client.http';
import { UpdateProfileResponseDTO } from '@dtos/update-profile.dtos';
import { UserProductResponseDTO } from '@dtos/product.dtos';

async function signIn({ email, password }: SignInRequestDTO) {
  const { data } = await client.post<SignInResponseDTO>('/sessions', {
    email,
    password,
  });
  return data;
}

async function updateProfile() {
  const { data } = await client.get<UpdateProfileResponseDTO>('/users/me');
  return data;
}

async function fetchProducts() {
  const { data } = await client.get<UserProductResponseDTO[]>(
    '/users/products'
  );
  return data;
}

export { signIn, updateProfile, fetchProducts };
