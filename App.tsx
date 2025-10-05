import 'react-native-gesture-handler';
import React from 'react';

// Suprimir warning do SSRProvider no React 18
const originalConsoleWarn = console.warn;
console.warn = (message) => {
  if (
    message.includes('In React 18, SSRProvider is not necessary and is a noop')
  ) {
    return;
  }
  originalConsoleWarn(message);
};
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import { NativeBaseProvider } from 'native-base';
import {
  useFonts,
  Karla_400Regular,
  Karla_700Bold,
  Karla_300Light,
} from '@expo-google-fonts/karla';
import { THEME } from './src/shared/theme';
import { Loading } from './src/presentation/components/loading/view';
import { Routes } from './src/main/routes/index';
import { AuthContextProvider } from './src/contexts/auth/auth.context';

export default function App() {
  const [fontsLoaded] = useFonts({
    Karla_400Regular,
    Karla_700Bold,
    Karla_300Light,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider theme={THEME}>
        <AuthContextProvider>
          <Host>{fontsLoaded ? <Routes /> : <Loading />}</Host>
        </AuthContextProvider>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}
