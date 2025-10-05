import { ProductImageDTO } from '../../application/dtos/common.dtos';
import { client } from '../http/client.http';
import { IPhoto } from '../../shared/types/interfaces/photo.interface';

type ReactNativeFile = File & {
  uri: string;
};

class PhotoMap {
  static toIPhoto({ id, path }: ProductImageDTO): IPhoto {
    return {
      name: id,
      uri: `${client.defaults.baseURL}/images/${path}`,
      type: 'image',
    };
  }

  static toFormDataEntry(photo: IPhoto): ReactNativeFile {
    // Ensure type is correct for React Native FormData
    const correctedType = photo.type === 'image' ? 'image/jpeg' : photo.type;

    // Create a File object from the URI for React Native
    const file = new File([], photo.name, {
      type: correctedType,
    }) as ReactNativeFile;

    // Add React Native specific properties
    file.uri = photo.uri;

    return file;
  }
}

export { PhotoMap };
