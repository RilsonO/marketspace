import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { useState } from 'react';

export interface AdsViewModel {
  avatarIsLoading: boolean;
  handleNavigateToAdDetails: (id: string) => void;
  handleAvatarLoading: (value: boolean) => void;
}

function useAdsViewModel(): AdsViewModel {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const [avatarIsLoading, setAvatarIsLoading] = useState(true);

  function handleAvatarLoading(value: boolean) {
    setAvatarIsLoading(value);
  }

  function handleNavigateToAdDetails(id: string) {
    navigate('adDetails', { id });
  }

  return {
    avatarIsLoading,
    handleAvatarLoading,
    handleNavigateToAdDetails,
  };
}

export { useAdsViewModel };
