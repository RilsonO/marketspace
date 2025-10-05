import { UserRepositoryImpl } from '../../infra/repositories/UserRepositoryImpl';
import { AuthServiceImpl } from '../../infra/services/AuthServiceImpl';
import { SignInUseCase } from '../../application/use-cases/auth/SignInUseCase';
import { SignUpUseCase } from '../../application/use-cases/auth/SignUpUseCase';
import { GetUserProductsUseCase } from '../../application/use-cases/products/GetUserProductsUseCase';
import { GetProductsUseCase } from '../../application/use-cases/products/GetProductsUseCase';
import { UpdateUserProfileUseCase } from '../../application/use-cases/user/UpdateUserProfileUseCase';
import { ProductRepositoryImpl } from '../../infra/repositories/ProductRepositoryImpl';
import { RepositoryKeys, UseCaseKeys } from '../../shared/enums';
import { AllTypeMap } from '../../shared/types/ContainerTypes';

class DIContainer {
  private static instance: DIContainer;
  private dependencies: Map<string, unknown> = new Map();
  private factories: Map<string, () => unknown> = new Map();

  private constructor() {
    this.registerDependencies();
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private registerDependencies(): void {
    // 1. REPOSITORIES/SERVICES - Lazy factories - Fundamentos (sem dependências)
    this.factories.set(
      RepositoryKeys.I_USER_REPOSITORY,
      () => new UserRepositoryImpl()
    );
    this.factories.set(
      RepositoryKeys.I_PRODUCT_REPOSITORY,
      () => new ProductRepositoryImpl()
    );
    this.factories.set(
      RepositoryKeys.I_AUTH_SERVICE,
      () => new AuthServiceImpl()
    );

    // 2. USE CASES - Lazy factories com dependências - Lógica de negócio (dependem de repositories)
    this.factories.set(
      UseCaseKeys.SIGN_IN_USE_CASE,
      () =>
        new SignInUseCase(
          this.get(RepositoryKeys.I_AUTH_SERVICE),
          this.get(RepositoryKeys.I_USER_REPOSITORY)
        )
    );

    this.factories.set(
      UseCaseKeys.SIGN_UP_USE_CASE,
      () =>
        new SignUpUseCase(
          this.get(RepositoryKeys.I_AUTH_SERVICE),
          this.get(RepositoryKeys.I_USER_REPOSITORY)
        )
    );

    this.factories.set(
      UseCaseKeys.GET_USER_PRODUCTS_USE_CASE,
      () =>
        new GetUserProductsUseCase(
          this.get(RepositoryKeys.I_PRODUCT_REPOSITORY)
        )
    );

    this.factories.set(
      UseCaseKeys.GET_PRODUCTS_USE_CASE,
      () =>
        new GetProductsUseCase(this.get(RepositoryKeys.I_PRODUCT_REPOSITORY))
    );

    this.factories.set(
      UseCaseKeys.UPDATE_USER_PROFILE_USE_CASE,
      () =>
        new UpdateUserProfileUseCase(
          this.get(RepositoryKeys.I_USER_REPOSITORY),
          this.get(RepositoryKeys.I_AUTH_SERVICE)
        )
    );
  }

  // Método com type inference automático e lazy loading
  get<K extends keyof AllTypeMap>(key: K): AllTypeMap[K] {
    // Se já existe instância, retorna ela
    if (this.dependencies.has(key)) {
      return this.dependencies.get(key) as AllTypeMap[K];
    }

    // Se não existe, cria agora (lazy loading)
    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`Dependency ${key} not found`);
    }

    const instance = factory();
    this.dependencies.set(key, instance); // Cacheia a instância
    return instance as AllTypeMap[K];
  }

  // Método genérico mantido para compatibilidade (opcional)
  getGeneric<T>(key: string): T {
    const dependency = this.dependencies.get(key);
    if (!dependency) {
      throw new Error(`Dependency ${key} not found`);
    }
    return dependency as T;
  }
}

export const container = DIContainer.getInstance();
