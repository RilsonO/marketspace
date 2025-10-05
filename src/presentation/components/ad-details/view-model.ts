import { PaymentMethod } from '../../../entities/Product';
import {
  Bank,
  Barcode,
  CreditCard,
  IconProps,
  Money,
  QrCode,
} from 'phosphor-react-native';
import { useMemo } from 'react';

interface PaymentMethodsToShow {
  title: string;
  icon: React.ElementType<IconProps>;
}

export interface AdDetailsViewModel {
  paymentMethodsToShow: PaymentMethodsToShow[];
}

function useAdDetailsViewModel(
  payment_methods: PaymentMethod[]
): AdDetailsViewModel {
  const paymentMethodsToShow = useMemo(() => {
    return payment_methods
      .map((paymentMethod) => {
        switch (paymentMethod) {
          case PaymentMethod.BOLETO:
            return {
              title: 'Boleto',
              icon: Barcode,
            };
          case PaymentMethod.PIX:
            return {
              title: 'Pix',
              icon: QrCode,
            };
          case PaymentMethod.DEPOSITO_BANCARIO:
            return {
              title: 'Depósito Bancário',
              icon: Bank,
            };
          case PaymentMethod.DINHEIRO:
            return {
              title: 'Dinheiro',
              icon: Money,
            };
          case PaymentMethod.CARTAO_CREDITO:
            return {
              title: 'Cartão de Crédito',
              icon: CreditCard,
            };
          default:
            return null;
        }
      })
      .filter(Boolean) as PaymentMethodsToShow[];
  }, [payment_methods]);

  return {
    paymentMethodsToShow,
  };
}

export { useAdDetailsViewModel };
