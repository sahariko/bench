module.exports = {
    extends: [
        'eslint:recommended'
    ],
    root: true,
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    env: {
        node: true,
        es6: true
    },
    globals: {
        BigInt: false
    },
    rules: {
        'no-console': 0,
        'no-var': 2,
        'prefer-const': 2,
        semi: 2,
        quotes: [2, 'single']
    },
    overrides: [
        {
            files: ['**/spec.js', '**/*.spec.js'],
            env: {
                jest: true
            }
        }
    ]
};
