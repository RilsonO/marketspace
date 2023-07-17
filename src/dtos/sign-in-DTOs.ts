export interface SignInRequestDTO {
  email: string;
  password: string;
}

export interface SignInResponseDTO {
  user: {
    id: string;
    avatar: string;
    name: string;
    email: string;
    tel: string;
  };
  token: string;
  refresh_token: string;
}
