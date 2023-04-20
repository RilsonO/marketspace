import { PaymentMethodsDTO } from '@dtos/PaymentMethodsDTO';
import { api } from '@services/api';
import { IPaymentMethods } from 'src/interfaces/IPaymentMethods';
import { IPhoto } from 'src/interfaces/IPhoto';

class PaymentMethodsMap {
  static toIPaymentMethods({ key, name }: PaymentMethodsDTO): IPaymentMethods {
    return key as IPaymentMethods;
  }
}

export { PaymentMethodsMap };
