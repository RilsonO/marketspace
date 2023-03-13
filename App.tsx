import React from 'react';
import { NativeBaseProvider, Box, Center } from 'native-base';

export default function App() {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Box>Hello world</Box>
      </Center>
    </NativeBaseProvider>
  );
}
