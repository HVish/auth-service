/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const merge = require('merge');
const tsJest = require('ts-jest/jest-preset');

module.exports = merge.recursive(tsJest, {
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: [path.join(__dirname, 'src/test-utils/setup.ts')],
});
