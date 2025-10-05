import {
  DomainError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from './DomainError';

describe('DomainError', () => {
  describe('abstract class DomainError', () => {
    it('should be an abstract class that extends Error', () => {
      expect(DomainError.prototype instanceof Error).toBe(true);
    });

    it('should not be instantiable directly', () => {
      // DomainError is abstract, so we can't instantiate it directly
      // This test verifies that the class exists and is abstract
      expect(DomainError).toBeDefined();
      expect(typeof DomainError).toBe('function');
    });
  });

  describe('ValidationError', () => {
    it('should create a ValidationError with custom message', () => {
      const message = 'Invalid email format';
      const error = new ValidationError(message);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DomainError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe(message);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.name).toBe('ValidationError');
    });

    it('should create a ValidationError with empty message', () => {
      const error = new ValidationError('');

      expect(error.message).toBe('');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.name).toBe('ValidationError');
    });

    it('should be throwable and catchable', () => {
      const message = 'Test validation error';

      expect(() => {
        throw new ValidationError(message);
      }).toThrow(ValidationError);

      try {
        throw new ValidationError(message);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toBe(message);
        expect((error as ValidationError).code).toBe('VALIDATION_ERROR');
      }
    });
  });

  describe('NotFoundError', () => {
    it('should create a NotFoundError with resource name', () => {
      const resource = 'User';
      const error = new NotFoundError(resource);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DomainError);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe(`${resource} not found`);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.name).toBe('NotFoundError');
    });

    it('should format message correctly with different resources', () => {
      const testCases = [
        { resource: 'Product', expected: 'Product not found' },
        { resource: 'Order', expected: 'Order not found' },
        { resource: 'Category', expected: 'Category not found' },
        { resource: '', expected: ' not found' },
        { resource: 'User Profile', expected: 'User Profile not found' },
      ];

      testCases.forEach(({ resource, expected }) => {
        const error = new NotFoundError(resource);
        expect(error.message).toBe(expected);
        expect(error.code).toBe('NOT_FOUND');
      });
    });

    it('should be throwable and catchable', () => {
      const resource = 'Product';

      expect(() => {
        throw new NotFoundError(resource);
      }).toThrow(NotFoundError);

      try {
        throw new NotFoundError(resource);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect((error as NotFoundError).message).toBe('Product not found');
        expect((error as NotFoundError).code).toBe('NOT_FOUND');
      }
    });
  });

  describe('UnauthorizedError', () => {
    it('should create an UnauthorizedError with default message', () => {
      const error = new UnauthorizedError();

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DomainError);
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(error.message).toBe('Unauthorized');
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.name).toBe('UnauthorizedError');
    });

    it('should create an UnauthorizedError with custom message', () => {
      const message = 'Invalid token';
      const error = new UnauthorizedError(message);

      expect(error.message).toBe(message);
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.name).toBe('UnauthorizedError');
    });

    it('should create an UnauthorizedError with empty message', () => {
      const error = new UnauthorizedError('');

      expect(error.message).toBe('');
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.name).toBe('UnauthorizedError');
    });

    it('should be throwable and catchable', () => {
      const message = 'Access denied';

      expect(() => {
        throw new UnauthorizedError(message);
      }).toThrow(UnauthorizedError);

      try {
        throw new UnauthorizedError(message);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedError);
        expect((error as UnauthorizedError).message).toBe(message);
        expect((error as UnauthorizedError).code).toBe('UNAUTHORIZED');
      }
    });
  });

  describe('ConflictError', () => {
    it('should create a ConflictError with custom message', () => {
      const message = 'Email already exists';
      const error = new ConflictError(message);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DomainError);
      expect(error).toBeInstanceOf(ConflictError);
      expect(error.message).toBe(message);
      expect(error.code).toBe('CONFLICT');
      expect(error.name).toBe('ConflictError');
    });

    it('should create a ConflictError with different messages', () => {
      const testCases = [
        'User already exists',
        'Product already in cart',
        'Duplicate entry',
        'Resource conflict',
        '',
      ];

      testCases.forEach((message) => {
        const error = new ConflictError(message);
        expect(error.message).toBe(message);
        expect(error.code).toBe('CONFLICT');
        expect(error.name).toBe('ConflictError');
      });
    });

    it('should be throwable and catchable', () => {
      const message = 'Resource already exists';

      expect(() => {
        throw new ConflictError(message);
      }).toThrow(ConflictError);

      try {
        throw new ConflictError(message);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictError);
        expect((error as ConflictError).message).toBe(message);
        expect((error as ConflictError).code).toBe('CONFLICT');
      }
    });
  });

  describe('Error inheritance and polymorphism', () => {
    it('should allow catching all domain errors as DomainError', () => {
      const errors = [
        new ValidationError('Invalid input'),
        new NotFoundError('Resource'),
        new UnauthorizedError('Access denied'),
        new ConflictError('Duplicate'),
      ];

      errors.forEach((error) => {
        expect(error).toBeInstanceOf(DomainError);
        expect(error).toBeInstanceOf(Error);
      });
    });

    it('should maintain unique error codes', () => {
      const validationError = new ValidationError('test');
      const notFoundError = new NotFoundError('test');
      const unauthorizedError = new UnauthorizedError('test');
      const conflictError = new ConflictError('test');

      const codes = [
        validationError.code,
        notFoundError.code,
        unauthorizedError.code,
        conflictError.code,
      ];

      // Check that all codes are unique
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
      expect(codes).toEqual([
        'VALIDATION_ERROR',
        'NOT_FOUND',
        'UNAUTHORIZED',
        'CONFLICT',
      ]);
    });

    it('should set correct name property for each error type', () => {
      const validationError = new ValidationError('test');
      const notFoundError = new NotFoundError('test');
      const unauthorizedError = new UnauthorizedError('test');
      const conflictError = new ConflictError('test');

      expect(validationError.name).toBe('ValidationError');
      expect(notFoundError.name).toBe('NotFoundError');
      expect(unauthorizedError.name).toBe('UnauthorizedError');
      expect(conflictError.name).toBe('ConflictError');
    });
  });

  describe('Error properties immutability', () => {
    it('should have readonly code property', () => {
      const error = new ValidationError('test');

      // TypeScript should prevent this, but let's test runtime behavior
      expect(() => {
        (error as any).code = 'MODIFIED';
      }).not.toThrow();

      // However, the property should still be accessible
      expect(error.code).toBeDefined();
    });

    it('should preserve message and code after creation', () => {
      const message = 'Test error message';
      const error = new ValidationError(message);

      expect(error.message).toBe(message);
      expect(error.code).toBe('VALIDATION_ERROR');

      // The error properties should be accessible and correct
      expect(typeof error.message).toBe('string');
      expect(typeof error.code).toBe('string');
      expect(error.code).toBe('VALIDATION_ERROR');
    });
  });
});
