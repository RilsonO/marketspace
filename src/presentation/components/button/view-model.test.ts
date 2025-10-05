import { renderHook } from '@testing-library/react-native';
import { useButtonViewModel } from './view-model';

describe('useButtonViewModel', () => {
  it('should initialize with correct function', () => {
    const { result } = renderHook(() => useButtonViewModel());

    expect(typeof result.current.getPressedBgColor).toBe('function');
  });

  it('should return correct pressed color for blue.400', () => {
    const { result } = renderHook(() => useButtonViewModel());

    const pressedColor = result.current.getPressedBgColor('blue.400');
    expect(pressedColor).toBe('blue.300');
  });

  it('should return correct pressed color for gray.700', () => {
    const { result } = renderHook(() => useButtonViewModel());

    const pressedColor = result.current.getPressedBgColor('gray.700');
    expect(pressedColor).toBe('gray.600');
  });

  it('should return correct pressed color for gray.300', () => {
    const { result } = renderHook(() => useButtonViewModel());

    const pressedColor = result.current.getPressedBgColor('gray.300');
    expect(pressedColor).toBe('gray.200');
  });

  it('should handle different color variations correctly', () => {
    const { result } = renderHook(() => useButtonViewModel());

    const blue400 = result.current.getPressedBgColor('blue.400');
    expect(blue400).toBe('blue.300');

    const gray700 = result.current.getPressedBgColor('gray.700');
    expect(gray700).toBe('gray.600');

    const gray300 = result.current.getPressedBgColor('gray.300');
    expect(gray300).toBe('gray.200');
  });

  it('should return string for all valid color props', () => {
    const { result } = renderHook(() => useButtonViewModel());

    const colors: Array<'blue.400' | 'gray.700' | 'gray.300'> = [
      'blue.400',
      'gray.700',
      'gray.300',
    ];

    colors.forEach((color) => {
      const pressedColor = result.current.getPressedBgColor(color);
      expect(typeof pressedColor).toBe('string');
      expect(pressedColor).toBeTruthy();
    });
  });

  it('should handle color parsing correctly', () => {
    const { result } = renderHook(() => useButtonViewModel());

    // Test the actual implementation behavior
    const gray700 = result.current.getPressedBgColor('gray.700');
    expect(gray700).toBe('gray.600');

    const gray300 = result.current.getPressedBgColor('gray.300');
    expect(gray300).toBe('gray.200');
  });

  it('should maintain consistent behavior across multiple calls', () => {
    const { result } = renderHook(() => useButtonViewModel());

    const color1 = result.current.getPressedBgColor('blue.400');
    const color2 = result.current.getPressedBgColor('blue.400');

    expect(color1).toBe(color2);
    expect(color1).toBe('blue.300');
  });

  it('should return correct interface structure', () => {
    const { result } = renderHook(() => useButtonViewModel());

    expect(result.current).toHaveProperty('getPressedBgColor');
    expect(typeof result.current.getPressedBgColor).toBe('function');
  });

  it('should handle color number extraction correctly', () => {
    const { result } = renderHook(() => useButtonViewModel());

    // Test the number extraction logic: split('0')[0]
    // '400' -> split('0') -> ['4', '', ''] -> [0] -> '4'
    // '700' -> split('0') -> ['7', '', ''] -> [0] -> '7'
    // '300' -> split('0') -> ['3', '', ''] -> [0] -> '3'

    const blue400 = result.current.getPressedBgColor('blue.400');
    expect(blue400).toBe('blue.300'); // 4 - 1 = 3

    const gray700 = result.current.getPressedBgColor('gray.700');
    expect(gray700).toBe('gray.600'); // 7 - 1 = 6

    const gray300 = result.current.getPressedBgColor('gray.300');
    expect(gray300).toBe('gray.200'); // 3 - 1 = 2
  });

  it('should work with all supported color types', () => {
    const { result } = renderHook(() => useButtonViewModel());

    const testCases = [
      { input: 'blue.400', expected: 'blue.300' },
      { input: 'gray.700', expected: 'gray.600' },
      { input: 'gray.300', expected: 'gray.200' },
    ];

    testCases.forEach(({ input, expected }) => {
      const result_color = result.current.getPressedBgColor(
        input as 'blue.400' | 'gray.700' | 'gray.300'
      );
      expect(result_color).toBe(expected);
    });
  });

  it('should handle edge cases with different number patterns', () => {
    const { result } = renderHook(() => useButtonViewModel());

    // The implementation uses split('0')[0] which extracts the first digit
    // before any '0' in the number part
    const blue400 = result.current.getPressedBgColor('blue.400');
    expect(blue400).toBe('blue.300'); // '400' -> '4' -> 4-1=3 -> '300'

    const gray700 = result.current.getPressedBgColor('gray.700');
    expect(gray700).toBe('gray.600'); // '700' -> '7' -> 7-1=6 -> '600'

    const gray300 = result.current.getPressedBgColor('gray.300');
    expect(gray300).toBe('gray.200'); // '300' -> '3' -> 3-1=2 -> '200'
  });

  it('should preserve color prefix correctly', () => {
    const { result } = renderHook(() => useButtonViewModel());

    const blueResult = result.current.getPressedBgColor('blue.400');
    expect(blueResult).toMatch(/^blue\./);

    const grayResult = result.current.getPressedBgColor('gray.700');
    expect(grayResult).toMatch(/^gray\./);

    const grayResult2 = result.current.getPressedBgColor('gray.300');
    expect(grayResult2).toMatch(/^gray\./);
  });

  it('should always decrease the color intensity by 1', () => {
    const { result } = renderHook(() => useButtonViewModel());

    // All colors should decrease by 100 (from 400 to 300, 700 to 600, 300 to 200)
    const blue400 = result.current.getPressedBgColor('blue.400');
    expect(blue400).toBe('blue.300'); // 400 -> 300

    const gray700 = result.current.getPressedBgColor('gray.700');
    expect(gray700).toBe('gray.600'); // 700 -> 600

    const gray300 = result.current.getPressedBgColor('gray.300');
    expect(gray300).toBe('gray.200'); // 300 -> 200
  });
});
