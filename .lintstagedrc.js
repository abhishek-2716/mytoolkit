/** @type {import('lint-staged').Config} */
export default {
  // TypeScript/TSX: run ESLint (read-only check to block bad commits)
  // then Prettier to auto-format the staged file.
  // ESLint runs on the whole package because type-aware rules need full context.
  'apps/frontend/src/**/*.{ts,tsx}': [
    () => 'pnpm --filter @toolnest/frontend lint',
    'prettier --write',
  ],

  // Config files — format only (ESLint intentionally not applied to configs)
  '**/*.{js,jsx,mjs,cjs}': ['prettier --write'],

  // Data & markup — format only
  '**/*.{json,yaml,yml}': ['prettier --write'],
  '**/*.md': ['prettier --write --prose-wrap always'],
  '**/*.css': ['prettier --write'],
}
