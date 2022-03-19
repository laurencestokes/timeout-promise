module.exports = {
    collectCoverageFrom: [
        './src/*.{js,jsx,ts,tsx}',
        // './server/*.{js,jsx,ts,tsx}',
        // './shared/*.{js,jsx,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
    coveragePathIgnorePatterns: ['node_modules', '.mock.ts', 'dist'],
    coverageReporters: ['json-summary', 'clover', 'json', 'lcov', ['text', { skipFull: true }]],
    modulePaths: ['<rootDir>/'],
    moduleNameMapper: {},
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
};
