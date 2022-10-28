const esModules = ['@iconify-icons'].join('|');

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    //"^.+\\.(t|j)s$": "ts-jest"
    '^.+\\.ts?$': 'ts-jest',
    "^.+\\.js$": "babel-jest"
  },
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  modulePathIgnorePatterns: ["./dist/", "./test/mocks.ts"],
  coveragePathIgnorePatterns: ["./test/mocks.ts"],
};
