export interface SignInRequestDTO {
  email: string;
  password: string;
}

export interface SignInResponseDTO {
  id: string;
  avatar: string;
  name: string;
  email: string;
  tel: string;
}
