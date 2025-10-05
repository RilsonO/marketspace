import { Image, IImageProps } from 'native-base';

type Props = IImageProps & {
  size: number;
};

export function ProductSmallPhoto({ size, ...rest }: Props) {
  return <Image w={size} h={size} rounded={6} {...rest} />;
}
