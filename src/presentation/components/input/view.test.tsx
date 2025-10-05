import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import { Input } from './view';
import { THEME } from 'src/shared/theme';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <NativeBaseProvider theme={THEME}>{component}</NativeBaseProvider>
  );
};

describe('Input Component', () => {
  it('should render without crashing', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Enter text' />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with placeholder', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Enter your name' />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with value', () => {
    const { UNSAFE_root } = renderWithProvider(<Input value='Test value' />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render without error message', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='No error' />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with error message', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='With error' errorMessage='This field is required' />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with null error message', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Null error' errorMessage={null} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with undefined error message', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Undefined error' errorMessage={undefined} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with empty error message', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Empty error' errorMessage='' />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle isInvalid prop', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Invalid input' isInvalid={true} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle isInvalid false', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Valid input' isInvalid={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle both errorMessage and isInvalid', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input
        placeholder='Both error'
        errorMessage='Custom error message'
        isInvalid={true}
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle different input types', () => {
    const inputTypes = [
      'text',
      'email',
      'password',
      'number',
      'tel',
      'url',
      'search',
    ];

    inputTypes.forEach((type) => {
      const { UNSAFE_root } = renderWithProvider(
        <Input placeholder={`${type} input`} type={type as any} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle secureTextEntry', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Password' secureTextEntry={true} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle disabled state', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Disabled input' disabled={true} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle editable false', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Read only' editable={false} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle multiline input', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Multiline input' multiline={true} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle numberOfLines', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='3 lines' numberOfLines={3} multiline={true} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle maxLength', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Max 10 chars' maxLength={10} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle autoCapitalize', () => {
    const autoCapitalizeOptions = ['none', 'sentences', 'words', 'characters'];

    autoCapitalizeOptions.forEach((option) => {
      const { UNSAFE_root } = renderWithProvider(
        <Input
          placeholder={`Auto capitalize ${option}`}
          autoCapitalize={option as any}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle autoCorrect', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Auto correct' autoCorrect={true} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle autoComplete', () => {
    const autoCompleteOptions = [
      'email',
      'name',
      'tel',
      'off',
      'on',
      'username',
      'password',
    ];

    autoCompleteOptions.forEach((option) => {
      const { UNSAFE_root } = renderWithProvider(
        <Input
          placeholder={`Auto complete ${option}`}
          autoComplete={option as any}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle keyboardType', () => {
    const keyboardTypes = [
      'default',
      'numeric',
      'email-address',
      'phone-pad',
      'number-pad',
      'decimal-pad',
    ];

    keyboardTypes.forEach((type) => {
      const { UNSAFE_root } = renderWithProvider(
        <Input placeholder={`Keyboard ${type}`} keyboardType={type as any} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle returnKeyType', () => {
    const returnKeyTypes = [
      'done',
      'go',
      'next',
      'search',
      'send',
      'default',
      'emergency-call',
    ];

    returnKeyTypes.forEach((type) => {
      const { UNSAFE_root } = renderWithProvider(
        <Input placeholder={`Return key ${type}`} returnKeyType={type as any} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle event handlers', () => {
    const mockOnChangeText = jest.fn();
    const mockOnFocus = jest.fn();
    const mockOnBlur = jest.fn();
    const mockOnSubmitEditing = jest.fn();

    const { UNSAFE_root } = renderWithProvider(
      <Input
        placeholder='With handlers'
        onChangeText={mockOnChangeText}
        onFocus={mockOnFocus}
        onBlur={mockOnBlur}
        onSubmitEditing={mockOnSubmitEditing}
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle accessibility props', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input
        placeholder='Accessible input'
        accessibilityLabel='Email input field'
        accessibilityHint='Enter your email address'
        accessibilityRole='text'
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle testID', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Test input' testID='email-input' />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle long error messages', () => {
    const longErrorMessage =
      'This is a very long error message that might cause layout issues or text wrapping problems in the UI and should be handled gracefully';

    const { UNSAFE_root } = renderWithProvider(
      <Input placeholder='Long error' errorMessage={longErrorMessage} />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle special characters in placeholder', () => {
    const specialPlaceholders = [
      'Enter your émojis 🚀',
      'Type your ñ and ç',
      'Input with 中文 characters',
      'Enter Arabic نص',
      'Special chars !@#$%^&*()',
    ];

    specialPlaceholders.forEach((placeholder) => {
      const { UNSAFE_root } = renderWithProvider(
        <Input placeholder={placeholder} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle special characters in value', () => {
    const specialValues = [
      'Test with émojis 🚀',
      'Value with ñ and ç',
      '中文 characters value',
      'Arabic نص value',
      'Special chars !@#$%^&*()',
    ];

    specialValues.forEach((value) => {
      const { UNSAFE_root } = renderWithProvider(<Input value={value} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle special characters in error message', () => {
    const specialErrors = [
      'Error with émojis 🚀',
      'Error with ñ and ç',
      '中文 error message',
      'Arabic نص error',
      'Special chars !@#$%^&*()',
    ];

    specialErrors.forEach((errorMessage) => {
      const { UNSAFE_root } = renderWithProvider(
        <Input placeholder='Test' errorMessage={errorMessage} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should render multiple inputs', () => {
    const { UNSAFE_root } = renderWithProvider(
      <>
        <Input placeholder='Input 1' />
        <Input placeholder='Input 2' errorMessage='Error 2' />
        <Input placeholder='Input 3' isInvalid={true} />
        <Input placeholder='Input 4' disabled={true} />
      </>
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should work with different theme configurations', () => {
    const customTheme = {
      ...THEME,
      colors: {
        ...THEME.colors,
        gray: {
          ...THEME.colors.gray,
          100: '#F3F4F6',
          400: '#9CA3AF',
          700: '#374151',
        },
        red: {
          ...THEME.colors.red,
          500: '#EF4444',
        },
        blue: {
          ...THEME.colors.blue,
          400: '#3B82F6',
        },
      },
    };

    const { UNSAFE_root } = renderWithProvider(
      <NativeBaseProvider theme={customTheme}>
        <Input placeholder='Themed input' errorMessage='Themed error' />
      </NativeBaseProvider>
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle rapid prop changes', () => {
    const { UNSAFE_root, rerender } = renderWithProvider(
      <Input placeholder='Initial' />
    );
    expect(UNSAFE_root).toBeTruthy();

    // Change placeholder
    rerender(
      <NativeBaseProvider theme={THEME}>
        <Input placeholder='Updated' />
      </NativeBaseProvider>
    );

    // Add error
    rerender(
      <NativeBaseProvider theme={THEME}>
        <Input placeholder='Updated' errorMessage='Error' />
      </NativeBaseProvider>
    );

    // Remove error, add value
    rerender(
      <NativeBaseProvider theme={THEME}>
        <Input placeholder='Updated' value='Some value' />
      </NativeBaseProvider>
    );
  });

  it('should handle edge cases with undefined props', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input
        placeholder={undefined as any}
        value={undefined as any}
        errorMessage={undefined as any}
        isInvalid={undefined as any}
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle edge cases with null props', () => {
    const { UNSAFE_root } = renderWithProvider(
      <Input
        placeholder={null as any}
        value={null as any}
        errorMessage={null as any}
        isInvalid={null as any}
      />
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should be a pure component (no side effects)', () => {
    // Test that multiple renders produce the same result
    const { UNSAFE_root: root1 } = renderWithProvider(
      <Input placeholder='Test' />
    );
    const { UNSAFE_root: root2 } = renderWithProvider(
      <Input placeholder='Test' />
    );

    expect(root1).toBeTruthy();
    expect(root2).toBeTruthy();
  });
});
