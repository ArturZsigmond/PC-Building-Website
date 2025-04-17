import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  preset: "ts-jest", 
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest" 
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  }
};

export default config;
