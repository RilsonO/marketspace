import { ReactNode, useEffect } from 'react';
import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base';

type Props = IButtonProps & {
  title: string;
  bgColor?: 'blue.400' | 'gray.700' | 'gray.300';
  children?: ReactNode;
};

export function Button({
  title,
  children,
  bgColor = 'blue.400',
  ...rest
}: Props) {
  function getPressedBgColor() {
    const bgColorArray = bgColor.split('.');
    const prefixBgColor = bgColorArray[0];
    const alphaBgColor = Number(bgColorArray[1].split('0')[0]);
    const pressedBgColor = `${prefixBgColor}.${String(alphaBgColor - 1)}00`;

    return pressedBgColor;
  }

  return (
    <ButtonNativeBase
      {...rest}
      w='full'
      h={11}
      bg={bgColor}
      rounded='sm'
      _pressed={{
        bg: getPressedBgColor(),
      }}
    >
      {children}
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
