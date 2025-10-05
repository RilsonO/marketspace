import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IProductRepository } from '../../domain/interfaces/IProductRepository';
import { IAuthService } from '../../domain/interfaces/IAuthService';
import { SignInUseCase } from '../../application/use-cases/auth/SignInUseCase';
import { SignUpUseCase } from '../../application/use-cases/auth/SignUpUseCase';
import { GetUserProductsUseCase } from '../../application/use-cases/products/GetUserProductsUseCase';
import { GetProductsUseCase } from '../../application/use-cases/products/GetProductsUseCase';
import { UpdateUserProfileUseCase } from '../../application/use-cases/user/UpdateUserProfileUseCase';
import { RepositoryKeys, UseCaseKeys } from '../enums';

// Type mapping para Repositories
export interface RepositoryTypeMap {
  [RepositoryKeys.I_USER_REPOSITORY]: IUserRepository;
  [RepositoryKeys.I_PRODUCT_REPOSITORY]: IProductRepository;
  [RepositoryKeys.I_AUTH_SERVICE]: IAuthService;
}

// Type mapping para Use Cases
export interface UseCaseTypeMap {
  [UseCaseKeys.SIGN_IN_USE_CASE]: SignInUseCase;
  [UseCaseKeys.SIGN_UP_USE_CASE]: SignUpUseCase;
  [UseCaseKeys.GET_USER_PRODUCTS_USE_CASE]: GetUserProductsUseCase;
  [UseCaseKeys.GET_PRODUCTS_USE_CASE]: GetProductsUseCase;
  [UseCaseKeys.UPDATE_USER_PROFILE_USE_CASE]: UpdateUserProfileUseCase;
}

// Union de todos os tipos
export type AllTypeMap = RepositoryTypeMap & UseCaseTypeMap;
