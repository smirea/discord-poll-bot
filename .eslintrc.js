module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    plugins: [
        'prettier',
        '@typescript-eslint',
        'jest',
        'import',
        'react',
    ],
    settings: {
        'import/resolver': {
            'node': {
                'extensions': ['.js', '.jsx', '.ts', '.tsx'
                ]
            }
        },
    },
    globals: {
        STYLUS: 'readonly',
        _: 'readonly',
    },
    env: {
        'jest/globals': true,
        node: true,
        browser: true,
    },
    ignorePatterns: ['.eslintrc.js', 'generated/**'],
    extends: [
        'prettier',
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        'prettier/prettier': 1,

        // typescript rules
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/consistent-type-imports': 1,
        '@typescript-eslint/default-param-last': 1,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/member-delimiter-style': 1,
        '@typescript-eslint/no-confusing-non-null-assertion': 2,
        '@typescript-eslint/no-duplicate-imports': 1,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-empty-interface': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-extra-non-null-assertion': 2,
        '@typescript-eslint/no-floating-promises': 2,
        '@typescript-eslint/no-for-in-array': 2,
        '@typescript-eslint/no-implied-eval': 2,
        '@typescript-eslint/no-inferrable-types': 1,
        '@typescript-eslint/no-invalid-this': 2,
        '@typescript-eslint/no-misused-new': 2,
        '@typescript-eslint/no-namespace': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-this-alias': 2,
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 1,
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            },
        ],
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/switch-exhaustiveness-check': 2,
        '@typescript-eslint/type-annotation-spacing': 1,
        '@typescript-eslint/unified-signatures': 1,

        // eslint rules
        'array-bracket-spacing': 1,
        'arrow-spacing': 1,
        'block-spacing': 1,
        'comma-dangle': [1, 'always-multiline'],
        'comma-spacing': 1,
        'comma-style': 1,
        'computed-property-spacing': 1,
        'func-call-spacing': 1,
        'key-spacing': 1,
        'keyword-spacing': 1,
        'no-console': [0, { allow: ['trace', 'clear'] }],
        'no-multi-spaces': 1,
        'no-trailing-spaces': 1,
        'no-unused-vars': 'off',
        'no-whitespace-before-property': 1,
        'object-curly-spacing': [1, 'always'],
        'prefer-const': 1,
        'prefer-object-spread': 1,
        'quotes': [1, 'single', { avoidEscape: true }],
        'rest-spread-spacing': 1,
        'semi-spacing': 1,
        'semi': [1, 'always'],
        'space-infix-ops': 1,
        'spaced-comment': 1,
        'template-curly-spacing': 1,
        'template-tag-spacing': 2,
        'yield-star-spacing': 1,
        'jsx-quotes': [1, 'prefer-single'],

        'import/newline-after-import': [1, { count: 1 }],
        'import/no-unresolved': 0,
        'import/order': [
            1,
            {
                'newlines-between': 'always',
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    ['index', 'sibling', 'parent'],
                    'object',
                    'type',
                ],
            },
        ],

        // react rules
        'react/jsx-curly-brace-presence': 1,
    },
};
