import {
  unMask,
  toMaskedPhone,
  toMaskedPrice,
  maskedPriceToNumber,
} from './Masks.util';

// Mock do MaskService
jest.mock('react-native-masked-text', () => ({
  MaskService: {
    toMask: jest.fn((type, value, options) => {
      if (type === 'cel-phone') {
        // Mock simplificado para máscara de telefone
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length === 0) return '';
        if (cleaned.length === 1) return `(${cleaned}`;
        if (cleaned.length === 2) return `(${cleaned}) `;
        if (cleaned.length <= 7)
          return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
          7,
          11
        )}`;
      }
      if (type === 'money') {
        // Mock simplificado para máscara de dinheiro
        const numValue = parseFloat(value) || 0;
        const formatted = numValue.toFixed(2).replace('.', ',');
        return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
      return value;
    }),
    toRawValue: jest.fn((type, value, options) => {
      if (type === 'money') {
        // Mock simplificado para extrair valor numérico
        return parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
      }
      return value;
    }),
  },
}));

describe('Masks.util', () => {
  describe('unMask', () => {
    it('should remove all non-digit characters', () => {
      expect(unMask('abc123def456')).toBe('123456');
    });

    it('should handle empty string', () => {
      expect(unMask('')).toBe('');
    });

    it('should handle string with only non-digits', () => {
      expect(unMask('abc!@#$%')).toBe('');
    });

    it('should handle string with only digits', () => {
      expect(unMask('1234567890')).toBe('1234567890');
    });

    it('should handle mixed characters with special symbols', () => {
      expect(unMask('(11) 99999-9999')).toBe('11999999999');
    });

    it('should handle phone number format', () => {
      expect(unMask('+55 11 99999-9999')).toBe('5511999999999');
    });

    it('should handle price format', () => {
      expect(unMask('R$ 1.234,56')).toBe('123456');
    });
  });

  describe('toMaskedPhone', () => {
    it('should format phone number with area code', () => {
      expect(toMaskedPhone('11999999999')).toBe('(11) 99999-9999');
    });

    it('should handle incomplete phone number', () => {
      expect(toMaskedPhone('1199999')).toBe('(11) 99999');
    });

    it('should handle phone number without area code', () => {
      expect(toMaskedPhone('999999999')).toBe('(99) 99999-99');
    });

    it('should handle empty string', () => {
      expect(toMaskedPhone('')).toBe('');
    });

    it('should handle single digit', () => {
      expect(toMaskedPhone('1')).toBe('(1');
    });

    it('should handle two digits', () => {
      expect(toMaskedPhone('11')).toBe('(11) ');
    });

    it('should handle phone number with extra digits', () => {
      expect(toMaskedPhone('119999999999')).toBe('(11) 99999-9999');
    });

    it('should handle phone number with non-digit characters', () => {
      expect(toMaskedPhone('11-99999-9999')).toBe('(11) 99999-9999');
    });
  });

  describe('toMaskedPrice', () => {
    it('should format price with comma as decimal separator', () => {
      expect(toMaskedPrice('1234.56')).toBe('1.234,56');
    });

    it('should format integer as price', () => {
      expect(toMaskedPrice('1000')).toBe('1.000,00');
    });

    it('should handle zero', () => {
      expect(toMaskedPrice('0')).toBe('0,00');
    });

    it('should handle empty string', () => {
      expect(toMaskedPrice('')).toBe('0,00');
    });

    it('should handle decimal with one digit', () => {
      expect(toMaskedPrice('123.5')).toBe('123,50');
    });

    it('should handle large number', () => {
      expect(toMaskedPrice('1234567.89')).toBe('1.234.567,89');
    });

    it('should handle small decimal', () => {
      expect(toMaskedPrice('0.01')).toBe('0,01');
    });

    it('should handle invalid input gracefully', () => {
      expect(toMaskedPrice('abc')).toBe('0,00');
    });

    it('should handle negative number', () => {
      expect(toMaskedPrice('-100.50')).toBe('-100,50');
    });
  });

  describe('maskedPriceToNumber', () => {
    it('should convert masked price to number', () => {
      expect(maskedPriceToNumber('1.234,56')).toBe(1234.56);
    });

    it('should handle integer format', () => {
      expect(maskedPriceToNumber('1.000,00')).toBe(1000);
    });

    it('should handle zero', () => {
      expect(maskedPriceToNumber('0,00')).toBe(0);
    });

    it('should handle empty string', () => {
      expect(maskedPriceToNumber('')).toBe(0);
    });

    it('should handle decimal with one digit', () => {
      expect(maskedPriceToNumber('123,50')).toBe(123.5);
    });

    it('should handle large number', () => {
      expect(maskedPriceToNumber('1.234.567,89')).toBe(1234567.89);
    });

    it('should handle small decimal', () => {
      expect(maskedPriceToNumber('0,01')).toBe(0.01);
    });

    it('should handle price with currency symbol', () => {
      expect(maskedPriceToNumber('R$ 1.234,56')).toBe(1234.56);
    });

    it('should handle price with spaces', () => {
      expect(maskedPriceToNumber('1 234,56')).toBe(1234.56);
    });

    it('should handle invalid input gracefully', () => {
      expect(maskedPriceToNumber('abc')).toBe(0);
    });

    it('should handle negative number', () => {
      expect(maskedPriceToNumber('-100,50')).toBe(-100.5);
    });

    it('should handle price without thousands separator', () => {
      expect(maskedPriceToNumber('1234,56')).toBe(1234.56);
    });
  });

  describe('Integration tests', () => {
    it('should handle round-trip conversion for phone', () => {
      const original = '11999999999';
      const masked = toMaskedPhone(original);
      const unmasked = unMask(masked);
      expect(unmasked).toBe(original);
    });

    it('should handle round-trip conversion for price', () => {
      const original = '1234.56';
      const masked = toMaskedPrice(original);
      const unmasked = maskedPriceToNumber(masked);
      expect(unmasked).toBe(1234.56);
    });

    it('should handle complex phone number scenarios', () => {
      const testCases = [
        { input: '11999999999', expected: '(11) 99999-9999' },
        { input: '1199999999', expected: '(11) 99999-999' },
        { input: '119999999', expected: '(11) 99999-99' },
        { input: '11999999', expected: '(11) 99999-9' },
        { input: '1199999', expected: '(11) 99999' },
        { input: '119999', expected: '(11) 9999' },
        { input: '11999', expected: '(11) 999' },
        { input: '1199', expected: '(11) 99' },
        { input: '119', expected: '(11) 9' },
        { input: '11', expected: '(11) ' },
        { input: '1', expected: '(1' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(toMaskedPhone(input)).toBe(expected);
      });
    });

    it('should handle complex price scenarios', () => {
      const testCases = [
        { input: '0', expected: '0,00' },
        { input: '0.5', expected: '0,50' },
        { input: '123', expected: '123,00' },
        { input: '1234', expected: '1.234,00' },
        { input: '12345', expected: '12.345,00' },
        { input: '123456', expected: '123.456,00' },
        { input: '1234567', expected: '1.234.567,00' },
        { input: '123.45', expected: '123,45' },
        { input: '1234.56', expected: '1.234,56' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(toMaskedPrice(input)).toBe(expected);
      });
    });

    it('should handle edge cases for unMask', () => {
      const testCases = [
        { input: '', expected: '' },
        { input: 'a', expected: '' },
        { input: '1', expected: '1' },
        { input: '!@#$%^&*()', expected: '' },
        { input: '1a2b3c', expected: '123' },
        { input: '(11) 99999-9999', expected: '11999999999' },
        { input: 'R$ 1.234,56', expected: '123456' },
        { input: '+55 11 99999-9999', expected: '5511999999999' },
        { input: '123abc456def789', expected: '123456789' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(unMask(input)).toBe(expected);
      });
    });
  });
});
