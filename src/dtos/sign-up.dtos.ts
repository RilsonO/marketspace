import { IPhoto } from 'src/interfaces/photo.interface';

export interface SignUpRequestDTO {
  name: string;
  phone: string;
  email: string;
  password: string;
  photo: IPhoto;
}
