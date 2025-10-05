import { Box } from 'native-base';

interface Props {
  width: number;
  active?: boolean;
}

export function ImageIndicator({ active = false, width }: Props) {
  return (
    <Box
      w={width}
      h='1'
      bg='gray.100'
      rounded='full'
      opacity={active ? 1 : 0.5}
    />
  );
}
