import { MaskService } from 'react-native-masked-text';

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
