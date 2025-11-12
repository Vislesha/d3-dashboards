module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  collectCoverageFrom: [
    'projects/d3-dashboards/src/lib/**/*.ts',
    '!projects/d3-dashboards/src/lib/**/*.spec.ts',
    '!projects/d3-dashboards/src/lib/**/public-api.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapper: {
    '^d3-dashboards$': '<rootDir>/projects/d3-dashboards/src/public-api.ts'
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$'
      }
    ]
  }
};

