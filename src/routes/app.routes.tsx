import { CreateAd } from '@screens/CreateAd';
import { PreviewAd } from '@screens/PreviewAd';
import { AdDetails } from '@screens/AdDetails';
import { IProduct } from 'src/interfaces/IProduct';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { HomeTabsRoutes } from './home.tabs.routes';

type AppRoutes = {
  homeTabs: undefined;
  createAd: undefined | IProduct;
  previewAd: IProduct & {
    imagesToDelete: string[];
  };
  adDetails: { id: string };
};

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Screen name='homeTabs' component={HomeTabsRoutes} />

      <Screen name='createAd' component={CreateAd} />

      <Screen name='previewAd' component={PreviewAd} />

      <Screen name='adDetails' component={AdDetails} />
    </Navigator>
  );
}
