const fsd = require('./common/fsd-eslint.cjs');

module.exports = {
  globals: {
    process: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es6: true,
    browser: true,
    amd: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.js', '.jsx'],
    },
    'import/resolver': {
      alias: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
    ...fsd.eslint.settings,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    ...fsd.eslint.extends,
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    "plugin:tailwindcss/recommended"
  ],
  plugins: [
    ...fsd.eslint.plugins,
    'prettier',
    'react',
    'react-hooks',
    '@typescript-eslint',
    "tailwindcss"
  ],
  rules: {
    'no-duplicate-imports': 'error',
    'no-trailing-spaces': 'error',
    'react/react-in-jsx-scope': 'off',
    'import/no-unresolved': [
      'error',
      {
        ignore: ['\\.svg'],
      },
    ],
    'max-len': [
      'warn',
      {
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
        code: 80,
        comments: 600,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        ignoreStrings: true,
      },
    ],
    'no-console': [
      'error',
      {
        allow: ['error', 'warn', 'info'],
      },
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 0,
      },
    ],
    'object-shorthand': 'error',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        printWidth: 80,
        tabWidth: 2,
        trailingComma: 'all',
        semi: true,
        singleQuote: true,
      },
    ],
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-curly-brace-presence': ['error', { props: "always", children: "ignore" }],
    'no-empty-interface': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    "@typescript-eslint/no-explicit-any": "error",
    'tailwindcss/classnames-order': "error",
    'tailwindcss/no-custom-classname': "off",
    'import/order': [
      'error',
      {
        groups: [
          ['external'],
          ['builtin'],
          ['internal'],
          ['parent'],
          ['sibling'],
          ['object'],
          ['index'],
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    ...fsd.eslint.rules,
  },
};
