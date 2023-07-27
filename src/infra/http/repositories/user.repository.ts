import { SignInRequestDTO, SignInResponseDTO } from '@dtos/sign-in.dtos';
import { client } from '../client.http';
import { UpdateProfileResponseDTO } from '@dtos/update-profile.dtos';
import { UserProductResponseDTO } from '@dtos/product.dtos';

async function signIn({ email, password }: SignInRequestDTO) {
  try {
    const { data } = await client.post<SignInResponseDTO>('/sessions', {
      email,
      password,
    });
    return data;
  } catch (error) {
    throw error;
  }
}

async function updateProfile() {
  try {
    const { data } = await client.get<UpdateProfileResponseDTO>('/users/me');
    return data;
  } catch (error) {
    throw error;
  }
}

async function fetchProducts() {
  try {
    const { data } = await client.get<UserProductResponseDTO[]>(
      '/users/products'
    );
    return data;
  } catch (error) {
    throw error;
  }
}

export { signIn, updateProfile, fetchProducts };
