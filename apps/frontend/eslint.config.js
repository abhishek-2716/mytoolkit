import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import prettierConfig from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // ── Ignored paths ───────────────────────────────────────────
  { ignores: ['dist', 'node_modules', 'coverage'] },

  // ── TypeScript + React rules ─────────────────────────────────
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      // Disables ESLint formatting rules that conflict with Prettier
      prettierConfig,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        // Both tsconfigs: app covers src/, node covers vite.config.ts
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // ── React ──────────────────────────────────────────────────
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // ── Accessibility ──────────────────────────────────────────
      ...jsxA11y.flatConfigs.recommended.rules,

      // ── Import ordering ────────────────────────────────────────
      // Groups follow the spec: external → internal → components →
      // hooks → services → utils/config → types → styles → relative
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. External packages (react first, then others)
            ['^react', '^@?\\w'],
            // 2. Internal monorepo packages
            ['^@toolnest/'],
            // 3. Components & features
            ['^@/components', '^@/features', '^@/layouts', '^@/pages'],
            // 4. Hooks
            ['^@/hooks'],
            // 5. Services & providers
            ['^@/services', '^@/providers'],
            // 6. Utilities, config, constants
            ['^@/utils', '^@/config', '^@/constants'],
            // 7. Types
            ['^@/types'],
            // 8. Store
            ['^@/store'],
            // 9. Styles & assets
            ['^@/styles', '^@/assets'],
            // 10. Other internal aliases
            ['^@/'],
            // 11. Relative imports
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // ── TypeScript ─────────────────────────────────────────────
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // Allow numbers and booleans in template literals (very common in JSX)
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: true },
      ],

      // ── General ────────────────────────────────────────────────
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
    },
  }
)
