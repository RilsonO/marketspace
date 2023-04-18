import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { House, Tag, SignOut } from 'phosphor-react-native';
import { useTheme, Pressable } from 'native-base';
import { Platform } from 'react-native';
import { Home } from '@screens/Home';
import { MyAds } from '@screens/MyAds';
import { useAuth } from '@hooks/useAuth';

type HomeTabsRoutes = {
  home: undefined;
  myAds: undefined;
  signOut: undefined;
};

export type HomeTabsNavigatorRoutesProps =
  BottomTabNavigationProp<HomeTabsRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<HomeTabsRoutes>();

export function HomeTabsRoutes() {
  const { sizes, colors } = useTheme();
  const { signOut } = useAuth();

  const iconSize = sizes[6];

  const LogOutFakeScreen = () => {
    return null;
  };

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.gray[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.gray[200],
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: sizes[10],
          paddingTop: sizes[6],
        },
      }}
    >
      <Screen
        name='home'
        component={Home}
        options={{
          tabBarIcon: ({ color }) => <House color={color} size={iconSize} />,
        }}
      />

      <Screen
        name='myAds'
        component={MyAds}
        options={{
          tabBarIcon: ({ color }) => <Tag color={color} size={iconSize} />,
        }}
      />

      <Screen
        name='signOut'
        component={LogOutFakeScreen}
        options={{
          tabBarIcon: () => (
            <Pressable onPress={signOut}>
              <SignOut color={colors.red[400]} size={iconSize} />
            </Pressable>
          ),
        }}
      />
    </Navigator>
  );
}
