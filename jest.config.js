export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    moduleFileExtensions: ['js', 'jsx'],
    moduleNameMapper: {
      '\\.(png|jpe?g|gif|webp|avif|svg)$': '<rootDir>/__mocks__/fileMock.cjs',
    },
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
  };
  
