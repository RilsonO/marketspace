import { useTheme, Box } from 'native-base';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';

import { Loading } from '../../presentation/components/loading/view';
import { useAuthContext } from '../../contexts/auth/use-auth.hook';

export function Routes() {
  const { colors } = useTheme();
  const { user, isLoading } = useAuthContext();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[200];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box flex={1} bg='gray.200'>
      <NavigationContainer theme={theme}>
        {user ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
