import { Text, useTheme } from 'native-base';
import { IconProps } from 'phosphor-react-native';

type Props = {
  icon: React.ElementType<IconProps>;
  title: string;
};

export function PaymentMethod({ title, icon: Icon }: Props) {
  const { colors, sizes } = useTheme();
  return (
    <>
      <Icon size={sizes[5]} color={colors.gray[700]} />
      <Text fontFamily='regular' fontSize='sm' color='gray.600' ml='2'>
        {title}
      </Text>
    </>
  );
}
