import { SignInRequestDTO, SignInResponseDTO } from '@dtos/sign-in-DTOs';
import { client } from './client';
import { UpdateProfileResponseDTO } from '@dtos/update-profile-DTOs';

export async function signIn({ email, password }: SignInRequestDTO) {
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

export async function updateProfile() {
  try {
    const { data } = await client.get<UpdateProfileResponseDTO>('/users/me');

    return data;
  } catch (error) {
    throw error;
  }
}
