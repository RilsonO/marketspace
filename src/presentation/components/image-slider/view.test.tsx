import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import { ImageSlider } from './view';
import { IPhoto } from 'src/shared/types/interfaces/photo.interface';
import { THEME } from 'src/shared/theme';

// Mock dos componentes filhos
jest.mock('../image-indicator/view', () => ({
  ImageIndicator: ({ active, width }: { active: boolean; width: number }) => (
    <div testID='image-indicator' data-active={active} data-width={width} />
  ),
}));

const mockImages: IPhoto[] = [
  { uri: 'http://localhost:3000/images/image1.jpg', id: '1' },
  { uri: 'http://localhost:3000/images/image2.jpg', id: '2' },
  { uri: 'http://localhost:3000/images/image3.jpg', id: '3' },
];

const singleImage: IPhoto[] = [
  { uri: 'http://localhost:3000/images/single.jpg', id: '1' },
];

const emptyImages: IPhoto[] = [];

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <NativeBaseProvider theme={THEME}>{component}</NativeBaseProvider>
  );
};

describe('ImageSlider Component', () => {
  it('should render without crashing', () => {
    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={mockImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with single image', () => {
    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={singleImage} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with empty images array', () => {
    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={emptyImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render when disabled is true', () => {
    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={mockImages} disabled={true} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render when disabled is false', () => {
    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={mockImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle multiple images correctly', () => {
    const multipleImages: IPhoto[] = [
      { uri: 'http://localhost:3000/images/image1.jpg', id: '1' },
      { uri: 'http://localhost:3000/images/image2.jpg', id: '2' },
      { uri: 'http://localhost:3000/images/image3.jpg', id: '3' },
      { uri: 'http://localhost:3000/images/image4.jpg', id: '4' },
      { uri: 'http://localhost:3000/images/image5.jpg', id: '5' },
    ];

    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={multipleImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle images with different URI formats', () => {
    const differentUriImages: IPhoto[] = [
      { uri: 'https://example.com/image1.jpg', id: '1' },
      { uri: 'file://local/image2.jpg', id: '2' },
      { uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABA...', id: '3' },
    ];

    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={differentUriImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle images with special characters in URI', () => {
    const specialCharImages: IPhoto[] = [
      {
        uri: 'http://localhost:3000/images/image%20with%20spaces.jpg',
        id: '1',
      },
      { uri: 'http://localhost:3000/images/imagem-com-acentos.jpg', id: '2' },
      {
        uri: 'http://localhost:3000/images/image_with_underscores.jpg',
        id: '3',
      },
    ];

    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={specialCharImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle images with very long URIs', () => {
    const longUriImages: IPhoto[] = [
      {
        uri: 'http://localhost:3000/images/very-long-filename-that-might-cause-issues-with-rendering-and-layout-problems.jpg',
        id: '1',
      },
    ];

    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={longUriImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle disabled state with empty images', () => {
    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={emptyImages} disabled={true} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle disabled state with images', () => {
    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={mockImages} disabled={true} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle enabled state with empty images', () => {
    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={emptyImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle enabled state with images', () => {
    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={mockImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle images with numeric IDs', () => {
    const numericIdImages: IPhoto[] = [
      { uri: 'http://localhost:3000/images/image1.jpg', id: '1' },
      { uri: 'http://localhost:3000/images/image2.jpg', id: '2' },
      { uri: 'http://localhost:3000/images/image3.jpg', id: '3' },
    ];

    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={numericIdImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle images with string IDs', () => {
    const stringIdImages: IPhoto[] = [
      { uri: 'http://localhost:3000/images/image1.jpg', id: 'image-1' },
      { uri: 'http://localhost:3000/images/image2.jpg', id: 'image-2' },
      { uri: 'http://localhost:3000/images/image3.jpg', id: 'image-3' },
    ];

    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={stringIdImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle images with UUID IDs', () => {
    const uuidIdImages: IPhoto[] = [
      {
        uri: 'http://localhost:3000/images/image1.jpg',
        id: '550e8400-e29b-41d4-a716-446655440000',
      },
      {
        uri: 'http://localhost:3000/images/image2.jpg',
        id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      },
    ];

    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={uuidIdImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle edge case with undefined disabled prop', () => {
    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={mockImages} disabled={undefined as any} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle edge case with null images array', () => {
    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={null as any} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle edge case with undefined images array', () => {
    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={undefined as any} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle images with missing URI', () => {
    const missingUriImages: IPhoto[] = [
      { uri: '', id: '1' },
      { uri: null as any, id: '2' },
      { uri: undefined as any, id: '3' },
    ];

    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={missingUriImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle images with missing ID', () => {
    const missingIdImages: IPhoto[] = [
      { uri: 'http://localhost:3000/images/image1.jpg', id: '' },
      { uri: 'http://localhost:3000/images/image2.jpg', id: null as any },
      { uri: 'http://localhost:3000/images/image3.jpg', id: undefined as any },
    ];

    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={missingIdImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle mixed valid and invalid images', () => {
    const mixedImages: IPhoto[] = [
      { uri: 'http://localhost:3000/images/image1.jpg', id: '1' },
      { uri: '', id: '2' },
      { uri: 'http://localhost:3000/images/image3.jpg', id: '' },
      { uri: null as any, id: null as any },
    ];

    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={mixedImages} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle large number of images', () => {
    const largeImagesArray: IPhoto[] = Array.from(
      { length: 20 },
      (_, index) => ({
        uri: `http://localhost:3000/images/image${index + 1}.jpg`,
        id: `image-${index + 1}`,
      })
    );

    const { UNSAFE_root } = renderWithProvider(
      <ImageSlider imagesUrl={largeImagesArray} disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });
});
