import { User } from './User';

describe('User Entity', () => {
  describe('constructor', () => {
    it('should create a valid user with all required fields', () => {
      // Arrange & Act
      const user = new User(
        '1',
        'John Doe',
        'john@example.com',
        '(11) 99999-9999',
        'avatar.jpg'
      );

      // Assert
      expect(user.id).toBe('1');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.phone).toBe('(11) 99999-9999');
      expect(user.avatar).toBe('avatar.jpg');
    });

    it('should throw error when id is empty', () => {
      // Act & Assert
      expect(() => {
        new User(
          '',
          'John Doe',
          'john@example.com',
          '(11) 99999-9999',
          'avatar.jpg'
        );
      }).toThrow('User ID is required');
    });

    it('should throw error when name is empty', () => {
      // Act & Assert
      expect(() => {
        new User('1', '', 'john@example.com', '(11) 99999-9999', 'avatar.jpg');
      }).toThrow('User name is required');
    });

    it('should throw error when email is empty', () => {
      // Act & Assert
      expect(() => {
        new User('1', 'John Doe', '', '(11) 99999-9999', 'avatar.jpg');
      }).toThrow('User email is required');
    });

    it('should throw error when email format is invalid', () => {
      // Act & Assert
      expect(() => {
        new User(
          '1',
          'John Doe',
          'invalid-email',
          '(11) 99999-9999',
          'avatar.jpg'
        );
      }).toThrow('Invalid email format');
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email', () => {
      // Arrange
      const user = new User(
        '1',
        'John Doe',
        'john@example.com',
        '(11) 99999-9999',
        'avatar.jpg'
      );

      // Act & Assert
      expect(user.isValidEmail()).toBe(true);
    });

    it('should return false for invalid email', () => {
      // Arrange & Act & Assert
      expect(() => {
        new User(
          '1',
          'John Doe',
          'invalid-email',
          '(11) 99999-9999',
          'avatar.jpg'
        );
      }).toThrow('Invalid email format');
    });
  });

  describe('hasValidPhone', () => {
    it('should return true for valid phone format', () => {
      // Arrange
      const user = new User(
        '1',
        'John Doe',
        'john@example.com',
        '(11) 99999-9999',
        'avatar.jpg'
      );

      // Act & Assert
      expect(user.hasValidPhone()).toBe(true);
    });

    it('should return false for invalid phone format', () => {
      // Arrange
      const user = new User(
        '1',
        'John Doe',
        'john@example.com',
        '11999999999',
        'avatar.jpg'
      );

      // Act & Assert
      expect(user.hasValidPhone()).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('should return new user with updated profile', () => {
      // Arrange
      const user = new User(
        '1',
        'John Doe',
        'john@example.com',
        '(11) 99999-9999',
        'avatar.jpg'
      );

      // Act
      const updatedUser = user.updateProfile(
        'Jane Doe',
        '(11) 88888-8888',
        'new-avatar.jpg'
      );

      // Assert
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.email).toBe(user.email);
      expect(updatedUser.name).toBe('Jane Doe');
      expect(updatedUser.phone).toBe('(11) 88888-8888');
      expect(updatedUser.avatar).toBe('new-avatar.jpg');
    });
  });

  describe('equals', () => {
    it('should return true for same user id', () => {
      // Arrange
      const user1 = new User(
        '1',
        'John Doe',
        'john@example.com',
        '(11) 99999-9999',
        'avatar.jpg'
      );
      const user2 = new User(
        '1',
        'Jane Doe',
        'jane@example.com',
        '(11) 88888-8888',
        'avatar2.jpg'
      );

      // Act & Assert
      expect(user1.equals(user2)).toBe(true);
    });

    it('should return false for different user id', () => {
      // Arrange
      const user1 = new User(
        '1',
        'John Doe',
        'john@example.com',
        '(11) 99999-9999',
        'avatar.jpg'
      );
      const user2 = new User(
        '2',
        'John Doe',
        'john@example.com',
        '(11) 99999-9999',
        'avatar.jpg'
      );

      // Act & Assert
      expect(user1.equals(user2)).toBe(false);
    });
  });
});
