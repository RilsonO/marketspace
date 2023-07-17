import axios, { AxiosInstance, AxiosError } from 'axios';
import { AppError } from '@utils/AppError';
import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from '@storage/storageAuthToken';

type SignOut = () => void;

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

const client = axios.create({
  baseURL: 'http://192.168.1.2:3333',
}) as APIInstanceProps;

let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

client.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = client.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        const { refresh_token, token } = await storageAuthTokenGet();
        if (!!token) {
          if (
            requestError.response.data?.message === 'token.expired' ||
            requestError.response.data?.message === 'token.invalid'
          ) {
            if (!refresh_token) {
              signOut();
              return Promise.reject(requestError);
            }

            const originalRequestConfig = requestError.config;

            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                failedQueue.push({
                  onSuccess: (token: string) => {
                    originalRequestConfig.headers = {
                      Authorization: `Bearer ${token}`,
                    };
                    resolve(client(originalRequestConfig));
                  },
                  onFailure: (error: AppError) => {
                    reject(error);
                  },
                });
              });
            }

            isRefreshing = true;

            return new Promise(async (resolve, reject) => {
              try {
                const { data } = await client.post('/sessions/refresh-token', {
                  refresh_token,
                });
                await storageAuthTokenSave({
                  token: data.token,
                  refresh_token: data.refresh_token,
                });

                if (originalRequestConfig.data) {
                  originalRequestConfig.data = JSON.parse(
                    originalRequestConfig.data
                  );
                }

                originalRequestConfig.headers = {
                  Authorization: `Bearer ${data.token}`,
                };
                client.defaults.headers.common[
                  'Authorization'
                ] = `Bearer ${data.token}`;

                failedQueue.forEach((request) => {
                  request.onSuccess(data.token);
                });

                resolve(client(originalRequestConfig));
              } catch (error: any) {
                failedQueue.forEach((request) => {
                  request.onFailure(error);
                });

                signOut();
                reject(error);
              } finally {
                isRefreshing = false;
                failedQueue = [];
              }
            });
          }

          signOut();
        }
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        return Promise.reject(requestError);
      }
    }
  );

  return () => {
    client.interceptors.response.eject(interceptTokenManager);
  };
};

export { client };
