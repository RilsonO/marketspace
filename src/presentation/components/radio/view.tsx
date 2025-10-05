import {
  Radio as RadioNativeBase,
  IRadioGroupProps,
  HStack,
} from 'native-base';

type Props = IRadioGroupProps & {
  data: string[];
};

export function Radio({ data, ...rest }: Props) {
  return (
    <RadioNativeBase.Group {...rest}>
      <HStack w='full' justifyContent='space-around'>
        {data.map((item, index) => (
          <RadioNativeBase
            _checked={{ borderColor: 'blue.400' }}
            _icon={{ color: 'blue.400' }}
            key={`${item}-${String(index)}`}
            value={item}
          >
            {item}
          </RadioNativeBase>
        ))}
      </HStack>
    </RadioNativeBase.Group>
  );
}
