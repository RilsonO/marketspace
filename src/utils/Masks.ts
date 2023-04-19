import { MaskService } from 'react-native-masked-text';

export function unMask(value: string) {
  return value.replace(/[^\d]/g, '');
}

export function toMaskedPhone(value: string) {
  try {
    return MaskService.toMask('cel-phone', value, {
      maskType: 'BRL',
      withDDD: true,
      dddMask: '(99) ',
    });
  } catch (error) {
    throw error;
  }
}

export function toMaskedPrice(value: string) {
  try {
    return MaskService.toMask('money', value, {
      precision: 2,
      separator: ',',
      delimiter: '.',
      unit: '',
      suffixUnit: '',
    });
  } catch (error) {
    throw error;
  }
}

export function maskedPriceToNumber(value: string) {
  try {
    return MaskService.toRawValue('money', value, {
      precision: 2,
      separator: ',',
      delimiter: '.',
      unit: '',
      suffixUnit: '',
    });
  } catch (error) {
    throw error;
  }
}
