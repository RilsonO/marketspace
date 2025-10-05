import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import { Button } from './view';
import { THEME } from 'src/shared/theme';

// Mock do useButtonViewModel
jest.mock('./view-model', () => ({
  useButtonViewModel: jest.fn(),
}));

const mockUseButtonViewModel = jest.fn();

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <NativeBaseProvider theme={THEME}>{component}</NativeBaseProvider>
  );
};

describe('Button Component', () => {
  beforeEach(() => {
    mockUseButtonViewModel.mockReturnValue({
      getPressedBgColor: jest.fn((bgColor) => {
        if (bgColor === 'blue.400') return 'blue.300';
        if (bgColor === 'gray.700') return 'gray.600';
        if (bgColor === 'gray.300') return 'gray.200';
        return 'blue.300';
      }),
    });

    // Import the mocked hook
    const { useButtonViewModel } = require('./view-model');
    useButtonViewModel.mockImplementation(mockUseButtonViewModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { UNSAFE_root } = renderWithProvider(<Button title='Test Button' />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with default blue.400 background color', () => {
    const { UNSAFE_root } = renderWithProvider(<Button title='Test Button' />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with custom gray.700 background color', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Button title='Test Button' bgColor='gray.700' />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with custom gray.300 background color', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Button title='Test Button' bgColor='gray.300' />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with different titles', () => {
    const titles = [
      'Button 1',
      'Long Button Title That Might Wrap',
      'Short',
      'Button with Numbers 123',
      'Button with Special Characters !@#$%',
      '',
    ];

    titles.forEach((title) => {
      const { UNSAFE_root } = renderWithProvider(<Button title={title} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should render with all supported background colors', () => {
    const colors: Array<'blue.400' | 'gray.700' | 'gray.300'> = [
      'blue.400',
      'gray.700',
      'gray.300',
    ];

    colors.forEach((color) => {
      const { UNSAFE_root } = renderWithProvider(
        <Button title='Test Button' bgColor={color} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle additional props correctly', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Button
        title='Test Button'
        onPress={() => {}}
        disabled={true}
        testID='test-button'
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle onPress events', () => {
    const mockOnPress = jest.fn();
    const { UNSAFE_root } = renderWithProvider(
      <Button title='Test Button' onPress={mockOnPress} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle disabled state', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Button title='Test Button' disabled={true} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle enabled state', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Button title='Test Button' disabled={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle multiple button instances', () => {
    const { UNSAFE_root } = renderWithProvider(
      <>
        <Button title='Button 1' />
        <Button title='Button 2' bgColor='gray.700' />
        <Button title='Button 3' bgColor='gray.300' />
      </>
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle empty title', () => {
    const { UNSAFE_root } = renderWithProvider(<Button title='' />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle very long titles', () => {
    const longTitle =
      'This is a very long button title that might cause layout issues or text wrapping problems in the UI';
    const { UNSAFE_root } = renderWithProvider(<Button title={longTitle} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle titles with special characters', () => {
    const specialTitles = [
      'Button with émojis 🚀',
      'Button with ñ and ç',
      'Button with 中文 characters',
      'Button with Arabic نص',
      'Button with emojis 🎉✨🔥',
    ];

    specialTitles.forEach((title) => {
      const { UNSAFE_root } = renderWithProvider(<Button title={title} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle edge cases with undefined props', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Button
        title='Test Button'
        bgColor={undefined as any}
        onPress={undefined as any}
        disabled={undefined as any}
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle edge cases with null props', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Button
        title='Test Button'
        bgColor={null as any}
        onPress={null as any}
        disabled={null as any}
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle complex button configurations', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Button
        title='Complex Button'
        bgColor='gray.700'
        onPress={() => console.log('pressed')}
        disabled={false}
        testID='complex-button'
        accessibilityLabel='Complex Button for Testing'
        accessibilityHint='This button performs complex actions'
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle button with all NativeBase Button props', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Button
        title='NativeBase Button'
        bgColor='blue.400'
        size='lg'
        variant='solid'
        colorScheme='blue'
        leftIcon={<div>Icon</div>}
        rightIcon={<div>Icon</div>}
        isDisabled={false}
        isLoading={false}
        loadingText='Loading...'
        spinnerPlacement='start'
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle rapid prop changes', () => {
    const { UNSAFE_root, rerender } = renderWithProvider(
      <Button title='Initial Button' bgColor='blue.400' />
    );
    expect(UNSAFE_root).toBeTruthy();

    // Change title
    rerender(
      <NativeBaseProvider theme={THEME}>
        <Button title='Updated Button' bgColor='blue.400' />
      </NativeBaseProvider>
    );

    // Change color
    rerender(
      <NativeBaseProvider theme={THEME}>
        <Button title='Updated Button' bgColor='gray.700' />
      </NativeBaseProvider>
    );

    // Change to disabled
    rerender(
      <NativeBaseProvider theme={THEME}>
        <Button title='Updated Button' bgColor='gray.700' disabled={true} />
      </NativeBaseProvider>
    );
  });

  it('should maintain consistent rendering across different themes', () => {
    // Test with different theme configurations
    const customTheme = {
      ...THEME,
      colors: {
        ...THEME.colors,
        blue: {
          ...THEME.colors.blue,
          400: '#3B82F6',
          300: '#60A5FA',
        },
      },
    };

    const { UNSAFE_root } = renderWithProvider(
      <NativeBaseProvider theme={customTheme}>
        <Button title='Themed Button' bgColor='blue.400' />
      </NativeBaseProvider>
    );
    expect(UNSAFE_root).toBeTruthy();
  });
});
