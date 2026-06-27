/** @type {import('lint-staged').Config} */
export default {
  "**/*.{ts,tsx,js,jsx,mjs,cjs}": ["prettier --write"],
  "**/*.{json,yaml,yml}": ["prettier --write"],
  "**/*.md": ["prettier --write --prose-wrap always"],
  "**/*.css": ["prettier --write"],
};
