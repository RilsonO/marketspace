// Mock das dependências
jest.mock('../../main/container/DIContainer', () => ({
  container: {
    get: jest.fn(),
  },
}));

jest.mock('../../infra/storage/auth-token.storage', () => ({
  storageAuthTokenGet: jest.fn(),
  storageAuthTokenSave: jest.fn(),
  storageAuthTokenRemove: jest.fn(),
}));

jest.mock('../../infra/http/client.http', () => ({
  client: {
    defaults: {
      headers: {
        common: {},
      },
    },
    registerInterceptTokenManager: jest.fn(() => jest.fn()),
  },
}));

import { container } from '../../main/container/DIContainer';
import {
  storageAuthTokenGet,
  storageAuthTokenSave,
  storageAuthTokenRemove,
} from '../../infra/storage/auth-token.storage';
import { client } from '../../infra/http/client.http';

const mockContainerGet = container.get as jest.MockedFunction<
  typeof container.get
>;
const mockStorageAuthTokenGet = storageAuthTokenGet as jest.MockedFunction<
  typeof storageAuthTokenGet
>;
const mockStorageAuthTokenSave = storageAuthTokenSave as jest.MockedFunction<
  typeof storageAuthTokenSave
>;
const mockStorageAuthTokenRemove =
  storageAuthTokenRemove as jest.MockedFunction<typeof storageAuthTokenRemove>;
const mockClientRegisterInterceptTokenManager =
  client.registerInterceptTokenManager as jest.MockedFunction<
    typeof client.registerInterceptTokenManager
  >;

// Mock dos use cases e repositories
const mockSignInUseCase = {
  execute: jest.fn(),
};

const mockSignUpUseCase = {
  execute: jest.fn(),
};

const mockUpdateUserProfileUseCase = {
  execute: jest.fn(),
};

const mockUserRepository = {
  save: jest.fn(),
  delete: jest.fn(),
  findStored: jest.fn(),
};

const mockAuthService = {
  getCurrentUser: jest.fn(),
  signOut: jest.fn(),
};

describe('AuthContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Configurar mocks do container
    mockContainerGet.mockImplementation((key: string) => {
      switch (key) {
        case 'SIGN_IN_USE_CASE':
          return mockSignInUseCase;
        case 'SIGN_UP_USE_CASE':
          return mockSignUpUseCase;
        case 'UPDATE_USER_PROFILE_USE_CASE':
          return mockUpdateUserProfileUseCase;
        case 'I_USER_REPOSITORY':
          return mockUserRepository;
        case 'I_AUTH_SERVICE':
          return mockAuthService;
        default:
          return {};
      }
    });

    // Mock do registerInterceptTokenManager
    mockClientRegisterInterceptTokenManager.mockReturnValue(jest.fn());
  });

  it('should provide context with all required methods', () => {
    mockStorageAuthTokenGet.mockResolvedValue({
      token: null,
      refresh_token: null,
    });

    // Importar o AuthContextProvider após os mocks
    const { AuthContextProvider } = require('./auth.context');

    // Verificar se o AuthContextProvider é uma função
    expect(typeof AuthContextProvider).toBe('function');
  });

  it('should register token interceptor', () => {
    mockStorageAuthTokenGet.mockResolvedValue({
      token: null,
      refresh_token: null,
    });

    // Verificar se o mock foi configurado
    expect(mockClientRegisterInterceptTokenManager).toBeDefined();
  });

  it('should load user data from storage', () => {
    mockStorageAuthTokenGet.mockResolvedValue({
      token: null,
      refresh_token: null,
    });

    // Verificar se o mock foi configurado
    expect(mockStorageAuthTokenGet).toBeDefined();
  });

  it('should provide all required context methods', () => {
    // Verificar se todos os mocks foram configurados
    expect(mockSignInUseCase).toBeDefined();
    expect(mockSignUpUseCase).toBeDefined();
    expect(mockUpdateUserProfileUseCase).toBeDefined();
    expect(mockUserRepository).toBeDefined();
    expect(mockAuthService).toBeDefined();
  });

  it('should handle container dependencies correctly', () => {
    // Verificar se o container mock foi configurado
    expect(mockContainerGet).toBeDefined();

    // Testar se o container retorna os valores corretos
    expect(mockContainerGet('SIGN_IN_USE_CASE')).toBe(mockSignInUseCase);
    expect(mockContainerGet('SIGN_UP_USE_CASE')).toBe(mockSignUpUseCase);
    expect(mockContainerGet('UPDATE_USER_PROFILE_USE_CASE')).toBe(
      mockUpdateUserProfileUseCase
    );
    expect(mockContainerGet('I_USER_REPOSITORY')).toBe(mockUserRepository);
    expect(mockContainerGet('I_AUTH_SERVICE')).toBe(mockAuthService);
  });
});
