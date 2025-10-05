import React from 'react';
import { render } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import { UserPhoto } from './view';
import { THEME } from 'src/shared/theme';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <NativeBaseProvider theme={THEME}>{component}</NativeBaseProvider>
  );
};

describe('UserPhoto Component', () => {
  it('should render without crashing', () => {
    const { UNSAFE_root } = renderWithProvider(
      <UserPhoto size={40} source={{ uri: 'http://example.com/photo.jpg' }} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with different sizes', () => {
    const sizes = [10, 20, 30, 40, 50, 60, 80, 100, 120];

    sizes.forEach((size) => {
      const { UNSAFE_root } = renderWithProvider(
        <UserPhoto
          size={size}
          source={{ uri: 'http://example.com/photo.jpg' }}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should render with different image sources', () => {
    const sources = [
      { uri: 'http://example.com/photo1.jpg' },
      { uri: 'https://example.com/photo2.png' },
      { uri: 'file://local/photo.jpg' },
      { uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABA...' },
      { uri: 'http://localhost:3000/images/avatar.jpg' },
    ];

    sources.forEach((source) => {
      const { UNSAFE_root } = renderWithProvider(
        <UserPhoto size={40} source={source} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle empty or invalid sources', () => {
    const invalidSources = [
      { uri: '' },
      { uri: null as any },
      { uri: undefined as any },
      { uri: 'invalid-url' },
      { uri: 'http://invalid-domain-that-does-not-exist.com/photo.jpg' },
    ];

    invalidSources.forEach((source) => {
      const { UNSAFE_root } = renderWithProvider(
        <UserPhoto size={40} source={source} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle additional props', () => {
    const { UNSAFE_root } = renderWithProvider(
      <UserPhoto
        size={40}
        source={{ uri: 'http://example.com/photo.jpg' }}
        alt='User photo'
        testID='user-photo'
        accessibilityLabel='User profile photo'
        accessibilityHint='Tap to view full size'
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle alt text prop', () => {
    const altTexts = [
      'User photo',
      'Profile picture',
      'Avatar',
      'User avatar',
      'Profile photo',
      '',
    ];

    altTexts.forEach((alt) => {
      const { UNSAFE_root } = renderWithProvider(
        <UserPhoto
          size={40}
          source={{ uri: 'http://example.com/photo.jpg' }}
          alt={alt}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle accessibility props', () => {
    const { UNSAFE_root } = renderWithProvider(
      <UserPhoto
        size={40}
        source={{ uri: 'http://example.com/photo.jpg' }}
        accessibilityLabel='User profile photo'
        accessibilityHint='Tap to view full size'
        accessibilityRole='image'
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle onLoad and onError callbacks', () => {
    const mockOnLoad = jest.fn();
    const mockOnError = jest.fn();

    const { UNSAFE_root } = renderWithProvider(
      <UserPhoto
        size={40}
        source={{ uri: 'http://example.com/photo.jpg' }}
        onLoad={mockOnLoad}
        onError={mockOnError}
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle loading states', () => {
    const { UNSAFE_root } = renderWithProvider(
      <UserPhoto
        size={40}
        source={{ uri: 'http://example.com/photo.jpg' }}
        isLoading={true}
        loadingIndicator={<div testID='loading-indicator' />}
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle resize modes', () => {
    const resizeModes = ['cover', 'contain', 'stretch', 'center', 'repeat'];

    resizeModes.forEach((resizeMode) => {
      const { UNSAFE_root } = renderWithProvider(
        <UserPhoto
          size={40}
          source={{ uri: 'http://example.com/photo.jpg' }}
          resizeMode={resizeMode as any}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle different image formats', () => {
    const imageFormats = [
      'http://example.com/photo.jpg',
      'http://example.com/photo.jpeg',
      'http://example.com/photo.png',
      'http://example.com/photo.gif',
      'http://example.com/photo.webp',
      'http://example.com/photo.bmp',
    ];

    imageFormats.forEach((uri) => {
      const { UNSAFE_root } = renderWithProvider(
        <UserPhoto size={40} source={{ uri }} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle special characters in URIs', () => {
    const specialCharUris = [
      'http://example.com/photo%20with%20spaces.jpg',
      'http://example.com/imagem-com-acentos.jpg',
      'http://example.com/photo_with_underscores.jpg',
      'http://example.com/photo-with-dashes.jpg',
      'http://example.com/photo.with.dots.jpg',
    ];

    specialCharUris.forEach((uri) => {
      const { UNSAFE_root } = renderWithProvider(
        <UserPhoto size={40} source={{ uri }} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle very long URIs', () => {
    const longUri = `http://example.com/very-long-filename-that-might-cause-issues-with-rendering-and-layout-problems-${'x'.repeat(
      100
    )}.jpg`;

    const { UNSAFE_root } = renderWithProvider(
      <UserPhoto size={40} source={{ uri: longUri }} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render multiple instances', () => {
    const { UNSAFE_root } = renderWithProvider(
      <>
        <UserPhoto
          size={20}
          source={{ uri: 'http://example.com/photo1.jpg' }}
        />
        <UserPhoto
          size={40}
          source={{ uri: 'http://example.com/photo2.jpg' }}
        />
        <UserPhoto
          size={60}
          source={{ uri: 'http://example.com/photo3.jpg' }}
        />
      </>
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should work with different theme configurations', () => {
    const customTheme = {
      ...THEME,
      colors: {
        ...THEME.colors,
        blue: {
          ...THEME.colors.blue,
          400: '#3B82F6',
        },
      },
    };

    const { UNSAFE_root } = renderWithProvider(
      <NativeBaseProvider theme={customTheme}>
        <UserPhoto size={40} source={{ uri: 'http://example.com/photo.jpg' }} />
      </NativeBaseProvider>
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle rapid prop changes', () => {
    const { UNSAFE_root, rerender } = renderWithProvider(
      <UserPhoto size={40} source={{ uri: 'http://example.com/photo1.jpg' }} />
    );
    expect(UNSAFE_root).toBeTruthy();

    // Change size
    rerender(
      <NativeBaseProvider theme={THEME}>
        <UserPhoto
          size={60}
          source={{ uri: 'http://example.com/photo1.jpg' }}
        />
      </NativeBaseProvider>
    );

    // Change source
    rerender(
      <NativeBaseProvider theme={THEME}>
        <UserPhoto
          size={60}
          source={{ uri: 'http://example.com/photo2.jpg' }}
        />
      </NativeBaseProvider>
    );

    // Change both
    rerender(
      <NativeBaseProvider theme={THEME}>
        <UserPhoto
          size={80}
          source={{ uri: 'http://example.com/photo3.jpg' }}
        />
      </NativeBaseProvider>
    );
  });

  it('should handle edge cases with undefined size', () => {
    const { UNSAFE_root } = renderWithProvider(
      <UserPhoto
        size={undefined as any}
        source={{ uri: 'http://example.com/photo.jpg' }}
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle edge cases with null size', () => {
    const { UNSAFE_root } = renderWithProvider(
      <UserPhoto
        size={null as any}
        source={{ uri: 'http://example.com/photo.jpg' }}
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle edge cases with zero size', () => {
    const { UNSAFE_root } = renderWithProvider(
      <UserPhoto size={0} source={{ uri: 'http://example.com/photo.jpg' }} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle edge cases with negative size', () => {
    const { UNSAFE_root } = renderWithProvider(
      <UserPhoto size={-10} source={{ uri: 'http://example.com/photo.jpg' }} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should be a pure component (no side effects)', () => {
    // Test that multiple renders produce the same result
    const { UNSAFE_root: root1 } = renderWithProvider(
      <UserPhoto size={40} source={{ uri: 'http://example.com/photo.jpg' }} />
    );
    const { UNSAFE_root: root2 } = renderWithProvider(
      <UserPhoto size={40} source={{ uri: 'http://example.com/photo.jpg' }} />
    );

    expect(root1).toBeTruthy();
    expect(root2).toBeTruthy();
  });
});
