import { AdDetails } from '../../presentation/screens/products/ad-details/view';
import React, { Suspense } from 'react';

// Lazy loading para telas menos acessadas
const CreateAd = React.lazy(() =>
  import('../../presentation/screens/products/create-ad/view').then(
    (module) => ({
      default: module.CreateAd,
    })
  )
);

const PreviewAd = React.lazy(() =>
  import('../../presentation/screens/products/preview-ad/view').then(
    (module) => ({
      default: module.PreviewAd,
    })
  )
);
import { IProduct } from '../../shared/types/interfaces/product.interface';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { HomeTabsRoutes } from './home-tabs.routes';

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

// Componentes com Suspense para lazy loading
const CreateAdWithSuspense = () => (
  <Suspense fallback={<></>}>
    <CreateAd />
  </Suspense>
);

const PreviewAdWithSuspense = () => (
  <Suspense fallback={<></>}>
    <PreviewAd />
  </Suspense>
);

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Screen name='homeTabs' component={HomeTabsRoutes} />

      <Screen name='createAd' component={CreateAdWithSuspense} />

      <Screen name='previewAd' component={PreviewAdWithSuspense} />

      <Screen name='adDetails' component={AdDetails} />
    </Navigator>
  );
}
