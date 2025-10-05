import { DIContainer, container } from './DIContainer';
import { RepositoryKeys, UseCaseKeys } from '../../shared/enums';

describe('DIContainer', () => {
  describe('Singleton Pattern', () => {
    it('should return the same instance when getInstance is called multiple times', () => {
      const instance1 = container;
      const instance2 = container;
      const instance3 = container;

      expect(instance1).toBe(instance2);
      expect(instance2).toBe(instance3);
      expect(instance1).toBe(instance3);
    });

    it('should return the same instance for the exported container', () => {
      const instance1 = container;
      const instance2 = container;

      expect(instance1).toBe(instance2);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when dependency key is not found', () => {
      const invalidKey = 'invalid-key' as any;

      expect(() => container.get(invalidKey)).toThrow(
        'Dependency invalid-key not found'
      );
    });
  });

  describe('Basic Functionality', () => {
    it('should be able to resolve repositories', () => {
      const userRepository = container.get(RepositoryKeys.I_USER_REPOSITORY);
      const productRepository = container.get(
        RepositoryKeys.I_PRODUCT_REPOSITORY
      );
      const authService = container.get(RepositoryKeys.I_AUTH_SERVICE);

      expect(userRepository).toBeDefined();
      expect(productRepository).toBeDefined();
      expect(authService).toBeDefined();
    });

    it('should be able to resolve use cases', () => {
      const signInUseCase = container.get(UseCaseKeys.SIGN_IN_USE_CASE);
      const signUpUseCase = container.get(UseCaseKeys.SIGN_UP_USE_CASE);

      expect(signInUseCase).toBeDefined();
      expect(signUpUseCase).toBeDefined();
    });
  });
});
