import { Checkbox as CheckboxNativeBase, ICheckboxProps } from 'native-base';

type Props = ICheckboxProps & {
  label: string;
};

export function Checkbox({ label, ...rest }: Props) {
  return (
    <CheckboxNativeBase
      _checked={{ bg: 'blue.400', borderColor: 'blue.400' }}
      _icon={{ color: 'white' }}
      _text={{ fontSize: 'md', color: 'gray.600' }}
      mt={2}
      size='lg'
      {...rest}
    >
      {label}
    </CheckboxNativeBase>
  );
}
