/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
};
