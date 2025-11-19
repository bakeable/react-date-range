module.exports = {
  verbose: true,
  testURL: 'http://localhost/',
  setupFiles: ['<rootDir>/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/demo/dist/'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: {
    '^date-fns/(.+)$': 'date-fns/$1.cjs',
    '^date-fns/locale/(.+)$': 'date-fns/locale/$1.cjs',
  },
};
