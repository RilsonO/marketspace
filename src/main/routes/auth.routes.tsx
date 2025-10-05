import React, { Suspense } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { SignIn } from '../../presentation/screens/auth/sign-in/view';
const SignUp = React.lazy(() =>
  import('../../presentation/screens/auth/sign-up/view').then((module) => ({
    default: module.SignUp,
  }))
);

type AuthRoutes = {
  signIn: undefined;
  signUp: undefined;
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

const SignUpWithSuspense = () => (
  <Suspense fallback={<></>}>
    <SignUp />
  </Suspense>
);

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name='signIn' component={SignIn} />
      <Screen name='signUp' component={SignUpWithSuspense} />
    </Navigator>
  );
}
