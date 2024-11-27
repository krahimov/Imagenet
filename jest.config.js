/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/constants$': '<rootDir>/__mocks__/@/constants.ts',
    '^@/(.*)$': '<rootDir>/$1',
    '^@models/(.*)$': '<rootDir>/lib/databases/models/$1',
    '^@databases/(.*)$': '<rootDir>/lib/databases/$1',
    '^@utils/(.*)$': '<rootDir>/lib/utils/$1',
  },
  setupFiles: ['<rootDir>/.jest/setEnvVars.js']
};
