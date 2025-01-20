npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @nx/jest


/* jest.config.ts */
export default {
  displayName: 'root',
  preset: './jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: './coverage',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Optional: for global test setup
};