import React from 'react';
import { NativeBaseProvider } from 'native-base';
import {
  useFonts,
  Karla_400Regular,
  Karla_700Bold,
  Karla_300Light,
} from '@expo-google-fonts/karla';
import { THEME } from './src/theme';
import { SignIn } from './src/screens/SignIn';
import { Loading } from '@components/Loading';
import { Routes } from '@routes/index';

export default function App() {
  const [fontsLoaded] = useFonts({
    Karla_400Regular,
    Karla_700Bold,
    Karla_300Light,
  });

  return (
    <NativeBaseProvider theme={THEME}>
      {fontsLoaded ? <Routes /> : <Loading />}
    </NativeBaseProvider>
  );
}
