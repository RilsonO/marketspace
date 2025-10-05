import { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from '../../entities/User';
import { container } from '../../main/container/DIContainer';
import { RepositoryKeys, UseCaseKeys } from '../../shared/enums';

import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '../../infra/storage/auth-token.storage';
import { client } from '../../infra/http/client.http';

export type AuthContextDataProps = {
  user: User | null;
  // eslint-disable-next-line no-unused-vars
  signInUser: (email: string, password: string) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  signUpUser: (
    name: string,
    email: string,
    phone: string,
    password: string,
    avatar?: File
  ) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  updateUserProfile: (
    name: string,
    phone: string,
    avatar: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use cases
  const signInUseCase = container.get(UseCaseKeys.SIGN_IN_USE_CASE);
  const signUpUseCase = container.get(UseCaseKeys.SIGN_UP_USE_CASE);
  const updateUserProfileUseCase = container.get(
    UseCaseKeys.UPDATE_USER_PROFILE_USE_CASE
  );
  const userRepository = container.get(RepositoryKeys.I_USER_REPOSITORY);
  const authService = container.get(RepositoryKeys.I_AUTH_SERVICE);

  async function userAndTokenUpdate(userData: User, token: string) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  }

  async function storageUserAndTokenSave(
    userData: User,
    token: string,
    refresh_token: string
  ) {
    try {
      setIsLoading(true);
      await userRepository.save(userData);
      await storageAuthTokenSave({ token, refresh_token });
    } finally {
      setIsLoading(false);
    }
  }

  async function signInUser(email: string, password: string) {
    try {
      setIsLoading(true);
      const { user: userData, tokens } = await signInUseCase.execute({
        email,
        password,
      });

      await storageUserAndTokenSave(
        userData,
        tokens.token,
        tokens.refreshToken
      );
      await userAndTokenUpdate(userData, tokens.token);
    } finally {
      setIsLoading(false);
    }
  }

  async function signUpUser(
    name: string,
    email: string,
    phone: string,
    password: string,
    avatar?: File
  ) {
    try {
      setIsLoading(true);
      const { user: userData, tokens } = await signUpUseCase.execute({
        name,
        email,
        phone,
        password,
        avatar,
      });

      await storageUserAndTokenSave(
        userData,
        tokens.token,
        tokens.refreshToken
      );
      await userAndTokenUpdate(userData, tokens.token);
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    try {
      setIsLoading(true);
      setUser(null);
      await userRepository.delete();
      await storageAuthTokenRemove();
      await authService.signOut();
    } finally {
      setIsLoading(false);
    }
  }

  async function updateUserProfile(
    name: string,
    phone: string,
    avatar: string
  ) {
    if (!user) return;

    try {
      setIsLoading(true);
      const updatedUser = await updateUserProfileUseCase.execute(user.id, {
        name,
        phone,
        avatar,
      });

      setUser(updatedUser);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadUserData() {
    try {
      setIsLoading(true);

      const { token } = await storageAuthTokenGet();
      if (token) {
        // Set token in headers first
        client.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Try to get current user from API
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // If API fails, try to get user from local storage
          const storedUser = await userRepository.findStored();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // If both fail, clear everything
            await storageAuthTokenRemove();
            client.defaults.headers.common['Authorization'] = '';
          }
        }
      }
    } catch (error) {
      console.log('Error loading user data:', error);
      // Clear everything on error
      setUser(null);
      await storageAuthTokenRemove();
      client.defaults.headers.common['Authorization'] = '';
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscribe = client.registerInterceptTokenManager(signOut);

    return () => {
      subscribe();
    };
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signInUser,
        signUpUser,
        updateUserProfile,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider };
