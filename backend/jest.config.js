// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFiles: ['dotenv/config'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
};