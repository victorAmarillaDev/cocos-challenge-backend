/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  clearMocks: true,
  coverageProvider: "v8",
  moduleFileExtensions: ["js", "ts", "tsx", "json", "node"],
  roots: ["<rootDir>/src"],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
}