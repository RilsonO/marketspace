import { PhotoMap } from './photo.map';
import { ProductImageDTO } from '../../application/dtos/common.dtos';
import { IPhoto } from '../../shared/types/interfaces/photo.interface';

// Mock do client HTTP
jest.mock('../http/client.http', () => ({
  client: {
    defaults: {
      baseURL: 'https://api.example.com',
    },
  },
}));

// Mock do File constructor para React Native
global.File = class File {
  public name: string;
  public type: string;
  public uri?: string;

  constructor(public content: any[], name: string, public options: any) {
    this.name = name;
    this.type = options?.type || '';
  }
} as any;

describe('PhotoMap', () => {
  describe('toIPhoto', () => {
    it('should convert ProductImageDTO to IPhoto with correct URL', () => {
      const productImageDTO: ProductImageDTO = {
        id: 'image-123',
        path: 'products/image-123.jpg',
      };

      const result = PhotoMap.toIPhoto(productImageDTO);

      expect(result).toEqual({
        name: 'image-123',
        uri: 'https://api.example.com/images/products/image-123.jpg',
        type: 'image',
      });
    });

    it('should handle different image paths', () => {
      const testCases = [
        {
          input: { id: 'img1', path: 'users/avatar.jpg' },
          expectedUri: 'https://api.example.com/images/users/avatar.jpg',
        },
        {
          input: { id: 'img2', path: 'products/photo.png' },
          expectedUri: 'https://api.example.com/images/products/photo.png',
        },
        {
          input: { id: 'img3', path: 'uploads/image.jpeg' },
          expectedUri: 'https://api.example.com/images/uploads/image.jpeg',
        },
      ];

      testCases.forEach(({ input, expectedUri }) => {
        const result = PhotoMap.toIPhoto(input);
        expect(result.uri).toBe(expectedUri);
        expect(result.name).toBe(input.id);
        expect(result.type).toBe('image');
      });
    });

    it('should handle special characters in path', () => {
      const productImageDTO: ProductImageDTO = {
        id: 'image-with-special-chars',
        path: 'products/2023/image with spaces.jpg',
      };

      const result = PhotoMap.toIPhoto(productImageDTO);

      expect(result.uri).toBe(
        'https://api.example.com/images/products/2023/image with spaces.jpg'
      );
    });

    it('should handle empty path', () => {
      const productImageDTO: ProductImageDTO = {
        id: 'empty-path',
        path: '',
      };

      const result = PhotoMap.toIPhoto(productImageDTO);

      expect(result.uri).toBe('https://api.example.com/images/');
    });
  });

  describe('toFormDataEntry', () => {
    it('should convert IPhoto to ReactNativeFile with correct type', () => {
      const photo: IPhoto = {
        name: 'test-image.jpg',
        uri: 'file:///path/to/image.jpg',
        type: 'image',
      };

      const result = PhotoMap.toFormDataEntry(photo);

      expect(result).toBeInstanceOf(File);
      expect(result.name).toBe('test-image.jpg');
      expect(result.type).toBe('image/jpeg');
      expect(result.uri).toBe('file:///path/to/image.jpg');
    });

    it('should handle different image types', () => {
      const testCases = [
        {
          input: { name: 'test.jpg', uri: 'file:///test.jpg', type: 'image' },
          expectedType: 'image/jpeg',
        },
        {
          input: {
            name: 'test.png',
            uri: 'file:///test.png',
            type: 'image/png',
          },
          expectedType: 'image/png',
        },
        {
          input: {
            name: 'test.gif',
            uri: 'file:///test.gif',
            type: 'image/gif',
          },
          expectedType: 'image/gif',
        },
        {
          input: {
            name: 'test.webp',
            uri: 'file:///test.webp',
            type: 'image/webp',
          },
          expectedType: 'image/webp',
        },
      ];

      testCases.forEach(({ input, expectedType }) => {
        const result = PhotoMap.toFormDataEntry(input);
        expect(result.type).toBe(expectedType);
        expect(result.name).toBe(input.name);
        expect(result.uri).toBe(input.uri);
      });
    });

    it('should preserve non-image types', () => {
      const photo: IPhoto = {
        name: 'document.pdf',
        uri: 'file:///path/to/document.pdf',
        type: 'application/pdf',
      };

      const result = PhotoMap.toFormDataEntry(photo);

      expect(result.type).toBe('application/pdf');
      expect(result.name).toBe('document.pdf');
      expect(result.uri).toBe('file:///path/to/document.pdf');
    });

    it('should handle special characters in name', () => {
      const photo: IPhoto = {
        name: 'image with spaces & special chars.jpg',
        uri: 'file:///path/to/image.jpg',
        type: 'image',
      };

      const result = PhotoMap.toFormDataEntry(photo);

      expect(result.name).toBe('image with spaces & special chars.jpg');
      expect(result.type).toBe('image/jpeg');
      expect(result.uri).toBe('file:///path/to/image.jpg');
    });

    it('should handle empty name', () => {
      const photo: IPhoto = {
        name: '',
        uri: 'file:///path/to/image.jpg',
        type: 'image',
      };

      const result = PhotoMap.toFormDataEntry(photo);

      expect(result.name).toBe('');
      expect(result.type).toBe('image/jpeg');
      expect(result.uri).toBe('file:///path/to/image.jpg');
    });

    it('should handle different URI formats', () => {
      const testCases = [
        'file:///local/path/image.jpg',
        'content://media/external/images/media/123',
        'assets-library://asset/asset.JPG?id=123',
        'ph://local-identifier',
      ];

      testCases.forEach((uri) => {
        const photo: IPhoto = {
          name: 'test.jpg',
          uri,
          type: 'image',
        };

        const result = PhotoMap.toFormDataEntry(photo);

        expect(result.uri).toBe(uri);
        expect(result.type).toBe('image/jpeg');
        expect(result.name).toBe('test.jpg');
      });
    });
  });

  describe('Round-trip conversion', () => {
    it('should maintain data integrity through round-trip conversion', () => {
      const originalDTO: ProductImageDTO = {
        id: 'test-image',
        path: 'products/test-image.jpg',
      };

      const iPhoto = PhotoMap.toIPhoto(originalDTO);
      const formDataEntry = PhotoMap.toFormDataEntry(iPhoto);

      expect(formDataEntry.name).toBe(originalDTO.id);
      expect(formDataEntry.uri).toBe(iPhoto.uri);
      expect(formDataEntry.type).toBe('image/jpeg');
    });

    it('should handle complex image data', () => {
      const originalDTO: ProductImageDTO = {
        id: 'complex-image-123',
        path: 'products/2023/complex image with spaces & symbols.jpg',
      };

      const iPhoto = PhotoMap.toIPhoto(originalDTO);
      const formDataEntry = PhotoMap.toFormDataEntry(iPhoto);

      expect(iPhoto.name).toBe('complex-image-123');
      expect(iPhoto.uri).toContain('complex image with spaces & symbols.jpg');
      expect(formDataEntry.name).toBe('complex-image-123');
      expect(formDataEntry.type).toBe('image/jpeg');
    });
  });

  describe('Edge cases', () => {
    it('should handle very long image names', () => {
      const longName = 'a'.repeat(255);
      const photo: IPhoto = {
        name: longName,
        uri: 'file:///path/to/image.jpg',
        type: 'image',
      };

      const result = PhotoMap.toFormDataEntry(photo);

      expect(result.name).toBe(longName);
      expect(result.type).toBe('image/jpeg');
    });

    it('should handle very long URIs', () => {
      const longPath = 'a'.repeat(1000);
      const productImageDTO: ProductImageDTO = {
        id: 'long-path',
        path: longPath,
      };

      const result = PhotoMap.toIPhoto(productImageDTO);

      expect(result.uri).toBe(`https://api.example.com/images/${longPath}`);
      expect(result.name).toBe('long-path');
    });

    it('should handle unicode characters', () => {
      const productImageDTO: ProductImageDTO = {
        id: 'imagem-ção-ñ',
        path: 'products/imagem com acentos.jpg',
      };

      const result = PhotoMap.toIPhoto(productImageDTO);

      expect(result.name).toBe('imagem-ção-ñ');
      expect(result.uri).toBe(
        'https://api.example.com/images/products/imagem com acentos.jpg'
      );
    });
  });
});
