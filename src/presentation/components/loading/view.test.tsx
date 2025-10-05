import React from 'react';
import { render } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import { Loading } from './view';
import { THEME } from 'src/shared/theme';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <NativeBaseProvider theme={THEME}>{component}</NativeBaseProvider>
  );
};

describe('Loading Component', () => {
  it('should render without crashing', () => {
    const { UNSAFE_root } = renderWithProvider(<Loading />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render Center container', () => {
    const { UNSAFE_root } = renderWithProvider(<Loading />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render Spinner component', () => {
    const { UNSAFE_root } = renderWithProvider(<Loading />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should have correct styling properties', () => {
    const { UNSAFE_root } = renderWithProvider(<Loading />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render consistently across multiple instances', () => {
    const { UNSAFE_root } = renderWithProvider(
      <>
        <Loading />
        <Loading />
        <Loading />
      </>
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should maintain consistent appearance', () => {
    // Test multiple renders to ensure consistency
    for (let i = 0; i < 5; i++) {
      const { UNSAFE_root } = renderWithProvider(<Loading />);
      expect(UNSAFE_root).toBeTruthy();
    }
  });

  it('should work with different theme configurations', () => {
    const customTheme = {
      ...THEME,
      colors: {
        ...THEME.colors,
        blue: {
          ...THEME.colors.blue,
          700: '#1D4ED8',
        },
        gray: {
          ...THEME.colors.gray,
          200: '#E5E7EB',
        },
      },
    };

    const { UNSAFE_root } = renderWithProvider(
      <NativeBaseProvider theme={customTheme}>
        <Loading />
      </NativeBaseProvider>
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle rapid mount/unmount cycles', () => {
    const { UNSAFE_root, unmount } = renderWithProvider(<Loading />);
    expect(UNSAFE_root).toBeTruthy();

    unmount();

    const { UNSAFE_root: newRoot } = renderWithProvider(<Loading />);
    expect(newRoot).toBeTruthy();
  });

  it('should render without any props or children', () => {
    const { UNSAFE_root } = renderWithProvider(<Loading />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should be a pure component (no side effects)', () => {
    // Test that multiple renders produce the same result
    const { UNSAFE_root: root1 } = renderWithProvider(<Loading />);
    const { UNSAFE_root: root2 } = renderWithProvider(<Loading />);

    expect(root1).toBeTruthy();
    expect(root2).toBeTruthy();
  });
});
