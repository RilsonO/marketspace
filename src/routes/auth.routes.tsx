import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { SignIn } from '@views/screens/sign-in/view';
import { SignUp } from '@views/screens/SignUp';

type AuthRoutes = {
  signIn: undefined;
  signUp: undefined;
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name='signIn' component={SignIn} />

      <Screen name='signUp' component={SignUp} />
    </Navigator>
  );
}
