/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const merge = require('merge');
const mongoDbJest = require('@shelf/jest-mongodb/jest-preset');

module.exports = merge.recursive(mongoDbJest, {
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: [path.join(__dirname, 'dist/test-utils/setup.js')],
  testPathIgnorePatterns: [
    '<rootDir>/src/',
    '<rootDir>/node_modules/',
    '\\.d\\.ts$',
  ],
});
