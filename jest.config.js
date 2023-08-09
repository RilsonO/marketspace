module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/src/__mocks__/async-storage.ts',
    '^@react-navigation/native$': '<rootDir>/src/__mocks__/navigation.ts',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
    'node_modules/(?!@react-native|react-native)',
    '/node_modules/(?!native-base)/',
  ],
  cacheDirectory: '.jest/cache',
};
