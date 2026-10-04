export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
  setupFiles: ['<rootDir>/tests/setup.ts'],
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/services/**/*.ts'],
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
};
