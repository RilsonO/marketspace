import {
  SignInRequestDTO,
  SignInResponseDTO,
} from '../../../application/dtos/auth/sign-in.dtos';
import { client } from '../client.http';
import { UpdateProfileResponseDTO } from '../../../application/dtos/user/update-profile.dtos';
import { UserProductResponseDTO } from '../../../application/dtos/products/product.dtos';
import { SignUpRequestDTO } from '../../../application/dtos/auth/sign-up.dtos';
import { PhotoMap } from '../../mappers/photo.map';

async function signUp({
  name,
  password,
  email,
  phone,
  photo,
}: SignUpRequestDTO) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('tel', phone);
  formData.append('password', password);
  if (photo.uri) {
    formData.append('avatar', PhotoMap.toFormDataEntry(photo));
  }
  await client.post<SignInResponseDTO>('/users', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

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

export { signUp, signIn, updateProfile, fetchProducts };
