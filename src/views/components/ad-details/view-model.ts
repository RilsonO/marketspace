import { IPaymentMethods } from '@interfaces/payment-methods.interface';
import {
  Bank,
  Barcode,
  CreditCard,
  IconProps,
  Money,
  QrCode,
} from 'phosphor-react-native';
import { useEffect, useState } from 'react';

interface PaymentMethodsToShow {
  title: string;
  icon: React.ElementType<IconProps>;
}

export interface AdDetailsViewModel {
  paymentMethodsToShow: PaymentMethodsToShow[];
}

function useAdDetailsViewModel(
  payment_methods: IPaymentMethods[]
): AdDetailsViewModel {
  const [paymentMethodsToShow, setPaymentMethodsToShow] = useState<
    PaymentMethodsToShow[]
  >([]);

  function paymentMethodIndicator(paymentMethods: IPaymentMethods[]) {
    paymentMethods.map((paymentMethod) => {
      switch (paymentMethod) {
        case 'boleto':
          setPaymentMethodsToShow((prev) => [
            ...prev,
            {
              title: 'Boleto',
              icon: Barcode,
            },
          ]);
          break;
        case 'pix':
          setPaymentMethodsToShow((prev) => [
            ...prev,
            {
              title: 'Pix',
              icon: QrCode,
            },
          ]);
          break;
        case 'deposit':
          setPaymentMethodsToShow((prev) => [
            ...prev,
            {
              title: 'Depósito Bancário',
              icon: Bank,
            },
          ]);
          break;
        case 'cash':
          setPaymentMethodsToShow((prev) => [
            ...prev,
            {
              title: 'Dinheiro',
              icon: Money,
            },
          ]);
          break;
        case 'card':
          setPaymentMethodsToShow((prev) => [
            ...prev,
            {
              title: 'Cartão de Crédito',
              icon: CreditCard,
            },
          ]);
          break;
        default:
          break;
      }
    });
  }

  useEffect(() => {
    paymentMethodIndicator(payment_methods);
  }, [payment_methods]);

  return {
    paymentMethodsToShow,
  };
}

export { useAdDetailsViewModel };
