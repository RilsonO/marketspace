import { PaymentMethodsDTO } from '../../application/dtos/common.dtos';
import { PaymentMethod } from '../../entities/Product';

class PaymentMethodsMap {
  static fromPaymentMethodsDTOArrayToPaymentMethodArray(
    paymentMethodsDTO: PaymentMethodsDTO[]
  ): PaymentMethod[] {
    return paymentMethodsDTO.map((dto) => dto.key as PaymentMethod);
  }

  static fromPaymentMethodArrayToPaymentMethodsDTOArray(
    paymentMethods: PaymentMethod[]
  ): PaymentMethodsDTO[] {
    return paymentMethods.map((method) => ({
      key: method,
      name: this.getPaymentMethodName(method),
    }));
  }

  static fromPaymentMethodArrayToStringArray(
    paymentMethods: PaymentMethod[]
  ): string[] {
    return paymentMethods.map((method) => method);
  }

  private static getPaymentMethodName(method: PaymentMethod): string {
    const names: Record<PaymentMethod, string> = {
      [PaymentMethod.BOLETO]: 'Boleto',
      [PaymentMethod.PIX]: 'Pix',
      [PaymentMethod.DINHEIRO]: 'Dinheiro',
      [PaymentMethod.CARTAO_CREDITO]: 'Cartão de Crédito',
      [PaymentMethod.CARTAO_DEBITO]: 'Cartão de Débito',
      [PaymentMethod.DEPOSITO_BANCARIO]: 'Depósito Bancário',
    };
    return names[method];
  }
}

export { PaymentMethodsMap };
