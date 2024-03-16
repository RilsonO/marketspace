import { useTheme, Box } from 'native-base';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';

import { Loading } from '@views/components/loading/view';
import { useAuthViewModel } from '@hooks/use-auth.hook';

export function Routes() {
  const { colors } = useTheme();
  const { user, isLoading } = useAuthViewModel();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[200];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box flex={1} bg='gray.200'>
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
