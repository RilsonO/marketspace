import { MaskService } from 'react-native-masked-text';

export function unMask(value: string) {
  return value.replace(/[^\d]/g, '');
}

export function toMaskedPhone(value: string) {
  return MaskService.toMask('cel-phone', value, {
    maskType: 'BRL',
    withDDD: true,
    dddMask: '(99) ',
  });
}

export function toMaskedPrice(value: string) {
  return MaskService.toMask('money', value, {
    precision: 2,
    separator: ',',
    delimiter: '.',
    unit: '',
    suffixUnit: '',
  });
}

export function maskedPriceToNumber(value: string) {
  return MaskService.toRawValue('money', value, {
    precision: 2,
    separator: ',',
    delimiter: '.',
    unit: '',
    suffixUnit: '',
  });
}
