import { AuthContext } from '@view-models/auth.view-model';
import { useContext } from 'react';

export function useAuthViewModel() {
  const context = useContext(AuthContext);

  return context;
}
