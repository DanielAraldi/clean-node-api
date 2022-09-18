module.exports = {
  // Performs test coverage
  roots: ["<rootDir>/src"],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*.d.ts",
    "!<rootDir>/src/main/server.ts",
    "!<rootDir>/src/domain/**",
    "!<rootDir>/src/**/*protocols.ts",
    "!<rootDir>/src/**/protocols/**",
    "!**/tests/**", // Does not cover tests in locations that have the tests folder
  ], // Where jest will be applied
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  preset: "@shelf/jest-mongodb",
  transform: {
    // add to any text that has .ts the ts-jest, converted for ts to js
    ".+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    // allows jest to recognize tests that start with import with alias of "@/"
    "@/(.*)": "<rootDir>/src/$1",
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  // transformIgnorePatterns: [
  //   "\\\\node_modules\\\\",
  //   "\\.pnp\\.[^\\\\]+$"
  // ],

  // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
  // unmockedModulePathPatterns: undefined,

  // Indicates whether each individual test should be reported during the run
  // verbose: undefined,

  // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
  // watchPathIgnorePatterns: [],

  // Whether to use watchman for file crawling
  // watchman: true,
};
