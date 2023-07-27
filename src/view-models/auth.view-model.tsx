import { Children, createContext, ReactNode, useEffect, useState } from 'react';
import {
  fetchProducts,
  signIn,
  updateProfile,
} from '@infra/http/repositories/user.repository';
import { client } from '@infra/http/client.http';
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@infra/storage/user.storage';
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@infra/storage/auth-token.storage';
import { ProductMap } from '@mappers/product.map';

import { UserModel } from 'src/models/user.model';
import { UserMap } from '@mappers/user.map';
import { IUserProduct } from 'src/interfaces/user-product.interface';
import { UserProductResponseDTO } from '@dtos/product.dtos';

export type AuthContextDataProps = {
  user: UserModel;
  signInUser: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserModel>({} as UserModel);
  const [isLoading, setIsLoading] = useState(true);

  async function userAndTokenUpdate(userData: UserModel, token: string) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  }

  async function storageUserAndTokenSave(
    userData: UserModel,
    token: string,
    refresh_token: string
  ) {
    try {
      setIsLoading(true);
      const userDataConverted = UserMap.fromUserModelToBaseUserModel(userData);

      await storageUserSave(userDataConverted);
      await storageAuthTokenSave({ token, refresh_token });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function signInUser(email: string, password: string) {
    try {
      const data = await signIn({ email, password });

      if (data.user && data.token && data.refresh_token) {
        const userData = UserMap.fromSignInResponseDTOToUserModel(
          data,
          signOut,
          updateUserProfile,
          fetchUserProducts
        );

        await storageUserAndTokenSave(userData, data.token, data.refresh_token);
        await userAndTokenUpdate(userData, data.token);
      }
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setIsLoading(true);

      setUser({} as UserModel);
      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateUserProfile() {
    try {
      const data = await updateProfile();
      setUser((prev) => {
        return { ...data, ...prev };
      });

      const userDataConverted = UserMap.fromUserModelToBaseUserModel({
        ...data,
        ...user,
      });
      await storageUserSave(userDataConverted);
    } catch (error) {
      throw error;
    }
  }

  async function fetchUserProducts() {
    try {
      const response = await fetchProducts();
      const responseConverted = response.map((item: UserProductResponseDTO) =>
        ProductMap.toIUserProduct(item)
      );

      setUser((prev) => {
        return { ...prev, products: responseConverted };
      });
    } catch (error) {
      console.log('[loadUserData] error =>', error);
      throw error;
    }
  }

  async function loadUserData() {
    try {
      setIsLoading(true);

      const { token } = await storageAuthTokenGet();
      const storedUser = await storageUserGet();
      if (token && storedUser) {
        const storedUserConverted = UserMap.fromBaseUserModelToUserModel({
          user: storedUser,
          signOut,
          updateProfile: updateUserProfile,
          fetchProducts: fetchUserProducts,
        });

        userAndTokenUpdate(storedUserConverted, token);
      }
    } catch (error) {
      console.log('[loadUserData] error =>', error);

      throw error;
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
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider };
