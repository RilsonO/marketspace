import { SignInRequestDTO, SignInResponseDTO } from '@dtos/sign-in.dtos';
import { client } from '../client.http';
import { UpdateProfileResponseDTO } from '@dtos/update-profile.dtos';
import { UserProductResponseDTO } from '@dtos/product.dtos';
import { SignUpRequestDTO } from '@dtos/sign-up.dtos';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData.append('avatar', photo as any);
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
