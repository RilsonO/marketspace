import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base';
import { useButtonViewModel } from './view-model';

type Props = IButtonProps & {
  title: string;
  bgColor?: 'blue.400' | 'gray.700' | 'gray.300';
};

export function Button({ title, bgColor = 'blue.400', ...rest }: Props) {
  const { getPressedBgColor } = useButtonViewModel();

  return (
    <ButtonNativeBase
      {...rest}
      w='full'
      h={11}
      bg={bgColor}
      rounded={6}
      _pressed={{
        bg: getPressedBgColor(bgColor),
      }}
    >
      <Text
        color={bgColor === 'gray.300' ? 'gray.600' : 'white'}
        fontFamily='bold'
        fontSize='sm'
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}
