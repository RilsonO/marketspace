import { Box, Button, HStack, IButtonProps, Text, useTheme } from 'native-base';
import { X } from 'phosphor-react-native';

type Props = IButtonProps & {
  title: string;
  checked?: boolean;
};

export function TagButton({ title, checked = false, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <Button
      {...rest}
      px={5}
      bg={checked ? 'blue.400' : 'gray.300'}
      rounded='full'
      _pressed={{
        bg: checked ? 'blue.400:alpha.60' : 'gray.300:alpha.60',
      }}
      mx='1'
    >
      <HStack>
        <Text
          color={checked ? 'white' : 'gray.500'}
          fontFamily='bold'
          fontSize='xs'
        >
          {title}
        </Text>
        {checked && (
          <Box
            w='4'
            h='4'
            rounded='full'
            bg='white'
            marginLeft='2'
            marginRight={-2.5}
            alignItems='center'
            justifyContent='center'
          >
            <X size={10} color={colors.blue[400]} weight='bold' />
          </Box>
        )}
      </HStack>
    </Button>
  );
}
