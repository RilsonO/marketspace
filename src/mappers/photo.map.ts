import { ProductImageDTO } from '@dtos/common.dtos';
import { client } from '@infra/http/client.http';
import { IPhoto } from 'src/interfaces/photo.interface';

class PhotoMap {
  static toIPhoto({ id, path }: ProductImageDTO): IPhoto {
    return {
      name: id,
      uri: `${client.defaults.baseURL}/images/${path}`,
      type: 'image',
    };
  }
}

export { PhotoMap };
