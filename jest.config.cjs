// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
