import { PaymentMethodsDTO } from '@dtos/common.dtos';
import { IPaymentMethods } from 'src/interfaces/payment-methods.interface';
import { IPhoto } from 'src/interfaces/photo.interface';

class PaymentMethodsMap {
  static toIPaymentMethods({ key, name }: PaymentMethodsDTO): IPaymentMethods {
    return key as IPaymentMethods;
  }
}

export { PaymentMethodsMap };
