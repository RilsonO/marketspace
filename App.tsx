import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import { NativeBaseProvider } from 'native-base';
import {
  useFonts,
  Karla_400Regular,
  Karla_700Bold,
  Karla_300Light,
} from '@expo-google-fonts/karla';
import { THEME } from './src/theme';
import { Loading } from '@components/Loading';
import { Routes } from '@routes/index';

export default function App() {
  const [fontsLoaded] = useFonts({
    Karla_400Regular,
    Karla_700Bold,
    Karla_300Light,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider theme={THEME}>
        <Host>{fontsLoaded ? <Routes /> : <Loading />}</Host>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}
